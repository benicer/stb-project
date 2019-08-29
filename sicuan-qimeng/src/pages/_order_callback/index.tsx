import { BasePage, PageRegister } from 'stb-event';
import { Json, ParseUrl, PageSource } from 'stb-tools';
import { Join, ConfigBasic } from '../../configs';
import { Cookie } from 'stb-cookie';

export const enum MType {
}

class Page extends BasePage {

    init() {
        // handler order callback
        Join.OrderCallBack(this.request);
    }

}

PageRegister(Page, {
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource(new Cookie(`${ConfigBasic.mainCookieName}_order_callback_source`)),
    cokStatus: new Cookie(`${ConfigBasic.mainCookieName}_order_callback_status`),
});