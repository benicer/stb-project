import { Component, h, ISubEvent } from "stb-react";
import { img_epi_foc, img_rec_foc, img_free } from "../variable";
import { EpisodeModel } from "../../models/episode_mode";
import { observer } from "mobx-stb";
import { focus } from "stb-decorator";
import { Tools } from "../../../../configs";
import { Key } from "stb-key";
import { MType } from "../..";
import { PageType } from "stb-event";
const styles = require("./episode.less");

@observer
@focus
class Episode extends Component<Details.IEpisodeProps, Details.IEpisodeState> {
    store: EpisodeModel = this.props.store;

    subscribeToEvents(e: ISubEvent) {
        e.onblur(() => {
            this.setIndex(0)
        });
    }
    onEnter() {
        this.props.openFull(Number(this.store.dataList[this.index].seq)).then((jumpUrl) => {
            this.triggerGlobal(PageType.Blank, { url: jumpUrl });
        });
    }
    onBackspace = () => this.triggerGlobal(PageType.Previous);
    onChange(status, keyCode) {
        if (!status) {
            if (Key.Up === keyCode) {
                this.target(MType.Tab);
            }
        }
    }
    render() {
        if (!this.store.ext) return "";

        if ('teleplay_number' === this.store.ext.video_template) {
            return (
                //  数字模板
                <div class={styles.episode}>
                    {
                        this.store.dataList.map((v, i) => (
                            <div class={`item ${styles.item}`} tag={i}>
                                <img class={`foc ${styles.foc}`} src={img_epi_foc} />
                                {
                                    'inactive' === v.bcharging && <img class="corner cornerTopLeft" src={img_free} />
                                }
                                <span class={styles.txt}>{v['seq']}</span>
                            </div>
                        ))
                    }
                </div>
            )
        }
        else {
            return (
                // 图文模板
                <div class="floor">
                    {
                        this.store.dataList.map((v: any, i) => (
                            <div class="thumbnail thumbnail-default thumbnail-transparent item" tag={i} key={i}>
                                <img class="def" src={Tools.getClipAddress(Tools.getImageAddress(v.thumbnail), 205, 109)} />
                                <img class="foc" src={img_rec_foc} />
                                {
                                    'inactive' === v.bcharging && <img class="corner cornerTopLeft" src={img_free} />
                                }
                                <div class="caption">
                                    <span class="title" alias="marquee">{v.title}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }
    }
}
export {
    Episode
}