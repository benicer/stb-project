import { MainEntity, AssetEntity } from "../../../../entitys";
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
    private readonly request: List.IRequest
    private readonly memo: List.IMemo;
    private nttAsst: AssetEntity;

    // report
    private readonly createTime = new Date().getTime();
    private loadedTime: number;

    readonly modMenu: MenuModel;
    readonly modList: ListModel;

    @observable
    bg: string = "";

    constructor(nttMain: MainEntity, request: List.IRequest, memo: List.IMemo) {
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
            // asset list
            new AssetData().asset({ business_code: this.nttMain.global_variable.business_code, package_key: this.request.package_key }).then((r) => {
                if (r._success) {

                    this.nttAsst = r.data;

                    this.bg = Tools.getImageAddress(r.data.package_ext.background_image);

                    // menu
                    this.modMenu.init(r.data.children, this.memo).then(() => {

                        // list
                        this.modList.init(this.modMenu.dataList[this.memo.menuIndex].id, this.memo).then(() => {

                            // loadTime
                            this.loadedTime = new Date().getTime() - this.createTime;

                            resolve({ target: this.memo.identCode });
                        });
                    });
                }
            });
        })
    }

    switchColumn = (columnId) => {
        this.modList.init(columnId);
    }
    initMemo = (): List.IMemo => ({ identCode: MType.Menu, listIndex: 0, pageIndex: 1, menuIndex: 0 })

    getMemo(identCode: number) {
        const memo: List.IMemo = {
            identCode, listIndex: this.modList.getIndex(), pageIndex: this.modList.paging.getPageIndex(), menuIndex: this.modMenu.getIndex()
        }
        return memo;
    }

    blankReport = (currentIdent, pageUrl) => {
        return new Promise((resolve, rejects) => {
            const { identCode, pageIndex } = this.getMemo(currentIdent);

            let before, after;

            before = {
                page_type: "list",
                package_id: this.nttAsst.id,
                package_key: this.nttAsst.package_key
            }

            // body
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
                page_type: "list",
                package_id: this.nttAsst.id,
                package_key: this.nttAsst.package_key
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