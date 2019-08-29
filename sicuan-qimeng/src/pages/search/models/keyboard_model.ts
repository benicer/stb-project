import { MainEntity, ColumnEntity } from "../../../../entitys";
import { observable } from "mobx";

class KeyboardModel {
    private readonly nttMain: MainEntity;
    readonly defaultTips = "拼音首字母搜索";

    dataList: string[] = [];

    @observable
    keyworlds: string = this.defaultTips;

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;

        this.dataList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    }

    /**
     * 初始
     */
    init({ }, memo: Search.IMemo) {

        this.keyworlds = memo.keyworlds;

        return Promise.resolve();
    }

    setKeyworlds(method: 'in' | 'back' | 'clear', value?: string) {

        if ('in' === method && value) {
            if (this.defaultTips === this.keyworlds) {
                this.keyworlds = value;
            } else {
                this.keyworlds = `${this.keyworlds}${value}`;
            }
        }
        else if ('back' === method) {
            if (this.defaultTips === this.keyworlds) {

            } else {
                this.keyworlds = this.keyworlds.substr(0, this.keyworlds.length - 1);

                if (!this.keyworlds) {
                    this.keyworlds = this.defaultTips;
                }
            }
        }
        else if ('clear' === method) {
            this.keyworlds = this.defaultTips;
        }

    }

}
export { KeyboardModel }