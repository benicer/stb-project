import { VideoData } from "../../../../api";
import { Paging, PageLogic } from "stb-decorator";
import { MainEntity } from "../../../../entitys";
import { Dictionary } from "stb-conllection";
import { IModel } from "stb-react";
import { VideoExt, VideoEntity } from "../../../../entitys/video_ntt";
import { observable } from "mobx";

class EpisodeModel extends PageLogic implements IModel {
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    getIndex: () => number;

    public paging: Paging;
    private readonly nttMain: MainEntity;
    private realTotal: number;
    ext: VideoExt;
    private readonly cache = new Dictionary();
    videoId: string;

    @observable
    dataList: VideoEntity[] = [];

    @observable
    display: boolean;

    // 选集状态
    storeStatus = new PlayStatusModel();

    constructor(size, nttMain) {
        super(size);
        this.nttMain = nttMain;
    }

    initParams(videoId: string, ext: VideoExt) {
        this.videoId = videoId;
        if (ext) {
            this.ext = ext;
        }
        this.paging = new Paging(this.cuteRange);
    }
    init({ pageIndex = 1, seq = 0 }, memo?: Details.IMemo) {

        return new Promise((resolve, rejects) => {
            this.paging = new Paging(this.cuteRange);
            this.paging.setPageIndex(pageIndex);
            let index = 0;

            this.toIndex(this.paging.getPageIndex()).then((l) => {

                // index
                let data = l, len = data.length;

                for (let i = 0; i < len; i++) {
                    const item = data[i];

                    if (seq == item.seq) {
                        index = i;
                        break;
                    }
                }

                this.setIndex(index);
                this.dataList = l;

                this.storeStatus.setIndex(index);
                this.storeStatus.setPage(pageIndex);

                resolve();
            });
        })
    }

    recoverPlayStatus() {
        return new Promise((resolve, rejects) => {
            // recover page
            const pageIndex = this.storeStatus.getPage();

            // recover index
            const index = this.storeStatus.getIndex();

            this.paging.setPageIndex(pageIndex);

            this.toIndex(this.paging.getPageIndex()).then((l) => {
                this.setIndex(index);
                this.dataList = l;

                resolve();
            });
        })
    }
    protected getData(index): Promise<any[]> {
        const pageSize = this.paging.getPageSize();
        const pageIndex = index;

        return new Promise((resolve, reject) => {
            new VideoData().episode({
                video_id: this.videoId,
                page: pageIndex,
                limit: pageSize,
                order: this.ext ? this.ext.episode_order_rule : "asc",
                token: this.nttMain.token,
            }, this.cache).then((info) => {
                if (info._success) {
                    const { list, total } = info.data;
                    if (!this.paging.getCountPage()) {
                        this.paging.setDataSize(Number(total));
                        this.realTotal = Number(total) || 0;
                    }
                    resolve(list);
                } else {
                    reject();
                }
            });
        });
    }
}

class PlayStatusModel {

    // 播放状态记录
    private currentPage = 1;
    private currentIndex = 0;

    setPage(page) {
        this.currentPage = page;
    }
    getPage() {
        return this.currentPage
    }
    setIndex(index) {
        this.currentIndex = index;
    }
    getIndex() {
        return this.currentIndex;
    }
}

export {
    EpisodeModel
}