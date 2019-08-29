import { Component, h, props, ISubEvent } from "stb-react";
import { observer } from "mobx-stb";
import { pageX } from "stb-decorator";
import { PageType } from "stb-event";
import { img_focus } from "../variable";
import { Key } from "stb-key";
import { MType, releasePlayer, dialog } from "../..";
import { EpisodeModel } from "../../models/episode_mode";
import { Tools, Join } from "../../../../configs";
import { img_epi_foc, img_free, img_rec_foc } from "../../../details/containers/variable";
import { Dialog } from "../../../../../framework/plugin";
import { log } from "../../../../configs/config.tool";

@observer
@pageX(function () { return this.store })
class Episode extends Component<Play.IEpisodeProps, Play.IEpisodeState> {
    store: EpisodeModel = this.props.store;

    subscribeToEvents(e: ISubEvent) {
        e.onfocus(() => {
            this.store.recoverPlayStatus().then(() => {
                this.store.display = true;
            });
        })
        e.onblur(() => {
            this.store.display = false;
        })
    }
    onBackspace = () => this.target(MType.Page);
    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Tab);
            }
        }
    }
    onEnter() {
        const episode = this.store.dataList[this.index].seq;

        this.props.authFull(Number(episode)).then(({ authStatus, orderData }) => {
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
                        this.event.target(this.event.getPreviousIdentCode());
                    }
                });
            }
        })

        this.store.storeStatus.setPage(this.store.paging.getPageIndex());
        this.store.storeStatus.setIndex(this.index);

        this.target(MType.Page);
    }
    render({ currentEpisode }) {

        if (!this.store || !this.store.ext) return "";

        if ('teleplay_number' === this.store.ext.video_template || "film" === this.store.ext.video_template) {
            return (
                <div class={`episode episode-txt ${this.store.display ? '' : 'hide'}`}>
                    <div class="item-group">
                        {
                            this.store.dataList.map((v, i) => (
                                <div class={`item`} tag={i}>
                                    <img class={`foc `} src={img_epi_foc} />
                                    {
                                        'inactive' === v.bcharging && <img class="corner cornerTopLeft" src={img_free} />
                                    }
                                    <span class={`txt`}>{v['seq']}</span>
                                </div>
                            ))
                        }
                    </div>
                    <span class={`left-ico ${this.store.isFront() ? '' : 'hide'}`}></span>
                    <span class={`right-ico ${this.store.isBehind() ? '' : 'hide'}`}></span>
                </div>
            )
        }
        else {
            return (
                <div class={`episode ${this.store.display ? '' : 'hide'}`}>
                    <div class="item-group">
                        {
                            this.store.dataList.map((v, i) => (
                                <div class="focus-group item" tag={i} {...props(v['seq'])}>
                                    <img class="def" src={Tools.getClipAddress(Tools.getImageAddress(v.thumbnail), 174, 92)} />
                                    <img class="foc" style="left:-10px" src={img_rec_foc} height="132" width="210" />
                                    {
                                        'inactive' === v.bcharging && <img style="left:8px;top:8px" class="corner cornerTopLeft" src={img_free} />
                                    }
                                    <div class="title">
                                        <span class="txt">第 {v['seq']} 集</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <span class={`left-ico ${this.store.isFront() ? '' : 'hide'}`}></span>
                    <span class={`right-ico ${this.store.isBehind() ? '' : 'hide'}`}></span>
                </div>
            )
        }
    }
}
export {
    Episode
}