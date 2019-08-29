import { Component, h, ISubEvent, Ref } from "stb-react";
import { img_to_ceill, img_to_floor } from "../variable";
import { VideoEntity } from "../../../../../entitys";
import { VideoLogic } from "../../logics/video_logic";
import { Tools } from "../../../../configs";
import { HElement, SetTimeout } from "stb-tools";
import { Key } from "stb-key";
import { focus } from "stb-decorator";
import { RollStepY } from "../../../../../framework/plugin";
const styles = require("./layer.less");

@focus
class Layer extends Component<Details.ILayerProps, Details.ILayerState> {
    lgc = new VideoLogic();
    rollY: RollStepY;
    eleRoll;
    eleCeil: HElement;
    eleFloor: HElement;

    state = {
        display: false
    }
    subscribeToEvents(e: ISubEvent) {
        e.onfocus((e) => {

            this.setState({
                display: true
            });
        });
        e.onblur((e) => {
            this.setState({
                display: false
            })
        })
    }
    onBackspace = () => (this.target(this.event.getPreviousIdentCode()))
    onChange(status, keyCode) {
        if (Key.Up === keyCode) {
            this.rollY.toCeil();
        } else if (Key.Down === keyCode) {
            this.rollY.toFloor();
        }
        this.refresh();
    }
    complete = (e) => {
        this.eleRoll = e;

        new SetTimeout(1000).enable(() => {
            this.rollY = new RollStepY({ ele: this.eleRoll, height: 248, lenght: 36 });
            this.refresh();
        })

    }
    refresh() {

        this.eleCeil.hide();
        this.eleFloor.hide();

        if (this.rollY.isRoll()) {
            if (this.rollY.isFloor()) {
                this.eleFloor.show();
            } else {
                this.eleCeil.show();
            }
        }
    }
    render({ ntt }: { ntt: VideoEntity }) {
        return (
            <div class={`${styles.layer}`} style={`visibility:${this.state.display ? 'visible' : 'hidden'}`} tag={0}>
                <h1 class={styles.title}>{ntt.title}</h1>

                <img class={styles.poster} src={ntt.thumbnail ? Tools.getClipAddress(Tools.getImageAddress(ntt.thumbnail), 206, 290) : ""} />

                <span class={styles.release}>年份：{this.lgc.release(ntt)}年</span>
                <span class={styles.count}>集数：{ntt.episode_count}集</span>
                <p class={styles.des}>
                    <p ref={this.complete}>
                        简介：{ntt.description}{ntt.description}
                    </p>
                </p>
                <img class={`${styles.to_direction}`} src={img_to_ceill} ref={(e) => { this.eleCeil = new HElement(e) }} />
                <img class={`${styles.to_direction}`} src={img_to_floor} ref={(e) => { this.eleFloor = new HElement(e) }} />
            </div>
        )
    }
}
export {
    Layer
}