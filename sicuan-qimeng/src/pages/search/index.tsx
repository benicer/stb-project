import { BasePage, PageRegister } from 'stb-event';
import { render, h } from 'stb-react';
import './index.less?raw';
import Root from './containers/root/root';
import { MainData } from '../../../api';
import RootModel from './models/root_model';
import { Json, ParseUrl, PageSource } from 'stb-tools';
import { Cookie } from 'stb-cookie';
import { ConfigBasic, Join } from '../../configs';
import { MGlobalType } from '../../logics/launch_logic';

export const enum MType {
    Keyboard,
    List,
    BtnToggle
}

class Page extends BasePage {
    private store: RootModel;
    init() {
        let source: Search.ISource = {
            url: this.request.back_url || "-1"
        }
        this.source.saveToLocal(Json.serializ(source));
    }
    load() {
        if (this.cokStatus.getCookie()) var memo: Search.IMemo = Json.deSerializ(this.cokStatus.getCookie());

        MainData.initMain().then((r) => {

            this.store = new RootModel(r, this.request, memo);

            render(<Root event={this.event} store={this.store} />, document.getElementById('root'));
        });

    }
    openBlank({ url }) {
        const memo = this.store.getMemo(this.event.getTargetIdentCode());
        if (memo) this.cokStatus.setCookie(Json.serializ(memo));
        else this.cokStatus.clearCookie();

        // browser report
        this.event.trigger("*", MGlobalType.BlankReport, {
            callback: () => {
                window.location.href = url;
            }, url
        });
    }
    openPrevious() {

        let source: Search.ISource = Json.deSerializ(this.source.takeToLocal());

        this.source.removeToLocal();
        this.cokStatus.clearCookie();

        if (source) {
            const { url } = source;

            // browser report
            this.event.trigger("*", MGlobalType.PreviousReport, {
                callback: () => {
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
    source: new PageSource(new Cookie(`${ConfigBasic.mainCookieName}_search_source`)),
    cokStatus: new Cookie(`${ConfigBasic.mainCookieName}_search_status`)
});