import { VideoEntity } from "../../../../entitys";
import { FormatUrl } from "stb-tools";

class ListLogic {
    // url
    getUrl(ntt: VideoEntity) {
        return new FormatUrl('./details.html', { video_id: ntt.id }).getEncodeURIComponent();
    }
    // memo
    getMemo(identCode: number, index: number) {
        
    } 
}
export { ListLogic }