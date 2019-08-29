import { Component, h } from "stb-react";
import { img_front, img_behind, img_tab_foc } from "../variable";
import { focus, pageX } from "stb-decorator";
import { TabModel } from "../../models/tab_model";
import { observer } from "mobx-stb";
import { Key } from "stb-key";
import { MType } from "../..";
import { PageType } from "stb-event";
const styles = require("./tab.less");

@observer
@focus
@pageX(function () { return this.store })
class Tab extends Component<Details.ITabProps, Details.ITabState> {
    store: TabModel = this.props.store;

    onBackspace = () => this.triggerGlobal(PageType.Previous);
    onChange(status, keyCode) {
        if (!status) {
            if (Key.Up === keyCode) {
                this.target(MType.Video);
            }
            else if (Key.Down === keyCode) {

                // 选集 or 推荐
                if ('film' === this.store.ext.video_template) {
                    this.target(MType.Recommend);
                } else {
                    this.target(MType.Episode);
                }
            }
        } else {
            let { page } = this.store.dataList[this.index];
            // todo
            this.props.initEpisode(page);
        }
    }
    render() {
        return (
            <div class="center">
                <img class={`to-front ${this.store.isFront() ? '' : "hide"}`} src={img_front} />
                <img class={`to-behind ${this.store.isBehind() ? '' : "hide"}`} src={img_behind} />

                <div class="item-group">
                    {
                        this.store.dataList.map((v, i) => (
                            <div class="item" tag={i}>
                                <span class="txt">{v.value}</span>
                                <img class={`foc ${styles.foc}`} src={img_tab_foc} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}
export {
    Tab
}