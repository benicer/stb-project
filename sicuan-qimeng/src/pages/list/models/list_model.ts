import { MainEntity, VideoEntity } from "../../../../entitys";
import { AssetData } from "../../../../api";
import { observable } from "mobx";
import { PageLogic, Paging } from "stb-decorator";
import { Dictionary } from "stb-conllection";
import { IModel } from "stb-react";

class ListModel extends PageLogic implements IModel {
    getIndex: () => number;
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    private readonly nttMain: MainEntity;
    private readonly packageKey: string;
    private columnId: string;
    private cache = new Dictionary();

    @observable
    dataList: VideoEntity[] = [];

    paging: Paging;

    constructor(nttMain: MainEntity, packageKey: string, pageSize = 10) {
        super(pageSize);
        this.nttMain = nttMain;
        this.packageKey = packageKey;
    }

    protected getData(pageIndex: number): Promise<any[]> {
        return new Promise((resolve, rejects) => {
            // list
            new AssetData().assetVideoList({ package_key: this.packageKey, item_package_id: this.columnId, page_number: pageIndex, page_size: this.paging.getPageSize(), business_code: this.nttMain.global_variable.business_code, token: this.nttMain.token }, this.cache).then((r) => {
                if (r._success) {

                    if (!this.paging.getDataSize()) {
                        this.paging.setDataSize(Number(r.data.total));
                    }

                    resolve(r.data.list);
                } else {
                    resolve([]);
                }
            })
        });
    }

    /**
     * 初始
     */
    init(columnId, memo?: List.IMemo) {
        this.cache.clear();

        this.columnId = columnId;

        this.paging = new Paging(this.cuteRange);

        if (memo && this.identCode === memo.identCode) {
            this.paging.setPageIndex(memo.pageIndex), this.setIndex(memo.listIndex);
        }

        this.dataList.length = 0;
        return this.toIndex(this.paging.getPageIndex()).then((l) => {
            this.dataList = l;
        });


    }

}
export {
    ListModel
}