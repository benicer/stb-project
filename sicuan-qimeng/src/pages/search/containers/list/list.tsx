import { Component, h, ISubEvent } from "stb-react";
import { ListModel } from "../../models/list_model";
import { Tools } from "../../../../configs";
import { observer } from "mobx-stb";
import { MType } from "../..";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { ListLogic } from "../../logics/search_logic";
import { img_focus } from "../../../list/containers/variable";
import { pageY } from "stb-decorator";
import { img_result_tips, img_line_x } from "../variable";
import { BtnToggle } from "../btn_toggle/btn_toggle";
import { Thumbnail } from "../../../../containers/thumbnail_170*240/thumbnail";

@observer
@pageY(function () { return this.store }, { width: 4, height: 2 })
class List extends Component<Search.IListProps, Search.IListState>{

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
        })
    }

    onBackspace() {
        this.triggerGlobal(PageType.Previous);
    }

    onEnter() {
        const ntt = this.store.dataList[this.index];

        if (ntt) {
            const memo: Search.IMemo = { identCode: this.identCode, index: this.index, pageIndex: this.store.paging.getPageIndex(), keyworlds: this.store.keyworlds, mode: this.store.mode };

            // url
            this.triggerGlobal(PageType.Blank, { url: this.lgc.getUrl(ntt), memo });

        }
    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Keyboard);
            }
            else if (Key.Down === keyCode) {
                if ('empty' === this.store.mode) {
                    this.target(MType.BtnToggle);
                }
            }
        }
    }

    render() {
        return (
            <div class="panel panel-transparent">
                <div class="panel-heading text-left">
                    <div class="paging">
                        {('hot' === this.store.mode) && <span class="left">大家都在看</span>}
                        {('search' === this.store.mode) && <span class="left"><img src={img_result_tips} /></span>}
                        {('empty' === this.store.mode) && <div class="result-empty">
                            <span class="title">没有搜索结果？为您送上热门推荐</span>
                            <img class="line-x" src={img_line_x} />
                        </div>}
                    </div>
                </div>
                <div class="panel-heading text-right">
                    <div class="paging"><span>
                        {/* {this.store.paging.getPageIndex()}/{this.store.paging.getCountPage()}页 */}
                    </span></div>
                </div>

                <div class={`panel-body ${'empty' === this.store.mode ? 'hot' : ''}`}>
                    {
                        this.store.dataList.map((v, i) => {
                            return (
                                // <div class="thumbnail thumbnail-default thumbnail-transparent item" tag={i} key={i}>
                                //     <img class="def" src={Tools.getClipAddress(Tools.getImageAddress(v.poster), 170, 240)} />
                                //     <img class="foc" src={img_focus} alt="" />
                                //     <div class="caption">
                                //         <span class="title" alias="marquee">{v.title}</span>
                                //     </div>
                                // </div>
                                Thumbnail({ attribute: { tag: i < 10 ? i : null, key: i }, data: v })
                            )
                        })
                    }
                </div>

                {('empty' === this.store.mode) && <div class="panel-body hot">
                    {
                        <BtnToggle identCode={MType.BtnToggle} event={this.event} store={{}} toggle={() => this.store.empty()} />
                    }
                </div>}

            </div>
        )
    }
}
export {
    List
}