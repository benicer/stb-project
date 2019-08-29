import { Component, h, ISubEvent } from "stb-react";
import { ListModel } from "../../models/list_model";
import { observer } from "mobx-stb";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { ListLogic } from "../../logics/list_logic";
import { Focus } from "stb-shadow";
import { pageY } from "stb-decorator";
import { Thumbnail } from "../../../../containers/thumbnail_170*240/thumbnail";

@observer
@pageY(function () { return this.store }, { width: 5, height: 2 })
class List extends Component<List.IListProps, List.IListState>{

    store: ListModel = this.props.store;
    lgc = new ListLogic();

    subscribeToEvents(e: ISubEvent) {
        e.onfocus(() => {
            if (!this.store.dataList.length) {
                this.target(this.event.getPreviousIdentCode());
            }
        });
        e.onblur(() => {
            this.setIndex(0);
        });
    }

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }

    onEnter() {
        const ntt = this.store.dataList[this.index];

        if (ntt) {

            const memo: List.IMemo = { identCode: this.identCode, listIndex: this.index, pageIndex: this.store.paging.getPageIndex(), menuIndex: this.props.getMenuIndex() };
            // url
            this.triggerGlobal(PageType.Blank, { url: this.lgc.getUrl(ntt), memo });

        }
    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Menu);
            }
            else if (Key.Down === keyCode) {
                const tags: any = this.tags.getAll();
                const f = Focus.area(tags, this.index, keyCode);

                if (f) {
                    this.setFocus(f.index);
                }
            }
        }
    }

    render() {
        return (
            <div class="panel panel-transparent">
                <div class="panel-heading text-right">
                    {/* <div class="paging"><span>共{this.store.paging.getDataSize()}部</span><span class="line"></span><span>{this.store.paging.getPageIndex()}/{this.store.paging.getCountPage()}页</span></div> */}
                </div>
                <div class="panel-body">
                    {
                        this.store.dataList.map((v, i) => {
                            return (
                                // <div class="thumbnail thumbnail-default thumbnail-transparent item" tag={i} key={i}>
                                //     <img class="def" src={Tools.getClipAddress(Tools.getImageAddress(v.poster), 170, 240)} />
                                //     <img class="foc" src={img_focus} />
                                //     <div class="caption">
                                //         <span class="title" alias="marquee">{v.title}</span>
                                //     </div>
                                // </div>
                                Thumbnail({ attribute: { tag: i < 10 ? i : null, key: i }, data: v})
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