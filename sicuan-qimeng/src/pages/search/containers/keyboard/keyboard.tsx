import { Component, h, ISubEvent, props } from "stb-react";
import { focus } from "stb-decorator";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { img_btn_del, img_btn_clear, img_key_foc, img_btn_foc } from "../variable";
import { KeyboardModel } from "../../models/keyboard_model";
import { observer } from "mobx-stb";

@focus
@observer
class Keyboard extends Component<Search.IMenuProps, Search.IMenuState>{

    store: KeyboardModel = this.props.store;

    subscribeToEvents(e: ISubEvent) {
        e.onfocus(() => {
            this.setFocus(2);
        });
    }

    onEnter({ value, type }) {

        const preKeyworlds = this.store.keyworlds;

        if ('btn_clear' === type) {
            this.store.setKeyworlds('clear');
        }
        else if ('btn_delete' === type) {
            this.store.setKeyworlds('back');
        } else {
            this.store.setKeyworlds('in', value);
        }

        if (this.store.keyworlds !== preKeyworlds) {
            if (this.store.keyworlds !== this.store.defaultTips) {
                this.props.search(this.store.keyworlds);
            } else {
                this.props.search('');
            }
        }
    }

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Right === keyCode) if (!this.props.isEmpty()) this.target(MType.List);
        } else {
            // if (ntt) this.props.switchColumn(ntt.id);
        }
    }

    render() {
        return (
            <div class="keyboard">
                <div class="search">
                    <span class="ico"></span>
                    <span class="txt">{this.store.keyworlds}</span>
                </div>
                <div class="btn-remove focus-group item" tag={0}  {...props({ type: 'btn_delete' })}>
                    <img class="def" src={img_btn_del} />
                    <img class="foc" src={img_btn_foc} />
                </div>
                <div class="btn-clear focus-group item" tag={1}  {...props({ type: 'btn_clear' })}>
                    <img class="def" src={img_btn_clear} />
                    <img class="foc" src={img_btn_foc} />
                </div>
                <div class="key-group">
                    {
                        this.store.dataList.map((v, i) => (
                            <div class="focus-group" tag={i + 2} {...props({ value: v })}>
                                <img class="foc" src={img_key_foc} />
                                <span class="txt">{v}</span>
                            </div>
                        ))
                    }
                </div>

                <span class="tips">如搜索：萌鸡小队，输入MJXD即可</span>
            </div>
        )
    }
}
export {
    Keyboard
}