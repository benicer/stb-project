import { Component, h } from "stb-react";
import { img_video_foc } from "../variable";
import { focus } from "stb-decorator";
import { Key } from "stb-key";
import { MType } from "../..";
import { PageType } from "stb-event";

@focus
class Video extends Component<Details.IVideoProps, Details.IVideoState> {

    onEnter() {
        this.props.openFull(1).then((jumpUrl) => {
            this.triggerGlobal(PageType.Blank, { url: jumpUrl });
        });
    }
    onBackspace = () => this.triggerGlobal(PageType.Previous);
    onChange(status, keyCode) {
        if (!status) {
            if (Key.Right === keyCode) {
                this.target(MType.Button);
            }
        }
    }

    render() {
        return (
            <div class="video item" tag={0}>
                <img class="foc" src={img_video_foc} />
            </div>
        )
    }
}
export {
    Video
}