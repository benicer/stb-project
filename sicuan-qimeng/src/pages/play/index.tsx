import { BasePage, PageRegister } from 'stb-event';
import { render, h } from 'stb-react';
import './index.less?raw';
import { MainData } from '../../../api';
import { RootModel } from './models/root_model';
import { Json, ParseUrl, PageSource } from 'stb-tools';
import { Cookie } from 'stb-cookie';
import { ConfigBasic, Join } from '../../configs';
import { Root } from './containers/root/root';
import { Player } from "stb-player";
import { MGlobalType } from '../../logics/launch_logic';
import { Dialog } from '../../../framework/plugin';

export const enum MType {
    MediaPlayer,
    Page,
    Dialog,
    Tab,
    Episode
}
export const enum MediaType {
    Addplaylist = 'Addplaylist'
}

var event;
export var player: Player;
export function createPlayer() {
    try {
        if (!player) {
            player = new Player(MType.MediaPlayer, event);
        }
    } catch (error) {

    }
}
export function releasePlayer() {
    player && player.release();
    player = null;
}
export var dialog: Dialog;

class Page extends BasePage {
    init() {
        let source: Play.ISource = { url: this.request.back_url || "-1" };
        this.source.saveToLocal(Json.serializ(source));
        event = this.event;
        dialog = new Dialog(MType.Dialog, this.event);
    }
    load() {
        if (this.cokStatus.getCookie()) var memo: Play.IMemo = Json.deSerializ(this.cokStatus.getCookie());

        MainData.initMain().then((r) => {

            const store = new RootModel(r, this.request);

            render(<Root identCode={MType.Page} event={this.event} store={store} />, document.getElementById('root'));
        });

    }
    openBlank({ url, memo }) {
        if (memo) this.cokStatus.setCookie(Json.serializ(memo));
        else this.cokStatus.clearCookie();

        window.location.href = url;
    }
    openPrevious() {

        let source: Play.ISource = Json.deSerializ(this.source.takeToLocal());

        this.source.removeToLocal();
        this.cokStatus.clearCookie();

        if (source) {
            const { url } = source;

            // browser report
            this.event.trigger("*", MGlobalType.PreviousReport, {
                callback: () => {

                    // addplaylist
                    this.event.trigger("*", MediaType.Addplaylist, () => {

                        player && player.release();

                        if ("-1" === url) {
                            Join.backLaunch();
                        } else {
                            window.location.href = url;
                        }
                    });
                },
                url: "-1" === url ? "" : url
            });
        }
    }
}

PageRegister(Page, {
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource(new Cookie(`${ConfigBasic.mainCookieName}_play_source`)),
    cokStatus: new Cookie(`${ConfigBasic.mainCookieName}_play_status`)
});