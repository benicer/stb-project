import { Component, h, ISubEvent } from "stb-react";
import { RootModel } from "../../models/root_model";
import { Sign } from "../sign/sign";
import { Progress } from "../progress/progress";
import { MType, MediaType, releasePlayer, dialog } from "../..";
import { PlayerType } from "stb-player";
import { Dialog } from "../../../../../framework/plugin";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { Join } from "../../../../configs";
import { SetTimeout } from "stb-tools";
import { Episode } from "../episode/episode";
import { observer } from "mobx-stb";
import { MGlobalType } from "../../../../logics/launch_logic";
import { FuncOvertime } from "../../../../../framework/tools";
import { Tips } from "../tips/tips";

@observer
export class Root extends Component<Play.IRootProps, Play.IRootState>{
    store: RootModel;

    subscribeToEvents(e: ISubEvent) {
        this.store = this.props.store;

        // basic function
        e.onkeydown((e) => {
            this.store.registryKeydown(e);

            if (Key.Backspace === e.keyCode) {
                dialog.target("您确定要退出吗？", 0)
                    .then(({ status }) => {
                        if (status) {
                            this.triggerGlobal(PageType.Previous);
                        }
                        else {
                            this.target(MType.Page);
                        }
                    });
            }
            else if (Key.Down === e.keyCode) {
                this.target(MType.Episode);
            }
        });
        if ("dot" === this.store.request.stream_type) {

            const { registryStartPlay, registryProgressChanging, registryTotalProgressInit, registryPausePlaying, registryResumePlaying } = this.store.modPro;
            // 开始播放
            this.event.on(MType.MediaPlayer, PlayerType.StartPlaying, registryStartPlay);
            // 进度改变
            this.event.on(MType.MediaPlayer, PlayerType.ProgressChanging, registryProgressChanging);
            // 总进度
            this.event.on(MType.MediaPlayer, PlayerType.TotalProgressInit, (e) => {
                registryTotalProgressInit(e, this.store.modVid.nttAuth ? this.store.modVid.nttAuth.trySee : false);
            });
            // 暂停
            this.event.on(MType.MediaPlayer, PlayerType.PausePlaying, registryPausePlaying);
            // 恢复播放
            this.event.on(MType.MediaPlayer, PlayerType.ResumePlaying, registryResumePlaying);
            // 播放完毕
            this.event.on(MType.MediaPlayer, PlayerType.FinishPlay, () => {

                this.store.modPro.currentTime = 0;
                const r = this.store.modVid.nttAuth;

                // 试看结束
                if (!r.authStatus && r.trySee && r.seeSecond > 0) {

                    // 订购
                    // addplaylist
                    this.event.trigger("*", MediaType.Addplaylist, () => {

                        // 提示
                        dialog.target('是否前往订购？', 0).then(({ status }) => {
                            if (status) {
                                Join.Order(this.store.modVid.nttAuth, () => {
                                    return new Promise((resolve) => {

                                        releasePlayer();
                                        resolve();

                                    })
                                })
                            } else {
                                this.event.target(this.event.getPreviousIdentCode());
                            }
                        });

                    });
                }
                const { } = this.store.modVid;
                const modEpi = this.store.modEpi;

                this.store.modEpi.recoverPlayStatus().then(() => {

                    // now page next episode
                    if (this.store.modVid.currentEpisode < Number(modEpi.dataList[modEpi.dataList.length - 1].seq)) {

                        const index = Number(modEpi.dataList[modEpi.getIndex() + 1].seq);

                        this.store.modEpi.setIndex(modEpi.getIndex() + 1);

                        // 鉴权失败跳转订购，取消返回上一页
                        this.store.modVid.authFull(index).then(({ authStatus, orderData }) => {
                            if (!authStatus) {

                                // 提示
                                dialog.target('是否前往订购？', 0).then(({ status }) => {
                                    if (status) {
                                        Join.Order(orderData, () => {
                                            return new Promise((resolve) => {

                                                releasePlayer();
                                                resolve();

                                            })
                                        })
                                    } else {
                                        this.triggerGlobal(PageType.Previous);
                                    }
                                });
                            }
                        })

                        this.store.modEpi.storeStatus.setIndex(this.store.modEpi.getIndex());
                        this.store.modEpi.storeStatus.setPage(this.store.modEpi.paging.getPageIndex());
                    }
                    // next page the next episode
                    else if (modEpi.isBehind()) {
                        modEpi.toBehind().then((l) => {
                            modEpi.setIndex(0);
                            modEpi.dataList = l;

                            // 鉴权失败跳转订购，取消返回上一页
                            this.store.modVid.authFull(Number(l[0].seq)).then(({ authStatus, orderData }) => {
                                if (!authStatus) {

                                    // 提示
                                    dialog.target('是否前往订购？', 0).then(({ status }) => {
                                        if (status) {
                                            Join.Order(orderData, () => {
                                                return new Promise((resolve) => {

                                                    releasePlayer();
                                                    resolve();

                                                })
                                            })
                                        } else {
                                            this.triggerGlobal(PageType.Previous);
                                        }
                                    });
                                }
                            })

                            this.store.modEpi.storeStatus.setIndex(this.store.modEpi.getIndex());
                            this.store.modEpi.storeStatus.setPage(this.store.modEpi.paging.getPageIndex());
                        })
                    }
                    else {
                        this.triggerGlobal(PageType.Previous);
                    }
                })

            });
        }
        // addplaylist
        this.event.on("*", MediaType.Addplaylist, (callback) => {
            const timer = new SetTimeout(500);
            timer.enable(() => {
                timer.clear();
                callback && callback();
            });
            this.store.addPlaylist().then(() => {
                timer.clear();
                callback && callback();
            })
        });

        // // browser report
        // this.event.on("*", MGlobalType.BlankReport, (callback) => {
        //     new FuncOvertime(500).enable(this.store.blankReport(this.event.getTargetIdentCode()), callback);

        // })

        // addplaylist
        this.event.on("*", MediaType.Addplaylist, (callback) => {
            new FuncOvertime(500).enable(this.store.addPlaylist(), callback);
        });
        // browser report
        this.event.on("*", MGlobalType.PreviousReport, ({ callback, url }) => {

            new FuncOvertime(500).enable(this.store.previousReport(url), callback);

        })
    }
    componentDidMount() {
        // init page all
        this.store.init().then(({ target, authStatus, orderData }) => {

            if (!authStatus) {
                // 提示
                dialog.target('是否前往订购？', 0).then(({ status }) => {
                    if (status) {
                        Join.Order(orderData, () => {
                            return new Promise((resolve) => {

                                releasePlayer();
                                resolve();

                            })
                        })
                    } else {
                        this.triggerGlobal(PageType.Previous);
                    }
                });
            } else {
                this.target(target);
            }

            // let time = 0;

            // // start play
            // new SetInterval(1000).enable(() => {

            //     this.event.trigger(MType.MediaPlayer, PlayerType.TotalProgressInit, { totalTime: 100 });
            //     this.event.trigger(MType.MediaPlayer, PlayerType.ProgressChanging, { currentTime: time });

            //     time++;
            // });

            // new SetTimeout(1000).enable(() => {

            //     console.log("hide");
            //     this.store.modPro.signDisplay = false;
            //     this.store.modPro.progressDisplay = false;

            //     new SetTimeout(1000).enable(() => {
            //         this.event.trigger(MType.MediaPlayer, PlayerType.ProgressChanging, { currentTime: 1 });

            //     })
            // })

            // new SetTimeout(2000).enable(() => {
            //     this.event.trigger(MType.MediaPlayer, PlayerType.FinishPlay, {});
            // })
        })
    }
    render() {
        return (
            <div class="content">
                <Tips store={this.store.modPro} />
                <Sign store={this.store.modPro} />
                <Progress store={this.store.modPro} titel={(this.store.modVid && this.store.modVid.nttVideo) ? this.store.modVid.nttVideo.title : ""} />
                {
                    (this.store && this.store.modEpi) &&
                    <Episode identCode={MType.Episode} event={this.event} store={this.store.modEpi} authFull={(e) => this.store.modVid.authFull(e)} currentEpisode={this.store.modVid.currentEpisode} />
                }
            </div>
        )
    }
}