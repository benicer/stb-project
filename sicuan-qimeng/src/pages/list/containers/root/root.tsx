import { Component, h } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import RootModel from "../../models/root_model";
import { Menu } from "../menu/menu";
import { List } from "../list/list";
import { MGlobalType } from "../../../../logics/launch_logic";
import { FuncOvertime } from "../../../../../framework/tools";

@observer
class Root extends Component<List.IRootProps, List.IRootState>{
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
                <img class="content" src={this.store.bg} />

                <Menu identCode={MType.Menu} event={this.event} store={this.store.modMenu} switchColumn={this.store.switchColumn} />
                <List identCode={MType.List} event={this.event} store={this.store.modList} getMenuIndex={this.store.modMenu.getIndex} />
            </div>
        )
    }
}
export default Root;