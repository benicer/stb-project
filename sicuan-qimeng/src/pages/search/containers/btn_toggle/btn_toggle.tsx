import { Component, h } from "stb-react";
import { img_btn_toogle, img_btn_foc } from "../variable";
import { focus } from "stb-decorator";
import { Key } from "stb-key";
import { MType } from "../..";
import { PageType } from "stb-event";

@focus
export class BtnToggle extends Component<Search.IBtnToggleProps, any> {

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }
    
    onEnter() {
        this.props.toggle();
    }
    onChange(status, keyCode) {
        if (Key.Up === keyCode) {
            this.target(MType.List);
        }
    }
    render() {
        return (
            <div class="item btn-toggle" tag={0}>
                <img class="def" src={img_btn_toogle} />
                <img class="foc" src={img_btn_foc} />
            </div>
        )
    }
}