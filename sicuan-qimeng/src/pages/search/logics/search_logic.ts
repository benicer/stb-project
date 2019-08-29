import { VideoEntity } from "../../../../entitys";
import { FormatUrl } from "stb-tools";
import { Tools } from "../../../configs";

class ListLogic {
    // url
    getUrl(ntt: VideoEntity) {
        return new FormatUrl('./details.html', { video_id: ntt.id ,back_url:Tools.getNeatUrl()}).getEncodeURIComponent();
    }
    // memo
    getMemo(identCode: number, index: number) {

    }
}
export { ListLogic }