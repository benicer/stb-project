import { ConfigApi } from "./config.api";
import { FormatUrl, ParseUrl } from "stb-tools";
import { Tips, Log } from "../../framework/plugin";

export var Tools = {
    /**
     * 清除全站数据
     */
    clearGlobalData(): Promise<any> {
        return new Promise((resolve) => {
            // pages.forEach((item) => {
            //     new Cookie(`${Config.mainCookieName}_${item}_source`).clearCookie();
            //     new Cookie(`${Config.mainCookieName}_${item}_status`).clearCookie();
            // });
            resolve();
        });
    },

    /**
     * 获取API地址
     * @param keyWorlds Config.apiPath 取值
     * @param args {*} 占位符参数列表
     */
    getApiAddress(keyWorlds: string, ...args: string[]) {
        let reg = /\{.*?\}/g;

        let url: string = ConfigApi.apiPath[keyWorlds];

        if (url) {
            let arr;
            arr = url.match(reg)
            for (let i = 0; i < args.length; i++) {
                url = url.replace(arr[i], args[i]);
            }
            return `${ConfigApi.serviceDomain}/${url}`;
        }
    },

    /**
     * 图片完整路径
     * @param path 路径
     */
    getImageAddress(path: string) {
        return path ? `${ConfigApi.imgDomain}/${ConfigApi.imgPath.public}/${path}` : "";
    },

    /**
     * 图片裁剪
     */
    getClipAddress(src: string, width: number, height: number) {
        return src + `_${width}x${height}` + src.substr(src.lastIndexOf(".", src.length));
    },

    /**
     * 域名截取
     * @param str 地址
     */
    getDomainURI(str) {
        if (!str) {
            return "";
        }
        var durl = /http:\/\/([^\/]+)\//i;
        let domain = str.match(durl);

        // 非 http:// 开头
        if (!domain) {
            durl = /([^\/]+)\//i;
            domain = str.match(durl);
        }
        return domain[1];
    },

    /**
     * URL
     */
    getNeatUrl() {
        return new FormatUrl(window.location.href, {}).getURL();
    },

    /**
     * path
     */
    getPath() {
        var url = new FormatUrl(window.location.href, {}).getURL(), path;

        if ('.html' === url.substr(url.length - 5, url.length)) {
            path = url.substr(0, url.lastIndexOf('/'));

            if ('/' !== path.substr(path.length - 1, path.length)) {
                path += '/'
            }
        } else {
            path = url;
        }

        return path;
    },

    filterParams(url, filter: string[]) {
        const params = new ParseUrl(url).getDecodeURIComponent();

        filter.forEach((v) => {
            delete params[v];
        });

        return new FormatUrl(url, params).getEncodeURIComponent();
    }
}

const tipsCom = new Tips();
const logCom = new Log();

export function tips(msg: string, duration?: number) {
    tipsCom.show(msg, duration);
};

export function log(msg: string) {
    logCom.push(msg);
}