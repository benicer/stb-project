import { Component, h } from "stb-react";
import { observer } from "mobx-stb"
import { ProgressModel } from "../../models/progress_mode";

@observer
export class Sign extends Component<Play.ISignProps, Play.ISignState>{
    store: ProgressModel = this.props.store;
    render() {
        return (
            <div class={`pause-sign ${this.store.signDisplay ? '' : 'hide'}`}>
            </div>
        )
    }
}