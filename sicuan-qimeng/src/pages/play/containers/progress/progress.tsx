import { Component, h, ISubEvent } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import { ProgressModel } from "../../models/progress_mode";
import { FormatTime } from "stb-tools";

@observer
export class Progress extends Component<Play.IProgressProps, Play.IProgressState> {
    store: ProgressModel = this.props.store;

    render() {
        return (
            <div class={`progress ${this.store.progressDisplay ? '' : 'hide'}`}>
                <div class="bar">
                    <div class="fill" style={this.store.attributeWidth(this.store.currentTime)}>
                        <span class="ico"></span>
                    </div>
                </div>

                <div class="btn-left focus-group">

                </div>
                {/* play 播放 */}
                <div class={`btn-center focus-group ${!this.store.signDisplay ? "play" : ""}`}>

                </div>
                <div class="btn-right focus-group">

                </div>
                <div class="title">
                    <span class="prefix">正在播放：</span>
                    <span class="txt">{this.props.titel}</span>
                </div>
                <div class="time">
                    {FormatTime(this.store.currentTime, 'hh:mm:ss')}/{FormatTime(this.store.totalTime, 'hh:mm:ss')}
                </div>
            </div>
        )
    }
}