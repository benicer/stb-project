import { LaunchData } from "../../../../api/launch_data";
import { MainEntity, LaunchEntity } from "../../../../entitys";
import { observable } from "mobx";
import { IModel } from "stb-react";
export default class NavModel implements IModel {
    getIndex: () => number;
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;

    private readonly nttMain: MainEntity;
    enable: number;
    private packageKey;

    @observable
    dataList: LaunchEntity[] = [];

    constructor(nttMain: MainEntity, packageKey?: string) {
        this.nttMain = nttMain;
        this.packageKey = packageKey;
    }

    init({ }, memo: Index.IMemo) {

        return new Promise((resolve, reject) => {

            new LaunchData().launch({ business_code: this.nttMain.global_variable.business_code }).then((r) => {
                if (r._success) {

                    // if (null !== this.packageKey && undefined !== this.packageKey) {
                    //     let navIndex = 0;
                    //     if (this.packageKey) {
                    //         r.data.forEach((v, i) => {
                    //             if (v.page_key === this.packageKey) {
                    //                 navIndex = i;
                    //             }
                    //         })
                    //     }
                    //     this.enable = navIndex;
                    // } else {
                    // }

                    this.enable = 0;
                    const { navIndex } = memo;
                    this.setIndex(navIndex);

                    this.dataList = r.data;
                    resolve();
                }
            })
        })

    }
}