import { Component, h } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import { img_rec_foc } from "../variable";
import RecommendModel from "../../models/reocm_model";
import { Tools } from "../../../../configs";
import { PageType } from "stb-event";
import { Key } from "stb-key";
import { FormatUrl } from "stb-tools";
import { marquee } from "stb-decorator";

@marquee
@observer
class Recommend extends Component<Details.IRecommendProps, Details.IRecommendState>{
    store: RecommendModel = this.props.store;

    onEnter() {
        const id = this.store.dataList[this.index].id;

        this.triggerGlobal(PageType.Blank, { url: new FormatUrl(Tools.getNeatUrl(), { video_id: id }).getEncodeURIComponent() });
    }

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Up === keyCode) {
                this.target(MType.Video);
            }
        }
    }

    onBackspace = () => this.triggerGlobal(PageType.Previous);

    render() {
        return (
            <div class="floor">
                {
                    this.store.dataList.map((v, i) => (

                        <div class="thumbnail thumbnail-default thumbnail-transparent item" tag={i} key={i}>
                            <img class="def" src={Tools.getClipAddress(Tools.getImageAddress(v.thumbnail), 205, 109)} />
                            <img class="foc" src={img_rec_foc} alt="" />
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
                    ))
                }

            </div>
        )
    }
}
export default Recommend;