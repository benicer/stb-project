import { MainEntity, ColumnEntity } from "../../../../entitys";
import { observable } from "mobx";
import { IModel } from "stb-react";

class MenuModel implements IModel {
    getIndex: () => number;
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    private readonly nttMain: MainEntity;

    @observable
    dataList: ColumnEntity[] = [];

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }

    /**
     * 初始
     */
    init(dataList: ColumnEntity[], memo?: List.IMemo) {
        if (memo) this.setIndex(memo.menuIndex);
        this.dataList = dataList;

        return Promise.resolve();
    }

}
export { MenuModel }