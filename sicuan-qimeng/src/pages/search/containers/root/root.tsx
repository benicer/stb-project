import { Component, h } from "stb-react";
import { observer } from "mobx-stb";
import RootModel from "../../models/root_model";
import { img_bg, img_line } from "../variable";
import { Keyboard } from "../keyboard/keyboard";
import { MType } from "../..";
import { List } from "../list/list";
import { MGlobalType } from "../../../../logics/launch_logic";
import { FuncOvertime } from "../../../../../framework/tools";

@observer
class Root extends Component<Search.IRootProps, Search.IRootState>{
    store: RootModel = this.props.store;
    
    subscribeToEvents() {
        // browser report
        this.event.on("*", MGlobalType.BlankReport, ({ callback, url }) => {

            new FuncOvertime(500).enable(this.store.blankReport(this.event.getTargetIdentCode(), url), callback);

        })
        // browser report
        this.event.on("*", MGlobalType.PreviousReport, ({ callback, url }) => {

            new FuncOvertime(500).enable(this.store.previousReport(url), callback);

        })
    }
    componentDidMount() {
        // init page all
        this.store.init().then(({ target }) => (this.target(target)));

        // fix not module
        this.subscribeToEvents();
    }

    render() {
        return (
            <div class="content">

                <img class="page-bg" src={img_bg} />

                <Keyboard identCode={MType.Keyboard} event={this.event} store={this.store.modKeyb} search={this.store.search} isEmpty={this.store.isEmpty} />

                <img class="line" src={img_line} />

                <List identCode={MType.List} event={this.event} store={this.store.modList} />
            </div>
        )
    }
}
export default Root;