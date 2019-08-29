
import { Component, h, props } from "stb-react";
import { img_btn_foc, img_btn_del_def, img_btn_del_foc } from "../variable";
import { PageType } from "stb-event";
import { Key } from "stb-key";
import { MType } from "../..";
import { focus } from "stb-decorator";
const styles = require("./command.less");

@focus
export class Command extends Component<Record.ICommandProps, Record.ICommandState> {

    onEnter({ value }) {

        if ('delete' === value) {
            this.props.toggleMode();
        }
        else if ("back" === value) {
            this.triggerGlobal(PageType.Previous);
        }

    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Menu);
            }
            else if (Key.Down === keyCode) {
                if (!this.props.isEmpty()) this.target(MType.List);
            }
        }
    }

    render() {
        return (
            <div class={styles.command}>
                {/* {
                    <div class={`item ${styles.item}`} {...props('delete')} tag={0}>
                        <img class={`def ${styles.def}`} src={"preview" === this.props.mode ? img_btn_edit : img_btn_cancel} />
                        <img class={`foc ${styles.foc}`} src={img_btn_foc} />
                    </div>
                }
                <div class={`item ${styles.item}`} {...props('back')} tag={1}>
                    <img class={`def ${styles.def}`} src={img_btn_back} />
                    <img class={`foc ${styles.foc}`} src={img_btn_back_foc} />
                </div> */}

                <div class="item btn-del" tag={0} {...props('delete')}>
                    <img class="def" src={img_btn_del_def} />
                    <img class="foc" src={img_btn_del_foc} />
                </div>
            </div>
        )
    }
}