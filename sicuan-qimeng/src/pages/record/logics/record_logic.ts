import { FormatUrl } from "stb-tools";
import { Tools } from "../../../configs";

export class RecordLogic{

    // url
    getUrl(id:string) {
        return new FormatUrl('./details.html', { video_id: id, back_url: Tools.filterParams(window.location.href, ['back_url']) }).getEncodeURIComponent();
    }
}