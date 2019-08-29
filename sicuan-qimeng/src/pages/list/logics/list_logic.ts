import { VideoEntity } from "../../../../entitys";
import { FormatUrl, Random } from "stb-tools";
import { Tools } from "../../../configs";

class ListLogic {
    // url
    getUrl(ntt: VideoEntity) {
        return new FormatUrl('./details.html', { video_id: ntt.id, back_url: Tools.filterParams(window.location.href, ['back_url']) }).getEncodeURIComponent();
    }
    // memo
    getMemo(identCode: number, index: number) {

    }
    random(list: VideoEntity[], maxItems: number) {
        let randoms: number[] = [], newList: VideoEntity[] = [];

        // 随机数据
        if (list.length) {

            let data = list, len = data.length;
            len = maxItems < len ? maxItems : len;

            for (let i = 0; i < len; i++) {
                let each = true, r = 0;

                do {
                    r = Random.scope(0, data.length);

                    if (randoms.every(function (i_1) {
                        return r != i_1;
                    })) {
                        randoms.push(r);
                        each = false;
                    }
                } while (each);

                newList.push(data[r]);
            }
        }
        return newList;
    }
}
export { ListLogic }