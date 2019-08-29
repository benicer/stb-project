import { Component, h } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import RootModel from "../../models/root_model";
import { Menu } from "../menu/menu";
import { List } from "../list/list";
import { img_btn_watch, img_btn_collect, img_bg } from "../variable";
import { MGlobalType } from "../../../../logics/launch_logic";
import { FuncOvertime } from "../../../../../framework/tools";
import { Command } from "../command/command";

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
                <img class="content" src={img_bg} />
                
                <Command identCode={MType.Command} event={this.event} store={{}} mode={this.store.mode} toggleMode={this.store.toggleMode} column={this.store.modList.method} isEmpty={this.store.isEmpty} />

                <Menu identCode={MType.Menu} event={this.event} store={this.store.modMenu} switchColumn={this.store.switchColumn} toggleMode={this.store.toggleMode} method={this.store.modList.method} mode={this.store.mode} isEmpty={this.store.isEmpty} />
                <List identCode={MType.List} event={this.event} store={this.store.modList} mode={this.store.mode} />
            </div>
        )
    }
}
export default Root;