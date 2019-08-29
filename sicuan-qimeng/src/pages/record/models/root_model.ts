import { MainEntity } from "../../../../entitys";
import { observable } from "mobx";
import { Tools } from "../../../configs";
import { AssetData, ReportData } from "../../../../api";
import { MenuModel } from "./menu_model";
import { ListModel } from "./list_model";
import { MType } from "..";
import { Cookie } from "stb-cookie";
import { Json } from "stb-tools";

export default class RootModel {

    private readonly nttMain: MainEntity;
    private readonly request: Record.IRequest
    private readonly memo: Record.IMemo;

    // report
    private readonly createTime = new Date().getTime();
    private loadedTime: number;

    readonly modMenu: MenuModel;
    readonly modList: ListModel;

    @observable
    bg: string = "";

    @observable
    mode: Record.IMode = 'preview';

    constructor(nttMain: MainEntity, request: Record.IRequest, memo: Record.IMemo) {
        this.nttMain = nttMain;
        this.request = request;
        this.memo = memo || this.initMemo();

        this.modMenu = new MenuModel(nttMain);
        this.modList = new ListModel(nttMain, this.request.package_key);
    }

    /**
     * 初始
     */
    init(): Promise<{ target }> {

        return new Promise((resolve) => {
            // menu
            this.modMenu.init({}, this.memo).then(() => {

                // list
                this.switchColumn(this.memo.column, this.memo).then(() => {

                    // loadTime
                    this.loadedTime = new Date().getTime() - this.createTime;

                    resolve({ target: !this.modList.dataList.length ? MType.Menu : this.memo.identCode });
                });

            });
        });
    }

    switchColumn = (method: 'watch' | 'collect', memo?) => {
        return this.modList.init(method, memo);
    }
    isEmpty = () => {
        return !Boolean(this.modList.dataList.length);
    }
    toggleMode = () => {
        if ('edit' === this.mode) this.mode = 'preview';
        else if ('preview' === this.mode) this.mode = 'edit';
    }
    initMemo = (): Record.IMemo => ({ identCode: MType.List, index: 0, column: this.request.method || "collect", pageIndex: 1 });
    getMemo = (identCode) => {
        const memo: Record.IMemo = {
            identCode,
            index: this.modList.getIndex(),
            column: this.modList.method,
            pageIndex: this.modList.paging.getPageIndex()
        }
        return memo;
    }

    blankReport = (currentIdent, pageUrl) => {
        return new Promise((resolve, rejects) => {
            const { identCode } = this.getMemo(currentIdent);

            let before, after;

            before = {
                page_type: 0 === this.modMenu.getIndex() ? 'playlist' : 'collect'
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

    previousReport = (pageUrl) => {
        return new Promise((resolve, rejects) => {

            let before, after;

            before = {
                page_type: "watch" === this.memo.column ? 'playlist' : 'collect'
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