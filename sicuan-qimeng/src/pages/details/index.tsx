import './index.less?raw';
import { BasePage, PageRegister } from 'stb-event';
import { render, h } from 'stb-react';
import Root from './containers/root/root';
import { MainData } from '../../../api';
import RootModel from './models/root_model';
import { Json, ParseUrl, PageSource } from 'stb-tools';
import { Cookie } from 'stb-cookie';
import { ConfigBasic, Join } from '../../configs';
import { Player } from 'stb-player';
import { MGlobalType } from '../../logics/launch_logic';
import { log } from '../../configs/config.tool';

export const enum MType {
    Video,
    Button,
    Recommend,
    Layer,
    Intro,
    Tab,
    Episode,
    MediaPlayer
}

var event;
export var player: Player;
export function createPlayer() {
    try {
        player = new Player(MType.MediaPlayer, event);
    } catch (error) {

    }
}
export function releasePlayer() {
    player && player.release();
    player = null;
}

class Page extends BasePage {
    init() {
        let source: Details.ISource = {
            url: this.request.back_url || "-1"
        }
        this.source.saveToLocal(Json.serializ(source));
        event = this.event;
    }
    load() {
        if (this.cokStatus.getCookie()) var memo: Details.IMemo = Json.deSerializ(this.cokStatus.getCookie());

        MainData.initMain().then((r) => {

            const store = new RootModel(r, this.request, null);

            render(<Root identCode={undefined} event={this.event} store={store} />, document.getElementById('root'));

            this.event.target(MType.Recommend);
        });

    }
    openBlank({ url, memo }) {
        if (memo) this.cokStatus.setCookie(Json.serializ(memo));
        else this.cokStatus.clearCookie();

        // browser report
        this.event.trigger("*", MGlobalType.BlankReport, {
            callback: () => {

                releasePlayer();
                window.location.href = url;
            }, url
        });
    }
    openPrevious() {
        let source: Details.ISource = Json.deSerializ(this.source.takeToLocal());

        this.source.removeToLocal();
        this.cokStatus.clearCookie();

        if (source) {
            const { url } = source;

            // browser report
            this.event.trigger("*", MGlobalType.PreviousReport, {
                callback: () => {

                    releasePlayer();

                    if ("-1" === url) {
                        Join.backLaunch();
                    } else {
                        window.location.href = url;
                    }
                },
                url: "-1" === url ? "" : url
            });
        }
    }
}

PageRegister(Page, {
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource(new Cookie(`${ConfigBasic.mainCookieName}_details_source`)),
    cokStatus: new Cookie(`${ConfigBasic.mainCookieName}_details_status`)
});