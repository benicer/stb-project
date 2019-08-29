import { MainEntity, VideoEntity } from "../../../../entitys";
import { RecordData } from "../../../../api";
import { observable } from "mobx";
import { CollectData } from "../../../../api/collect_data";
import { PageLogic, Paging } from "stb-decorator";
import { IModel } from "stb-react";
import { MType } from "..";
import { SetTimeout } from "stb-tools";

class ListModel extends PageLogic implements IModel {
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    getIndex: () => number;

    private readonly nttMain: MainEntity;

    @observable
    method: Record.IColumn;

    @observable
    dataList: VideoEntity[] = [];

    paging: Paging;

    constructor(nttMain: MainEntity, packageKey: string, pageSize = 10) {
        super(pageSize);
        this.nttMain = nttMain;
    }

    protected getData(pageIndex: number): Promise<any[]> {
        return new Promise((resolve) => {
            if ('watch' === this.method) {
                // list
                new RecordData().get({ page_number: pageIndex, page_size: this.paging.getPageSize(), token: this.nttMain.token }).then((r) => {
                    if (r._success) {

                        if (!this.paging.getDataSize()) {
                            this.paging.setDataSize(Number(r.data.total));
                        }

                        resolve(r.data.list);
                    } else {
                        resolve([]);
                    }
                })
            }
            else if ('collect' === this.method) {
                // list
                new CollectData().get({ page_number: pageIndex, page_size: this.paging.getPageSize(), token: this.nttMain.token }).then((r) => {
                    if (r._success) {

                        if (!this.paging.getDataSize()) {
                            this.paging.setDataSize(Number(r.data.total));
                        }

                        resolve(r.data.list);
                    } else {
                        resolve([]);
                    }
                })
            }
        });
    }

    init(method: Record.IColumn, memo?: Record.IMemo) {

        return new Promise((resolve, rejects) => {
            this.method = method;

            this.paging = new Paging(this.cuteRange);

            if (memo) {
                this.setIndex(memo.index);
            }

            this.dataList = [];
            this.toIndex(this.paging.getPageIndex()).then((l) => {
                let index = this.getIndex();

                if (l.length && index >= l.length) {
                    this.setIndex(l.length - 1);
                }

                new SetTimeout(0).enable(() => {
                    this.dataList = l;

                    resolve();
                });

            });
        })

    }

    removeAt(videoId) {
        return new Promise((resolve, reject) => {
            // 历史记录
            if ('watch' === this.method) {
                new RecordData().del({ token: this.nttMain.token, video_id: videoId }).then((r) => {

                    if (r.data) {
                        var data = this.dataList, len = data.length, s;

                        for (let i = 0; i < data.length; i++) {
                            const e = data[i];

                            if (e.video_id === videoId) {
                                s = i;
                                break;
                            }
                        }

                        if (undefined !== s) this.dataList.splice(s, 1);

                        if (this.dataList.length >= this.getIndex()) {
                            this.setFocus(this.dataList.length - 1);
                        }

                        resolve(this.dataList);
                    }
                })
            }
            // 收藏记录
            else if ('collect' === this.method) {
                new CollectData().cancel({ token: this.nttMain.token, video_id: videoId }).then((r) => {

                    if (r.data) {
                        var data = this.dataList, len = data.length, s;

                        for (let i = 0; i < data.length; i++) {
                            const e = data[i];

                            if (e.video_id === videoId) {
                                s = i;
                                break;
                            }
                        }

                        if (undefined !== s) this.dataList.splice(s, 1);

                        if (this.dataList.length >= this.getIndex()) {
                            this.setFocus(this.dataList.length - 1);
                        }

                        resolve(this.dataList);
                    }
                })
            }
        })

    }
}
export {
    ListModel
}