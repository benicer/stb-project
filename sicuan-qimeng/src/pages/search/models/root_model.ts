import { MainEntity } from "../../../../entitys";
import { observable } from "mobx";
import { KeyboardModel } from "./keyboard_model";
import { ListModel } from "./list_model";
import { MainData, ReportData } from "../../../../api";
import { resolve } from "path";
import { MType } from "..";
import { Cookie } from "stb-cookie";
import { Json } from "stb-tools";

export default class RootModel {
    private readonly request: Search.IRequest;
    private readonly nttMain: MainEntity;
    private readonly memo: Search.IMemo;

    // report
    private readonly createTime = new Date().getTime();
    private loadedTime: number;

    readonly modKeyb: KeyboardModel;
    readonly modList: ListModel;

    @observable
    bg: string = "";

    constructor(nttMain: MainEntity, request: Search.IRequest, memo: Search.IMemo) {
        this.nttMain = nttMain;
        this.request = request;
        this.memo = memo || this.initMemo();

        this.modKeyb = new KeyboardModel(nttMain);
        this.modList = new ListModel(nttMain, this.request.package_key);
    }

    /**
     * 初始
     */
    init(): Promise<{ target }> {
        return new Promise((resolve) => {
            // // bg
            // new MainData().global({ token: this.nttMain.token, business_code: this.nttMain.global_variable.business_code }).then((r) => {
            //     if (r._success) {
            //         console.log(r);

            //         if(!r.data){

            //         }
            //     }
            // });

            // keyborad
            this.modKeyb.init({}, this.memo).then(() => {
                // list
                this.modList.init({}, this.memo).then(() => {

                    // loadTime
                    this.loadedTime = new Date().getTime() - this.createTime;

                    resolve({ target: this.memo.identCode });
                });
            });

        });
    }

    search = (keyworlds) => {
        if (!keyworlds) {
            this.modList.welcome();
        } else {
            // list
            this.modList.search(this.modKeyb.keyworlds)
        }
    }

    isEmpty = () => {
        return !Boolean(this.modList.dataList.length);
    }

    initMemo = (): Search.IMemo => ({ identCode: MType.Keyboard, index: 2, pageIndex: 1, keyworlds: "", mode: "hot" })
    getMemo = (identCode) => {
        const memo: Search.IMemo = {
            identCode,
            index: this.modList.getIndex(),
            pageIndex: this.modList.paging.getPageIndex(),
            keyworlds: this.modKeyb.keyworlds,
            mode: this.modList.mode
        }
        return memo;
    }
    blankReport = (currentIdent, pageUrl) => {
        return new Promise((resolve, rejects) => {
            const { identCode, pageIndex } = this.getMemo(currentIdent);

            let before, after;

            before = {
                page_type: "search"
            }

            // model
            if (MType.List === identCode) {
                const { video_id } = this.modList.dataList[this.modList.getIndex()];
                after = {
                    page_type: "video_detail",
                    video_id: video_id
                }
            }

            if (after && after.page_type) {
                new Cookie(`${after.page_type}_report`).setCookie(Json.serializ(before));
            }

            let viewTime = Math.round((new Date().getTime() - this.createTime) / 1000);

            const { global_variable, token } = this.nttMain;

            new ReportData().submit({
                before: before,
                after: after,
                view_time: viewTime,
                device: STBType,
                business_code: global_variable.business_code,
                token: token,
                page_url: pageUrl,
                load_time: this.loadedTime,
                load_status: "success"
            }).then(() => {
                resolve();
            })
        })

    }
    previousReport = (pageUrl = window.location.href) => {
        return new Promise((resolve, rejects) => {

            let before, after;

            before = {
                page_type: "search"
            }

            after = Json.deSerializ(new Cookie(`${before.page_type}_report`).getCookie());

            let viewTime = Math.round((new Date().getTime() - this.createTime) / 1000);

            const { global_variable, token } = this.nttMain;

            new ReportData().submit({
                before: before,
                after: after,
                view_time: viewTime,
                device: STBType,
                business_code: global_variable.business_code,
                token: token,
                page_url: pageUrl,
                load_time: this.loadedTime,
                load_status: "success"
            }).then(() => {
                resolve();
            })
        })

    }
}