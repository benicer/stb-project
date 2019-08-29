import { MainEntity, VideoEntity } from "../../../../entitys";
import { observable } from "mobx";
import { Tools } from "../../../configs";
import InfoModel from "./info_model";
import RecommendModel from "./reocm_model";
import { VideoModel } from "./video_model";
import { MType } from "..";
import { MainData, VideoData, ReportData } from "../../../../api";
import { img_bg } from "../containers/variable";
import { EpisodeModel } from "./episode_mode";
import { TabModel } from "./tab_model";
import { Cookie } from "stb-cookie";
import { Json } from "stb-tools";

export default class RootModel {
    private readonly nttMain: MainEntity;
    private readonly request: Details.IRequest
    private readonly memo: Details.IMemo;

    // report
    private readonly createTime = new Date().getTime();
    private loadedTime: number;

    readonly modInfo: InfoModel;
    readonly modReco: RecommendModel;
    readonly modVideo: VideoModel;
    modEpisode: EpisodeModel;
    modTab: TabModel;

    @observable
    bg: string = "";

    @observable
    ntt: VideoEntity;

    constructor(nttMain: MainEntity, request: Details.IRequest, memo: Details.IMemo) {
        this.nttMain = nttMain;
        this.request = request;
        this.memo = memo || this.initMemo();

        this.modInfo = new InfoModel(nttMain);
        this.modReco = new RecommendModel(nttMain);
        this.modVideo = new VideoModel();
    }

    init() {
        return new Promise((resolve, reject) => {

            new VideoData().video({ video_id: this.request.video_id, token: this.nttMain.token, business_code: this.nttMain.global_variable.business_code }).then((r) => {
                if (r._success) {

                    this.ntt = r.data;

                    // info
                    this.modInfo.init({ videoId: this.request.video_id, ntt: this.ntt }).then(() => {

                        // bg
                        new MainData().global({ business_code: this.nttMain.global_variable.business_code, token: this.nttMain.token }).then((r) => {
                            if (r._success) {

                                // film
                                if ("1" === this.ntt.video_type) {
                                    r.data.g_dy_background_img ? this.bg = Tools.getClipAddress(Tools.getImageAddress(r.data.g_dy_background_img), 1280, 720) : this.bg = img_bg;
                                }
                                // teleplay
                                else {
                                    r.data.g_dsj_background_img ? this.bg = Tools.getClipAddress(Tools.getImageAddress(r.data.g_dsj_background_img), 1280, 720) : this.bg = img_bg;
                                }

                            }
                        });

                        const { id, ext } = this.ntt;

                        // video
                        this.modVideo.init({}, this.memo);

                        const { video_template } = ext;

                        this.modEpisode = new EpisodeModel((video_template === 'teleplay_number') ? 20 : 5, this.nttMain);
                        this.modTab = new TabModel(6, this.modEpisode);
                        this.modEpisode.initParams(id, ext);
                        this.modTab.initParams(ext);

                        if (video_template === 'film') {

                            // rec
                            this.modReco.init(id);

                        } else if (video_template === 'teleplay_number') {

                            // tab
                            this.modTab.init({}, this.memo).then(() => {
                                // episode
                                this.modEpisode.init({}, this.memo);
                            });

                        }
                        else if (video_template === 'teleplay_title_image') {

                            // tab
                            this.modTab.init({}, this.memo).then(() => {
                                // episode
                                this.modEpisode.init({}, this.memo);
                            });
                        }
                        // loadTime
                        this.loadedTime = new Date().getTime() - this.createTime;

                        resolve({ target: this.memo.identCode });
                    });
                }
            });
        })
    }

    initEpisode = (pageIndex) => {
        this.modEpisode.toIndex(pageIndex).then((l) => {
            this.modEpisode.dataList = l;
        })
    }
    initMemo = (): Details.IMemo => ({ identCode: MType.Video, index: 0 })
    blankReport = (identCode, pageUrl) => {
        return new Promise((resolve, rejects) => {

            let before, after;

            const { id } = this.modInfo.ntt;
            let seq = 1;

            before = {
                page_type: 'video_detail',
                video_id: id
            };

            // button or video
            if (MType.Button === identCode && "play" === this.modInfo.modType.get() || MType.Video === identCode) {
                after = {
                    page_type: "play",
                    video_id: id,
                    seq: seq
                }
            }
            // episode
            else if (MType.Episode === identCode) {
                const item = this.modEpisode.getItem();

                after = {
                    page_type: "play",
                    video_id: id,
                    seq: item.seq
                }
            }
            // recommend
            else if (MType.Recommend === identCode) {

                const item = this.modReco.dataList[this.modReco.getIndex()];

                after = {
                    page_type: 'video_detail',
                    video_id: item.video_id
                };

            }

            if (after && after.page_type && after.page_type !== before.page_type) {
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

            const { id } = this.modInfo.ntt;

            before = {
                page_type: 'video_detail',
                video_id: id
            };
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