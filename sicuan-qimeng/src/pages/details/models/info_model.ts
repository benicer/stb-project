import { MainEntity, VideoEntity } from "../../../../entitys";
import { observable } from "mobx";
import { Join, Tools } from "../../../configs";
import { CollectData } from "../../../../api/collect_data";
import { player, createPlayer, releasePlayer } from "..";
import { tips } from "../../../configs/config.tool";

class InfoModel {
    private readonly nttMain: MainEntity;
    private videoId: string;

    modType = new EnterModel();

    @observable
    collect: boolean;

    @observable
    ntt: VideoEntity;

    constructor(nttMain: MainEntity) {
        this.nttMain = nttMain;
    }

    init({ videoId, ntt }) {
        this.ntt = ntt;
        this.videoId = videoId;
        return new Promise((resolve) => {

            createPlayer();
            player.displaySmall({ left: 58, top: 47, width: 744, height: 417 });

            // play small
            this.authSmall(videoId);

            // collect
            new CollectData().check({ video_id: videoId, token: this.nttMain.token }).then((r) => {
                if (r._success) {

                    this.collect = r.data;

                    resolve();
                }
            });

        });
    }
    authSmall(videoId?) {
        Join.Authentication(videoId || this.ntt.id, 1, this.nttMain.token, this.nttMain.global_variable.business_code, {}).then((r) => {

            // player.play('http://223.87.20.83:8089/28000001/00010000000000009999999999999837');

            if (!r.playUrl) {
                tips(r['message']);
            } else {
                player.play(r.playUrl);
            }
        });
    }
    openFull(episode = 1) {
        return new Promise((resolve) => {
            // let openConfirm = (seq: string, position: number) => {
            //     let msg = `即将从 ${FormatTime(Number(position), 'hh:mm:ss')} 开始续播`;
            //     return;
            // }
            const { id } = this.ntt;
            const { token, global_variable } = this.nttMain;

            // 鉴权成功
            Join.Authentication(id, episode, token, global_variable.business_code, { from: "details", video_id: id, episode: episode }).then((r) => {

                // play or trysee
                if (r.authStatus || (!r.authStatus && r.trySee && r.seeSecond > 0)) {

                    Join.Play({
                        code: r.code,
                        parentCode: r.parentCode,
                        videoId: id,
                        episode: episode,
                        playUrl: r.playUrl,
                        trySee: r.trySee,
                        seeSecond: r.seeSecond,
                        continueSecond: r.continueSecond,
                        from: 'details'
                    }, (method, jumpUrl) => {
                        resolve(jumpUrl);
                    })

                }
                // order
                else {

                    Join.Order(r, () => {
                        return new Promise((resolve) => {

                            releasePlayer();
                            resolve();

                        })
                    })

                }
            });
        })

    }
    toggleCollect() {
        return new Promise((resolve) => {
            if (this.collect) {
                return this.cancelCollect().then(() => {
                    resolve(this.collect);
                })
            } else {
                return this.addCollect().then(() => {
                    resolve(this.collect);
                })
            }
        })
    }
    private addCollect() {
        return new Promise((resolve) => {
            // add collect
            new CollectData().collect({ video_id: this.videoId, token: this.nttMain.token }).then((r) => {
                if (r._success) {

                    if (r.data) this.collect = true;

                    resolve();
                }
            })
        });

    }
    private cancelCollect() {
        return new Promise((resolve) => {
            // cancel collect
            new CollectData().cancel({ video_id: this.videoId, token: this.nttMain.token }).then((r) => {
                if (r._success) {

                    if (r.data) this.collect = false;

                    resolve();
                }
            })
        });
    }
}
type ButtonType = "collect" | "play";

class EnterModel {
    private type: ButtonType;
    set(type) {
        this.type = type;
    }
    get() {
        return this.type;
    }
}

export default InfoModel;