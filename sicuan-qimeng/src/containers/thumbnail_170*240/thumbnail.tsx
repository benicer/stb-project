import { h } from "stb-react";
import { Tools } from "../../configs";
import { img_focus } from "../../pages/list/containers/variable";
// import { img_foc, img_def_cover } from "../../pages/list/containers/variable";

const _styles = require("./thumbnail.less");

export function Thumbnail({ attribute, data, width = 170, height = 240, mode = "preview" }) {
    return (
        <div class={`thumbnail thumbnail-default thumbnail-transparent item ${"delete" === mode ? "delete" : ""} ${_styles.thumbnail}`} {...attribute}>
            <img class={`def ${_styles.def}`} src={Tools.getClipAddress(Tools.getImageAddress(data.poster), width, height)} />
            <img class={`foc ${_styles.foc}`} src={img_focus} />
            <span class={`del ${_styles.del}`} ></span>
            {
                data.corner_mark.top_left && <img class={`${_styles.corner} ${_styles.cornerTopLeft}`} src={Tools.getImageAddress(data.corner_mark.top_left)} />
            }
            {
                data.corner_mark.top_right && <img class={`${_styles.corner} ${_styles.cornerTopRight}`} src={Tools.getImageAddress(data.corner_mark.top_right)} />
            }
            <div class={`${_styles.caption}`}>
                <span class={`${_styles.title}`} alias="marquee">{data.title}</span>
            </div>
        </div>
    )
}