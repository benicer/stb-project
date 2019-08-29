import { MainEntity } from "../../../../entitys";
import NavModel from "./nav_model";
import BodyModel from "./body_model";
import { observable } from "mobx";
import { Tools } from "../../../configs";
import { MType } from "..";
import { ControlModel } from "./control_model";
import { MainData, ReportData } from "../../../../api";
import { img_logo } from "../containers/variable";
import { Cookie } from "stb-cookie";
import { Json } from "stb-tools";

export default class RootModel {
    private readonly nttMain: MainEntity;
    private readonly request: Index.IRequest
    private readonly memo: Index.IMemo;

    // report
    private readonly createTime = new Date().getTime();
    private loadedTime: number;

    readonly modNav: NavModel;
    readonly modBody: BodyModel;
    readonly modCont: ControlModel;

    @observable
    bg: string = "";
    @observable
    logo: string = "";

    constructor(nttMain: MainEntity, request: Index.IRequest, memo: Index.IMemo) {
        this.nttMain = nttMain;
        this.request = request;
        this.memo = memo || this.initMemo();

        this.modNav = new NavModel(nttMain);
        this.modBody = new BodyModel(nttMain);
        this.modCont = new ControlModel(nttMain);
    }
    init() {
        return new Promise((resolve) => {
            // logo
            new MainData().global({ business_code: this.nttMain.global_variable.business_code, token: this.nttMain.token }).then((r) => {
                if (r._success) {
                    r.data.g_logo_img ? this.logo = Tools.getClipAddress(Tools.getImageAddress(r.data.g_logo_img), 1280, 720) : this.logo = img_logo;
                }
            });
            // 控制
            this.modCont.init({}, this.memo);

            // 导航
            this.modNav.init({}, this.memo).then(() => {

                // 背景
                this.bg = Tools.getImageAddress(this.modNav.dataList[0].background_image);

                // 内容
                this.modBody.init(this.modNav.dataList[0].recom_page_template, this.memo).then(() => {

                    // loadTime
                    this.loadedTime = new Date().getTime() - this.createTime;

                    resolve({ target: this.memo.identCode });
                });

            })
        })
    }
    initMemo = (): Index.IMemo => ({ identCode: MType.Nav, commandIndex: 0, navIndex: 0, contentIndex: 0 })
    getMemo = (identCode) => {
        const memo: Index.IMemo = {
            identCode: identCode,
            commandIndex: this.modCont.getIndex(),
            navIndex: this.modNav.getIndex(),
            contentIndex: this.modBody.getIndex()
        }
        return memo;
    }
    blankReport = (currentIdent, pageUrl) => {
        return new Promise((resolve, rejects) => {
            const { identCode, navIndex, contentIndex, commandIndex } = this.getMemo(currentIdent);

            let before, after;

            // model
            // nav 
            if (MType.Nav === identCode) {
                const { id, page_key } = this.modNav.dataList[navIndex];

                before = {
                    page_type: 'home'
                }

                after = {
                    page_type: 'list',
                    package_id: id,
                    item_package_id: page_key
                }
            }
            // command
            else if (MType.Control === identCode) {
                before = {
                    page_type: "home"
                }
                if (0 === commandIndex) {
                    after = {
                        page_type: "search"
                    }
                } else {
                    after = {
                        page_type: "playlist"
                    }
                }
            }
            // body
            else if (MType.Body === identCode) {
                const data = this.modBody.storeBehavior.get();

                const { launch_id, id, recom_page_template } = this.modNav.dataList[this.modNav.enable];
                const { template_bind_id, template_key } = recom_page_template[0];
                const item = this.modBody.dataList[contentIndex];
                const seq = item.seq;

                before = {
                    page_type: 'homeRecom',
                    launch_id: launch_id,
                    cate_id: id,
                    template_bind_id: template_bind_id,
                    template_key: template_key,
                    seq: seq
                }
                after = data.after;

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
                page_type: 'home'
            }
            after = {
                page_type: 'launch'
            };

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