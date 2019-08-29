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

    getTabs(pageIndex: number, pageSize: number): Promise<{ countPage: number, countData: number, list }> {
        // 真实总长度
        return new Promise((resolve, reject) => {
            let totalTab;
            const pullTabs = () => {
                const nets = [];
                totalTab = (Math.ceil(this.realTotal / this.cuteRange));
                for (let i = 0; i < pageSize; i++) {
                    const target = (pageIndex - 1) * pageSize + i + 1;
                    // 小于总长度
                    if (target <= totalTab) {
                        nets.push(new Promise((resolve, reject) => {
                            this.getData(target).then((list) => {
                                resolve({ page: target, list: list });
                            }).catch(() => {
                                resolve({ page: target, list: [] });
                            })
                        }));
                    }
                }
                Promise.all(nets).then((list) => {
                    // 计算显示
                    const ret = list.map((v: any) => {
                        return { page: v.page, value: `${v.list[0].seq}-${v.list[v.list.length - 1].seq}` }
                    });
                    resolve({ countPage: Math.ceil(totalTab / pageSize), countData: totalTab, list: ret });
                });
            }
            // 总长度初始化
            if (undefined == this.realTotal) {
                this.getData(1).then(() => {
                    pullTabs();
                });
            } else {
                pullTabs();
            }
        });
    }

    getItem(){
        return this.dataList[this.getIndex()];
    }
}
export {
    EpisodeModel
}