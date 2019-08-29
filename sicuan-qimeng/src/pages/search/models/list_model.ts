import { MainEntity, VideoEntity } from "../../../../entitys";
import { AssetData } from "../../../../api";
import { observable } from "mobx";
import { IModel } from "stb-react";
import { PageLogic, Paging } from "stb-decorator";
import { ListLogic } from "../../list/logics/list_logic";
import { MType } from "..";
import { SetTimeout } from "stb-tools";

class ListModel extends PageLogic implements IModel {
    getIndex: () => number;
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    private readonly nttMain: MainEntity;
    private readonly packageKey: string;
    keyworlds: string;
    mode: Search.IMode = 'search';

    @observable
    dataList: VideoEntity[] = [];

    paging: Paging;

    constructor(nttMain: MainEntity, packageKey: string, pageSize = 8) {
        super(pageSize);
        this.nttMain = nttMain;
        this.packageKey = packageKey;
    }

    protected getData(pageIndex: number): Promise<any[]> {
        return new Promise((resolve, rejects) => {
            if ('search' === this.mode) {
                // list
                new AssetData().search({ keyword: this.keyworlds, package_key: this.packageKey, page_number: pageIndex, page_size: this.paging.getPageSize(), business_code: this.nttMain.global_variable.business_code, token: this.nttMain.token }).then((r) => {
                    if (r._success && r.data) {

                        if (!this.paging.getDataSize()) {
                            this.paging.setDataSize(Number(r.data.total));
                        }

                        resolve(r.data.list);
                    } else {
                        resolve([]);
                    }
                });
            }
            else if ('hot' === this.mode) {
                // hot word
                new AssetData().hotRecommend({ package_key: this.packageKey, page_number: pageIndex, page_size: this.paging.getPageSize(), business_code: this.nttMain.global_variable.business_code, token: this.nttMain.token }).then((r) => {
                    if (r._success && r.data) {

                        if (!this.paging.getDataSize()) {
                            this.paging.setDataSize(Number(8));
                        }

                        resolve(r.data.list);
                    } else {
                        resolve([]);
                    }
                })
            }
            else if ('empty' === this.mode) {
                // hot word
                new AssetData().hotRecommend({ package_key: this.packageKey, page_number: pageIndex, page_size: this.paging.getPageSize() * 2, business_code: this.nttMain.global_variable.business_code, token: this.nttMain.token }).then((r) => {
                    if (r._success && r.data) {

                        if (!this.paging.getDataSize()) {
                            this.paging.setDataSize(Number(4));
                        }
                        const list = new ListLogic().random(r.data.list, 4);

                        resolve(list);
                    } else {
                        resolve([]);
                    }
                })
            }


        });
    }

    init({ }, memo: Search.IMemo) {

        const { keyworlds, index, pageIndex } = memo;
        this.mode = memo.mode;
        this.keyworlds = memo.keyworlds;

        this.paging = new Paging(this.cuteRange);

        if (MType.List === memo.identCode) this.setIndex(index);

        // first welcome
        if ('hot' === this.mode) return this.welcome();

        // list
        else if ("search" === this.mode) {
            return this.search(keyworlds, pageIndex);
        }
        // empty
        else if ("empty" === this.mode) {
            return this.empty();
        }
    }
    welcome() {
        return new Promise((resolve, reject) => {
            this.reset('hot');
            // hot word
            this.toIndex(1).then((l) => {
                this.dataList = l;

                resolve();
            });
        });
    }
    empty() {
        return new Promise((resolve, reject) => {
            this.reset('empty');
            // empty hot word
            this.dataList = [];
            this.toIndex(1).then((l) => {
                new SetTimeout(0).enable(() => {
                    this.dataList = l;
                    resolve();
                });
            });
            
        });
    }
    search(keyworlds: string, pageIndex = 1) {
        return new Promise((reoslve, reject) => {
            this.reset('search');
            this.keyworlds = keyworlds;

            this.dataList = [];
            this.toIndex(pageIndex).then((l) => {
                if (!l.length) {
                    this.empty();
                    return;
                }

                new SetTimeout(0).enable(() => {
                    this.dataList = l;
                    reoslve();
                });
            })
        });
    }
    private reset(mode: Search.IMode) {
        this.mode = mode;
        this.paging = new Paging(this.cuteRange);
    }

}
export {
    ListModel
}