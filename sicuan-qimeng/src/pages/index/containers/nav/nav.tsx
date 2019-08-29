import { Component, h, ISubEvent } from "stb-react";
import { Tools } from "../../../../configs";
import { observer } from "mobx-stb";
import { MType } from "../..";
import { Key } from "stb-key";
import { focus } from "stb-decorator";
import NavModel from "../../models/nav_model";
import { PageType } from "stb-event";
import { FormatUrl, HElement, ParseUrl } from "stb-tools";
import { Focus } from "stb-shadow";

@focus
@observer
export class Nav extends Component<Index.INavProps, Index.INavState>{

    store: NavModel = this.props.store;

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

        // item.page_key
        const { page_key } = item;

        if ("home" !== page_key) {

            this.triggerGlobal(PageType.Blank, {
                url: new FormatUrl(`${Tools.getPath()}list.html`, { package_key: page_key, back_url: new FormatUrl(window.location.href, {}).getEncodeURIComponent() }).getEncodeURIComponent()
            });

        } else {

            // 取消推荐点击
            // this.triggerGlobal(PageType.Blank, {
            //     url: new FormatUrl(`${Tools.getPath()}index.html`, {}).getEncodeURIComponent()
            // });

        }
    }
    onBackspace = () => this.triggerGlobal(PageType.Previous);
    onChange(status, keyCode) {
        if (!status) {
            if (Key.Down === keyCode) {
                this.target(MType.Body, { ele: this.tags.get(this.index), keyCode });
            }
            else if (Key.Right === keyCode) {
                this.target(MType.Control);
            }
        }
    }
    render() {
        return (
            <div class="nav">
                {
                    this.store.dataList.map((v, i) => {
                        return (
                            <div class="item" tag={i}>
                                <img class="def" src={Tools.getImageAddress(v.icon)} />
                                <img class="act" src={Tools.getImageAddress(v.active_icon)} />
                                <img class="foc" src={Tools.getImageAddress(v.focus_icon)} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}