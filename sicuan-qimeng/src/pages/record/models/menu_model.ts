import { MainEntity, ColumnEntity } from "../../../../entitys";
import { observable } from "mobx";
import { IModel } from "stb-react";

class MenuModel implements IModel {
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;
    getIndex: () => number;

    private readonly nttMain: MainEntity;

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }

    /**
     * 初始
     */
    init({ }, memo?: Record.IMemo) {
        if (memo) this.setFocus('watch' === memo.column ? 0 : 1);
        return Promise.resolve();
    }

}
export { MenuModel }