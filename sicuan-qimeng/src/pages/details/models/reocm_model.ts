import { MainEntity, VideoEntity } from "../../../../entitys";
import { observable } from "mobx";
import { VideoData } from "../../../../api";
import { IModel } from "stb-react";

class RecommendModel implements IModel{
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    getIndex: () => number;

    private readonly nttMain: MainEntity;

    @observable
    dataList: VideoEntity[] = [];

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }

    /**
     * 初始
     */
    init(videoId) {
        return new Promise((resolve) => {
            new VideoData().recommend({ video_id: videoId, token: this.nttMain.token, business_code: this.nttMain.global_variable.business_code, fetch: 5 }).then((r) => {
                if (r._success) {

                    this.dataList = r.data.list;

                    resolve();
                }
            });


        });
    }


}

export default RecommendModel;