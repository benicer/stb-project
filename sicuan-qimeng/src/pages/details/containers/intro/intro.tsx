import { Component, h, props } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import { PageType } from "stb-event";
import { Key } from "stb-key";
import { img_des_def, img_des_foc } from "../variable";
import { focus } from "stb-decorator";
const styles = require("./intro.less");

@observer
@focus
class Intro extends Component<Details.IIntroProps, Details.IIntroState>{

    onEnter() {
        this.target(MType.Layer);
    }
    onBackspace = () => this.triggerGlobal(PageType.Previous);

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Down === keyCode || Key.Left === keyCode) {
                this.target(MType.Button);
            }
        }
    }

    render() {
        return (
            <div class="des">
                {this.props.description}
                <div class="item" tag={0}>
                    <img class="def" src={img_des_def} />
                    <img class={`foc ${styles.foc}`} src={img_des_foc} />
                </div>
            </div>
        )
    }
}
export {
    Intro
};