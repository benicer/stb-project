import { Component, h } from "stb-react";
import { ProgressModel } from "../../models/progress_mode";
import { observer } from "mobx-stb";

@observer
export class Tips extends Component<Play.ISignProps, Play.ISignState>{
    store: ProgressModel = this.props.store;
    render() {
        return (
            <div class={`play-tips ${this.store.signDisplay ? '' : 'hide'}`}>
            </div>
        )
    }
}