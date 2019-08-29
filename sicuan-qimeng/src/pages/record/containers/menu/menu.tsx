import { Component, h, props } from "stb-react";
import { MenuModel } from "../../models/menu_model";
import { focus } from "stb-decorator";
import { observer } from "mobx-stb";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { img_btn_watch, img_btn_foc, img_btn_collect, img_btn_del_foc, img_btn_del_def, img_btn_watch_enab, img_btn_collect_enab } from "../variable";

@observer
@focus
class Menu extends Component<Record.IMenuProps, Record.IMenuState>{

    store: MenuModel = this.props.store;

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }

    onEnter({ value }) {

        if ('watch' === value) {
            this.props.switchColumn('watch');
        }
        else if ('collect' === value) {
            if ('edit' === this.props.mode) {
                this.props.toggleMode();
            }

            this.props.switchColumn('collect');
        }
        else if ('delete' === value) {
            this.props.toggleMode();
        }

    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Down === keyCode) {
                if (!this.props.isEmpty()) this.target(MType.List, { index: 0 });
            }
            else if (Key.Right === keyCode) {
                this.target(MType.Command);
            }
        } else {
            this.props.switchColumn(0 === this.index ? 'watch' : 'collect');
        }
    }

    render() {
        return (
            <ul class="list-groups">
                <li class={`list-group-items ${'watch' === this.props.method ? 'enable' : ''}`} tag={0} {...props('watch')}>
                    <img class="def" src={img_btn_watch} />
                    <img class="foc" src={img_btn_foc} />
                    <img class="ena" src={img_btn_watch_enab} />
                </li>
                <li class={`list-group-items ${'collect' === this.props.method ? 'enable' : ''}`} tag={1} {...props('collect')}>
                    <img class="def" src={img_btn_collect} />
                    <img class="foc" src={img_btn_foc} />
                    <img class="ena" src={img_btn_collect_enab} />
                </li>
                {/* {
                    'watch' === this.props.method && (
                        <li class="item btn-del" tag={2} {...props('delete')}>
                            <img class="def" src={img_btn_del_def} />
                            <img class="foc" src={img_btn_del_foc} />
                        </li>
                    )
                } */}
            </ul>
        )
    }
}
export {
    Menu
}