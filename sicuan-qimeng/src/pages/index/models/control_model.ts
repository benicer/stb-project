import { IModel } from "stb-react";
import { MainEntity } from "../../../../entitys";

class ControlModel implements IModel {
    getIndex: () => number;
    identCode: string | number; identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;

    private readonly nttMain: MainEntity;

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }
    init({ }, memo: Index.IMemo) {
        const { commandIndex } = memo;
        this.setFocus(commandIndex);
    }
}
export {
    ControlModel
}