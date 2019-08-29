import { MainEntity } from "../../../../entitys";
import { MType, player, createPlayer } from "..";
import { Json } from "stb-tools";
import { ProgressModel } from "./progress_mode";
import { Key } from "stb-key";
import { RecordData, ReportData } from "../../../../api";
import { VideoModel } from "./video_model";
import { EpisodeModel } from "./episode_mode";
import { observable } from "mobx";
import { Cookie } from "stb-cookie";

export class RootModel {
    private readonly nttMain: MainEntity;
    readonly modPro = new ProgressModel();
    readonly request: Play.IRequest;

    // report
    private readonly createTime = new Date().getTime();
    private loadedTime: number;

    @observable
    readonly modVid: VideoModel;

    @observable
    modEpi: EpisodeModel;

    constructor(nttMain: MainEntity, request: Play.IRequest) {
        this.request = request;
        this.nttMain = nttMain;

        this.modVid = new VideoModel(this.nttMain);
    }
    init(): Promise<{ target: MType, authStatus: boolean, orderData: Config.AuthenticationResult }> {
        return new Promise((resolve) => {

            createPlayer();
            player.displayFull();

            const { stream_type, value, value_type } = this.request;

            // 直播流(live) 点播流(dot)
            if ("live" === stream_type) {
                // 取消结束事件与进度改变事件
                player.setTotalTime(-1);
            } else if ("dot" === stream_type) {

                const { video_id, episode } = Json.deSerializ(value);

                this.modVid.init(video_id, episode).then((r) => {
                    const ext = this.modVid.nttVideo.ext;

                    const modEpi = new EpisodeModel((ext.video_template === 'teleplay_number') || (ext.video_template === 'film') ? 20 : 5, this.nttMain);

                    modEpi.initParams(video_id, ext);

                    this.modEpi = modEpi;

                    const pageSize = (ext.video_template === 'teleplay_number') ? 20 : 5;

                    // 自动计算页面
                    const pageIndex = Math.ceil(Number(episode) / pageSize);

                    // episode
                    this.modEpi.init({ pageIndex: pageIndex, seq: episode || 0 }).then(() => {

                        // loadTime
                        this.loadedTime = new Date().getTime() - this.createTime;
                        resolve({ target: MType.Page, ...r });
                    });

                })
                return;
            }
            // 播放串播放方式
            if ("channel" === value_type) {
                // play.mediaPlay.leaveChannel(Number(value));
                // play.mediaPlay.joinChannel(Number(value));
            } else if ("playstring" === value_type) {

                // player.play(value);

            } else if ("asset" === value_type) {
                // const { video_id, episode } = Json.deSerializ(value);
                // this.initEpisode(video_id, {
                //     pageIndex: 1,
                //     selectEpisode: episode,
                //     index: 0
                // })
            }

            resolve({ target: MType.Page, authStatus: true, orderData: null });
        });
    }
    registryKeydown = (e) => {
        if ("dot" === this.request.stream_type) {
            // 暂停or播放
            if (Key.Enter === e.keyCode) {
                if (!this.modPro.playStatus) {
                    player.resume(true);
                } else {
                    player.pause(true)// 静音or恢复;
                }
            } else if (Key.Mute === e.keyCode || Key.Mute2 === e.keyCode) {
                if (player.isMute()) {
                    player.resumeVolume();
                } else {
                    player.setMute()// 快进;
                }
            } else if (Key.Right === e.keyCode) {

                this.modPro.speed();
            } else if (Key.Left === e.keyCode) {

                this.modPro.reverse();
            }
        }
    }
    addPlaylist() {
        return new Promise((resolve) => {
            const { stream_type, value } = this.request;
            const { startTime, startFormatTime, status } = this.modVid;
            if ("dot" === stream_type && "play" === status) {

                let pageTime: any = Math.round((new Date().getTime() - startTime) / 1000);
                const { token } = this.nttMain;
                const { video_id, episode } = Json.deSerializ(value);

                new RecordData().add({
                    token: token,
                    begin_position: this.modVid.nttAuth.continueSecond || 0,
                    end_position: this.modPro.currentTime,
                    play_time: pageTime,
                    play_start_time: startFormatTime,
                    episode: episode,
                    video_id: video_id
                }).then(() => {
                    resolve();
                });

            } else {
                resolve();
            }
        })

    }
    initEpisode = (pageIndex) => {
        this.modEpi.toIndex(pageIndex).then((l) => {
            this.modEpi.dataList = l;
        })
    }

    previousReport = (pageUrl = window.location.href) => {
        return new Promise((resolve) => {

            let before, after;

            const episode = this.modVid.currentEpisode;
            const id = this.modVid.nttVideo.id;

            before = {
                page_type: "play",
                video_id: id,
                seq: episode
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