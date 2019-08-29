import { Component, h, props, ISubEvent } from "stb-react";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { img_search, img_btn_foc, img_center } from "../variable";
import { FormatUrl } from "stb-tools";
import { Tools } from "../../../../configs";
import { focus } from "stb-decorator";

@focus
export class Control extends Component<Index.IControlProps, Index.IControlState>{

    subscribeToEvents(e:ISubEvent){
        e.onfocus(()=>{
            this.setFocus(0);
        })
    }
    onEnter({ value }) {
        if (value) this.triggerGlobal(PageType.Blank, { url: new FormatUrl(value, { back_url: Tools.getNeatUrl() }).getEncodeURIComponent() });
    }

    onBackspace = () => this.triggerGlobal(PageType.Previous);
    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Nav, { ele: this.tags.get(this.index), keyCode });
            }
            else if (Key.Down === keyCode) {
                this.target(MType.Body);
            }
        }
    }

    render() {
        return (
            <div class="control">
                <div class="item" tag={0} {...props(`${Tools.getPath()}search.html`)}>
                    <img class="def" src={img_search} />
                    <img class="foc" src={img_btn_foc} />
                </div>
                <div class="item" tag={1} {...props(`${Tools.getPath()}record.html`)}>
                    <img class="def" src={img_center} />
                    <img class="foc" src={img_btn_foc} />
                </div>
            </div>
        )
    }
}