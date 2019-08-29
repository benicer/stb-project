import { Component, h } from "stb-react";
import { MenuModel } from "../../models/menu_model";
import { focus } from "stb-decorator";
import { observer } from "mobx-stb";
import { Tools } from "../../../../configs";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";

@focus
@observer
class Menu extends Component<List.IMenuProps, List.IMenuState>{

    store: MenuModel = this.props.store;

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Right === keyCode) {
                this.target(MType.List);
            }
        } else {
            const ntt = this.store.dataList[this.index];
            if (ntt) this.props.switchColumn(ntt.id);
        }
    }

    render() {
        return (
            <div class="list-group">
                {
                    this.store.dataList.map((v, i) => {
                        return (
                            <div class="list-groups-item item" tag={i} key={i}>
                                <img class="def" src={Tools.getImageAddress(v.item_ext.icon)} />
                                <img class="act" src={Tools.getImageAddress(v.item_ext.active_icon)} />
                                <img class="foc" src={Tools.getImageAddress(v.item_ext.focus_icon)} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
export {
    Menu
}