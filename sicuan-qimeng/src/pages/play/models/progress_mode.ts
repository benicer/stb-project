import { FuncLock, SetTimeout, FormatTime, SetInterval, Json } from "stb-tools";
import { IStartPlaying, IProgressChanging, ITotalProgressInit } from "stb-player";
import { player } from ".."
import { observable } from "mobx";

export class ProgressModel {
    // 快件规则 间隔低于 500 ms 快进 10 间隔 1 s 内连续快进加 总进度的 60 分之 1
    private readonly funcLock = new FuncLock();
    // timer
    private readonly progressHiddenTimer = new SetTimeout(3000);
    private readonly signHiddenTimer = new SetTimeout(0);
    // progresss
    private readonly fullWidth = 1280;

    @observable
    currentTime: number = 0;

    totalTime = 0;

    @observable
    signDisplay = true;

    @observable
    progressDisplay = true;

    @observable
    playStatus = false;

    /**
     * 
     * @param format 输出格式 hh:mm:ss ；如果为空返回 number 值
     */
    getCurrentTime(format?: string): number | string {
        return format ? FormatTime(this.currentTime, 'hh:mm:ss') : this.currentTime;
    }
    /**
     * 
     * @param format 输出格式 hh:mm:ss ；如果为空返回 number 值
     */
    getTotalTime(format?: string): number | string {
        return format ? FormatTime(this.totalTime, 'hh:mm:ss') : this.currentTime;
    }
    attributeWidth = (currentTime: number) => {

        if (this.totalTime) {

            let per = currentTime / this.totalTime;
            let ratio = per * this.fullWidth;

            return `width:${Math.round(ratio)}px`;
        }
        return "";

    }
    registryStartPlay = (e: IStartPlaying) => {
        // log.push("开始播放") 延迟隐藏
        this.signDisplay = true;
        this.playStatus = true;
        this.progressDisplay = true;

        // 延迟隐藏
        this.progressHiddenTimer.enable(() => {
            this.progressDisplay = false;
        });

        this.signHiddenTimer.enable(() => {
            this.signDisplay = false;
        })
    }
    registryProgressChanging = (e: IProgressChanging) => {
        this.currentTime = e.currentTime;
    }
    registryTotalProgressInit = (e: ITotalProgressInit, hasTry: boolean) => {

        if (hasTry) {

            let timer = new SetInterval(500);
            timer.enable(() => {
                const time = player.getRealTotalTime();

                if (time > 0) {
                    timer.clear();

                    this.totalTime = time;
                }
            });

        } else {
            this.totalTime = e.totalTime;
        }
    }
    registryPausePlaying = () => {
        // 一直显示
        this.signHiddenTimer.clear();
        this.progressHiddenTimer.clear();

        this.playStatus = false;
        this.signDisplay = true;
        this.progressDisplay = true;
    }
    registryResumePlaying = () => {
        this.signHiddenTimer.clear();
        this.progressHiddenTimer.clear();

        this.progressHiddenTimer.enable(() => {
            this.progressDisplay = false;
        });

        this.signHiddenTimer.enable(() => {
            this.signDisplay = false;
        })

        this.playStatus = true;
    }
    speed() {
        let val = 0;
        if (0 < this.totalTime) {
            this.funcLock.enable(() => {
                val = 5;
            }, () => {
                val = this.totalTime / 60;
            });
            this.progressHiddenTimer.enable(() => {
                this.funcLock.clear();
            });
            player.speed(val);
        }

        // 延迟隐藏
        this.progressHiddenTimer.clear();
        this.signHiddenTimer.clear();
        this.progressHiddenTimer.enable(() => {
            if (this.progressDisplay) this.progressDisplay = false;
            if (this.signDisplay) this.signDisplay = false;
        });
        if (!this.progressDisplay) this.progressDisplay = true;
        if (!this.signDisplay) this.signDisplay = true;
    }
    reverse() {
        let val = 0;
        if (0 < this.totalTime) {
            this.funcLock.enable(() => {
                val = 5;
            }, () => {
                val = this.totalTime / 60;
            });
            this.progressHiddenTimer.enable(() => {
                this.funcLock.clear();
            });
            player.reverse(val);
        }
        // 延迟隐藏
        this.progressHiddenTimer.clear();
        this.signHiddenTimer.clear();
        this.progressHiddenTimer.enable(() => {
            if (this.progressDisplay) this.progressDisplay = false;
            if (this.signDisplay) this.signDisplay = false;
        });
        if (!this.progressDisplay) this.progressDisplay = true;
        if (!this.signDisplay) this.signDisplay = true;
    }
    hide() {
        this.signHiddenTimer.clear();
        this.progressHiddenTimer.clear();
        if (this.progressDisplay) this.progressDisplay = false;
    }
    show() {
        this.signHiddenTimer.clear();
        this.progressHiddenTimer.clear();

        if (!this.progressDisplay) this.progressDisplay = true;
        this.progressHiddenTimer.enable(() => {
            this.progressDisplay = false;
        });

        this.signHiddenTimer.enable(() => {
            this.signDisplay = false;
        });
    }
}