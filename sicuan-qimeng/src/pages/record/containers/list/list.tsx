import { Component, h, ISubEvent } from "stb-react";
import { ListModel } from "../../models/list_model";
import { Tools } from "../../../../configs";
import { observer } from "mobx-stb";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { img_item_foc, ico_del_def, ico_del_foc, collect_empty, watch_empty } from "../variable";
import { pageY } from "stb-decorator";
import { RecordLogic } from "../../logics/record_logic";
import { Dialog } from "../../../../../framework/plugin";

@observer
@pageY(function () { return this.store }, { width: 4, height: 3 })
class List extends Component<Record.IListProps, Record.IListState>{

    store: ListModel = this.props.store;

    dialog = new Dialog(MType.Dialog, this.event);

    subscribeToEvents(e: ISubEvent) {
        e.onfocus((e) => {
            if (!this.store.dataList.length) {
                this.target(this.event.getPreviousIdentCode());
            }
            const data = e.data;

            if (data && undefined !== data.index) {
                this.setFocus(data.index);
            }
        })
    }

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }

    onEnter() {
        const ntt = this.store.dataList[this.index];
        // open 
        if ('preview' === this.props.mode) {

            if (ntt) {
                // url
                this.triggerGlobal(PageType.Blank, { url: new RecordLogic().getUrl(ntt.video_id) });

            }
        }
        // del
        else if ('edit' === this.props.mode) {

            this.dialog.target('确认删除？', 0).then(({ status }) => {
                if (status) {
                    const { video_id } = ntt;

                    this.store.removeAt(video_id).then((l: any) => {
                        if (!l.length) {
                            this.target(MType.Menu);
                        } else {
                            this.target(this.event.getPreviousIdentCode());
                        }
                    })
                } else {
                    this.target(this.event.getPreviousIdentCode());
                }
            })


        }

    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Menu);
            } else if (Key.Up === keyCode) {
                if (3 === this.index) {
                    this.target(MType.Command);
                } else {
                    this.target(MType.Menu);
                }
            }
        }
    }

    render() {
        return (
            <div class="panel panel-transparent">
                {
                    !this.store.dataList.length && (
                        <div class="panel-body">
                            <div class="empty-tips" style="text-align:center;">
                                {
                                    'watch' === this.store.method && <img style="margin-top:181px" src={watch_empty} />
                                }
                                {
                                    'collect' === this.store.method && <img style="margin-top:180px" src={collect_empty} />
                                }
                            </div>
                        </div>
                    )
                }

                <div class="panel-body">
                    {
                        this.store.dataList.map((v, i) => {
                            return (
                                <div class={`thumbnail thumbnail-default thumbnail-transparent item ${'edit' === this.props.mode ? 'del' : ''}`} tag={i} key={i}>
                                    <img class="def" src={Tools.getClipAddress(Tools.getImageAddress(v.thumbnail), 247, 131)} />
                                    <img class="foc" src={img_item_foc} />
                                    <img class="del-def" src={ico_del_def} />
                                    <img class="del-foc" src={ico_del_foc} />
                                    {
                                        v.corner_mark.top_left && <img class='corner cornerTopLeft' src={Tools.getImageAddress(v.corner_mark.top_left)} />
                                    }
                                    {
                                        v.corner_mark.top_right && <img class='corner cornerTopRight' src={Tools.getImageAddress(v.corner_mark.top_right)} />
                                    }
                                    <div class="caption">
                                        <span class="title" alias="marquee">{v.title}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
export {
    List
}