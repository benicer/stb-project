import { PageLogic, Paging } from "stb-decorator";
import { EpisodeModel } from "./episode_mode";
import { observable } from "mobx";
import { VideoEntity } from "../../../../entitys";
import { IModel } from "stb-react";
import { VideoExt } from "../../../../entitys/video_ntt";

class TabModel extends PageLogic implements IModel {
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    getIndex: () => number;
    public paging: Paging;
    private readonly con: EpisodeModel;
    ext: VideoExt;

    @observable
    dataList: { page: number, value: string }[] = [];

    constructor(size: number, con: EpisodeModel) {
        super(size);
        this.con = con;
    }
    initParams(ext: VideoExt) {
        if (ext) {
            this.ext = ext;
        }
        this.paging = new Paging(this.cuteRange);
    }
    init({ }, memo?: Details.IMemo) {

        this.paging = new Paging(this.cuteRange);

        // if (memo && this.identCode === memo.identCode) {
        //     this.paging.setPageIndex(memo.pageIndex), this.setIndex(memo.listIndex);
        // }

        return this.toIndex(this.paging.getPageIndex()).then((l) => {
            this.dataList = l;
        });
    }

    protected getData(index): Promise<any[]> {
        return new Promise((resolve) => {
            this.con.getTabs(index, this.cuteRange).then((d) => {
                this.paging.setDataSize(Number(d.countData));
                resolve(d.list);
            });
        });
    }
}
export {
    TabModel
}