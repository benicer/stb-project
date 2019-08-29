import { VideoData } from "../../../../api";
import { MainEntity } from "../../../../entitys/main";
import { VideoEntity } from "../../../../entitys";
import { Join } from "../../../configs";
import { player, releasePlayer, createPlayer } from "..";
import { tips, log } from "../../../configs/config.tool";
import { formatDate, FormatTime, SetTimeout } from "stb-tools";
import { observable } from "mobx";

export class VideoModel {
    private readonly nttMain: MainEntity;
    currentEpisode;

    @observable
    nttVideo: VideoEntity;
    nttAuth: Config.AuthenticationResult;   // 影片信息

    startTime;
    startFormatTime;
    status: "default" | "play" = "default";

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }
    init(videoId, episode): Promise<{ nttVideo: VideoEntity, authStatus: boolean, orderData: Config.AuthenticationResult }> {
        this.currentEpisode = episode;

        return new Promise((resolve, reject) => {
            new VideoData().video({ video_id: videoId, token: this.nttMain.token, business_code: this.nttMain.global_variable.business_code })
                .then((r) => {
                    if (r._success) {
                        this.nttVideo = r.data;

                        this.authFull(this.currentEpisode).then((r) => {
                            resolve({ ...r, nttVideo: this.nttVideo, });
                        });

                    }
                })
        })
    }

    authFull(episode: number): Promise<{ authStatus: boolean, orderData: Config.AuthenticationResult }> {

        return new Promise((resolve, rejects) => {

            // player.play('http://223.87.20.83:8089/28000001/00010000000000009999999999999837');

            this.currentEpisode = episode;
            const { id } = this.nttVideo;

            Join.Authentication(id, episode, this.nttMain.token, this.nttMain.global_variable.business_code, { from: "play", video_id: id, episode: episode }).then((r) => {

                this.nttAuth = r;

                // play or trysee
                if (r.authStatus || (!r.authStatus && r.trySee && r.seeSecond > 0)) {

                    let hasPoint = false;

                    if (!r.authStatus && r.trySee) {

                        player.setTotalTime(Number(r.seeSecond));

                        tips(`试看前 ${r.seeSecond} 秒`);
                    }
                    // 续播
                    else if (r.continueSecond > 0) {
                        tips(`为您播放第 ${episode} 集从 ${FormatTime(Number(r.continueSecond), 'hh:mm:ss')} 开始续播`);
                        hasPoint = true;

                    } else {
                        tips(`为您播放第 ${episode} 集`);
                    }

                    this.startTime = new Date().getTime();
                    this.startFormatTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.status = "play";

                    releasePlayer();
                    new SetTimeout(300).enable(() => {

                        createPlayer();
                        if (hasPoint) {
                            player.playPoint(r.playUrl, Number(r.continueSecond));
                        } else {
                            player.play(r.playUrl);
                        }
                        resolve({ authStatus: true, orderData: null });
                    });
                }
                // order
                else {

                    // releasePlayer();

                    // Join.Order(r, (method) => {
                    //     return new Promise((resolve) => {

                    //         resolve();

                    //     })
                    // });

                    resolve({ authStatus: false, orderData: r });
                }
            });
        })

    }
}