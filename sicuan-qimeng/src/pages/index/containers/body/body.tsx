import { Component, h, ISubEvent } from "stb-react";
import { Tools } from "../../../../configs";
import { observer } from "mobx-stb";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { focus } from "stb-decorator";
import BodyModel from "../../models/body_model";
import { Focus } from "stb-shadow";
import { LaunchLogic } from "../../../../logics/launch_logic";

@focus
@observer
export class Body extends Component<Index.IBodyProps, Index.IBodyState>{

    store: BodyModel = this.props.store;

    subscribeToEvents(e: ISubEvent) {
        e.onfocus((e) => {

            if (e.data) {

                const { ele, keyCode } = e.data;

                const f = Focus.connectScope(this.tags.getAll(), ele, keyCode);

                if (f) {
                    this.setFocus(f.index);
                }
            }
        });
    }

    onEnter() {
        const item = this.store.dataList[this.index];

        new LaunchLogic().behavior(item.ext, { backUrl: Tools.getNeatUrl() }).then((r) => {

            // save report data
            this.store.storeBehavior.set(r);

            this.triggerGlobal(PageType.Blank, { url: r.url });

        });
    }
    onBackspace = () => this.triggerGlobal(PageType.Previous);

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Up === keyCode) {
                this.target(MType.Nav, { ele: this.tags.get(this.index), keyCode });
            } else if (Key.Down === keyCode) {

                const tags: any = this.tags.getAll();

                const f = Focus.scope(tags, this.index, keyCode);

                if (f) {
                    this.setFocus(f.index);
                }
            }
        }
    }

    render() {

        return (
            <div class="recommend">
                <div class="item-group col-1">
                    <div class="item big" tag={0} >
                        <img class="def" src={this.getCover(0)} />
                        <img class="foc" src={this.getFocCover(0)} />
                    </div>

                    <div class="item small item-1" tag={1}>
                        <img class="def" src={this.getCover(1)} />
                        <img class="foc" src={this.getFocCover(1)} />
                    </div>

                    <div class="item small" tag={2}>
                        <img class="def" src={this.getCover(2)} />
                        <img class="foc" src={this.getFocCover(2)} />
                    </div>
                </div>
                <div class="item-group">
                    <div class="item long" tag={3}>
                        <img class="def" src={this.getCover(3)} />
                        <img class="foc" src={this.getFocCover(3)} />
                    </div>
                </div>
                <div class="item-group col-3">
                    <div class="item noraml" tag={4}>
                        <img class="def" src={this.getCover(4)} />
                        <img class="foc" src={this.getFocCover(4)} />
                    </div>
                    <div class="item noraml noraml-2" tag={5}>
                        <img class="def" src={this.getCover(5)} />
                        <img class="foc" src={this.getFocCover(5)} />
                    </div>
                </div>
            </div>
        )
    }

    getCover(serial: number) {
        var url = this.store.dataList.length > serial && Tools.getImageAddress(this.store.dataList[serial].cover);

        if (!url) return "";

        if (0 === serial) {
            return Tools.getClipAddress(url, 542, 304);
        } else if (1 === serial || 2 === serial) {
            return Tools.getClipAddress(url, 257, 178);
        } if (3 === serial) {
            return Tools.getClipAddress(url, 318, 507);
        }
        else if (4 === serial || 5 === serial) {
            return Tools.getClipAddress(url, 249, 240);
        }
        return url;
    }
    getFocCover(serial: number) {
        return this.store.dataList.length > serial && Tools.getImageAddress(this.store.dataList[serial].focus_cover);
    }
}