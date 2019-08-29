import { LaunchTemplate, BehaviorEntity, MainEntity } from "../../../../entitys";
import { observable } from "mobx";
import { IModel } from "stb-react";
import { LaunchData } from "../../../../api/launch_data";

export default class BodyModel implements IModel {
    getIndex: () => number;
    identCode: string | number;
    identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;

    private readonly nttMain: MainEntity;

    private lgc = new LaunchData();

    // variable
    readonly storeBehavior = new BehaviorModeL();

    @observable
    dataList: BehaviorEntity[] = [];

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }

    init(recomPageTemplate: LaunchTemplate[], memo: Index.IMemo) {

        return new Promise((resolve) => {

            let requestList = [];

            recomPageTemplate.forEach((v) => {
                requestList.push(

                    new Promise<any>((resolves) => {

                        this.lgc.template({
                            id: v.template_id,
                            token: this.nttMain.token,
                            business_code: this.nttMain.global_variable.business_code
                        }).then((info) => {
                            if (info._success) {
                                if (this.identCode === memo.identCode) this.setIndex(memo.contentIndex);
                                this.dataList = info.data;
                                resolves();
                            }
                        });

                    })

                )
            });

            Promise.all(requestList).then((data) => {
                resolve(data);
            });
        });
    }
}

type dataType = {
    url: string;
    behavior: string;
    pageName: string;
    after: any;
};

class BehaviorModeL {
    private data: dataType;
    set(data) {
        this.data = data;
    }
    get() {
        return this.data;
    }
}