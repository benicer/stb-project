import { Component, h } from "stb-react";
import { observer } from "mobx-stb";
import { MType } from "../..";
import RootModel from "../../models/root_model";
import { Nav } from "../nav/nav";
import { Control } from "../control/control";
import { Body } from "../body/body";
import { SetTimeout } from "stb-tools";
import { FuncOvertime } from "../../../../../framework/tools";
import { MGlobalType } from "../../../../logics/launch_logic";

@observer
class Root extends Component<Index.IRootProps, Index.IRootState>{
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

                <img class="logo" src={this.store.logo} />

                <img class="bg" src={this.store.bg} />

                <Nav identCode={MType.Nav} event={this.event} store={this.store.modNav} />

                <Control identCode={MType.Control} event={this.event} store={this.store.modCont} />

                <Body identCode={MType.Body} event={this.event} store={this.store.modBody} />
            </div>
        )
    }
}
export default Root;