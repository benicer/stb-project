import { BehaviorExt, VideoEntity } from "../../../../entitys";
import { FormatUrl } from "stb-tools";
import { MainData, AssetData } from "../../../../api";

class VideoLogic {
    /**
     * 类型
     */
    type(ntt: VideoEntity) {
        if (!ntt) return "";

        let { video_type } = ntt, type = "";

        if ("1" == video_type) type = "电影";
        else if ("2" == video_type) type = "电视剧";
        else if ("3" == video_type) type = "综艺";
        else if ("4" == video_type) type = "动漫";
        else if ("5" == video_type) type = "音乐";
        else if ("6" == video_type) type = "纪实";
        else if ("7" == video_type) type = "教育";
        else if ("8" == video_type) type = "教育";
        else if ("9" == video_type) type = "生活";
        else if ("10" == video_type) type = "财经";
        else if ("11" == video_type) type = "微电影";
        else if ("12" == video_type) type = "品牌";
        else if ("13" == video_type) type = "新闻";
        else if ("14" == video_type) type = "广告";
        else if ("15" == video_type) type = "公开课";
        else if ("16" == video_type) type = "外语节目";
        else if ("17" == video_type) type = "青少年";
        else if ("18" == video_type) type = "博客";
        else if ("19" == video_type) type = "少儿";
        else if ("20" == video_type) type = "K12";
        else if ("211" == video_type) type = "少儿蒙学";
        else if ("22" == video_type) type = "中小学国学";
        else if ("23" == video_type) type = "大咖讲国学";
        else if ("24" == video_type) type = "动画";
        else if ("25" == video_type) type = "国学";
        else if ("26" == video_type) type = "英语";
        else if ("27" == video_type) type = "儿歌";
        else if ("28" == video_type) type = "益智";
        else if ("29" == video_type) type = "游戏";
        else type = "其他";

        return type;
    }
    /**
     * 类型标签
     */
    label(ntt: VideoEntity) {
        if (!ntt) return "";

        let type = this.type(ntt);

        const { label } = ntt;

        let gender: any = "";
        // 细分类优先
        if (label && label.genre && label.genre.item.length) {
            gender = label.genre.item.map((v) => {
                return v.item_title;
            }).toString();
            for (let i = 0; i < label.genre.item.length; i++) {
                gender = gender.replace(",", "/");
            }
        }
        return gender || type;
    }
    /**
     * 发布时间
     */
    release(ntt: VideoEntity) {
        if (!ntt || !ntt.release_date) return "";
        const { release_date } = ntt;
        return release_date.substr(0, 4);
    }
    /**
     * js截取字符串，中英文都能用
     * @param str：需要截取的字符串
     * @param len: 需要截取的长度(英文长度)
     * @param type: 截取后的后缀字符串默认"...",若不要请传参数"".
     */
    substr(str: string, len: number, type: any) {
        type = type == null ? "..." : type;
        let str_length = 0;
        let str_len: any;
        let str_cut = new String();
        let str_arry: any

        str_len = str.length;
        let sArr = str.match(/[^\x00-\xff]/ig);
        let strL = str_len + (sArr == null ? 0 : sArr.length);
        if (strL <= len + 3) {
            return str;
        }
        for (let i = 0; i < str_len; i++) {
            let a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                str_length++;
            }
            str_cut = str_cut.concat(a);
            // str_cut.push(a);
            if (str_length >= len) {
                str_cut = str_cut.concat(type);
                return str_cut;
            }
        }
        str_cut = null;
    }
}
export {
    VideoLogic
}