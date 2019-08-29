import { Component, h, props, ISubEvent } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import InfoModel from "../../models/info_model";
import { img_btn_collect, img_btn_not_collect, img_des_def, img_des_foc, img_btn_foc } from "../variable";
import { focus } from "stb-decorator";
import { Key } from "stb-key";
import { PageType } from "stb-event";
import { VideoLogic } from "../../logics/video_logic";
import { tips, log } from "../../../../configs/config.tool";
import { Intro } from "../intro/intro";

@observer
@focus
class Info extends Component<Details.IRootProps, Details.IRootState>{
    store: InfoModel = this.props.store;
    lgc = new VideoLogic();

    subscribeToEvents(e: ISubEvent) {
        // 统一向下逻辑
        this.event.on([MType.Video, MType.Button], PageType.Keydown, (e) => {
            if (Key.Down === e.keyCode) {
                if (this.store.ntt) {
                    const { video_template } = this.store.ntt.ext;

                    if (video_template === 'film') {
                        this.target(MType.Recommend);
                    } else if (video_template === 'teleplay_number' || video_template === 'teleplay_title_image') {
                        this.target(MType.Tab);
                    }
                }
            }
        });
    }

    onEnter({ value }) {
        if ('collect' === value) {

            this.store.toggleCollect().then(() => {
                this.store.collect ? tips('收藏成功') : tips('取消收藏');
            });

        }
    }
    onBackspace = () => this.triggerGlobal(PageType.Previous);

    onChange(status, keyCode) {
        if (!status) {
            if (Key.Left === keyCode) {
                this.target(MType.Video);
            }
            else if (Key.Up === keyCode || Key.Right === keyCode) {
                this.target(MType.Intro);
            }
        }
    }

    render() {
        return (
            <div class="info">
                <span class="title">{this.store.ntt && this.store.ntt.title}</span>
                <div class="label">
                    <span>{this.lgc.label(this.store.ntt)}</span>
                    <span class="line"></span>
                    <span>{this.lgc.release(this.store.ntt)}年</span>
                </div>

                <Intro identCode={MType.Intro} event={this.event} description={this.store.ntt && this.lgc.substr(this.store.ntt.description, 120, '......')} store={{}} />

                <div class="btns">
                    <div class="item" tag={0} {...props('collect')}>
                        <img class="def" src={this.store.collect ? img_btn_collect : img_btn_not_collect} />
                        <img class="foc" src={img_btn_foc} />
                    </div>
                </div>
            </div>
        )
    }
}
export default Info;