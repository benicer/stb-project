
import { Dictionary } from "stb-conllection";
import { Json } from "stb-tools";
import { CookieLogic } from "../../api/cookie_data";

const lgcCok = new CookieLogic();
const cache = new Dictionary();

export class Cookie {
    private key: any;
    constructor(key: string) {
        this.key = key;
    }
    setCookie(value: string, params?: any) {
        lgcCok.add({
            user: UserID,
            act: "set",
            key: this.key,
            val: encodeURIComponent(value)
        }, (info) => {
        })
    }
    getCookie() {
        let val = "";
        lgcCok.get({
            user: UserID,
            act: "get",
            key: this.key
        }, (info) => {
            if (info._response.result) {
                if (info._response.result[this.key] && typeof info._response.result[this.key] !== "string") {
                    val = Json.serializ(info._response.result[this.key]);
                } else {
                    val = info._response.result[this.key];
                }
            }
        });
        return val;
    }
    clearCookie() {
        lgcCok.del({
            user: UserID,
            act: "del",
            key: this.key
        }, (info) => {
        });
    }
}
