import { Component, h } from "stb-react";
import { MType } from "../..";
import { observer } from "mobx-stb";
import RootModel from "../../models/root_model";
import Info from "../info/info";
import Recommend from "../recommend/recommend";
import { Video } from "../video/video";
import { Tab } from "../tab/tab";
import { Layer } from "../layer/layer";
import { Episode } from "../episode/episode";
import { PlayerType } from "stb-player";
import { MGlobalType } from "../../../../logics/launch_logic";
import { FuncOvertime } from "../../../../../framework/tools";

@observer
class Root extends Component<Details.IRootProps, Details.IRootState>{
    store: RootModel = this.props.store;

    subscribeToEvents() {

        // play finish continue
        this.event.on(MType.MediaPlayer, PlayerType.FinishPlay, () => {
            this.store.modInfo.authSmall();
        });
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
                <img class="page-bg" src={this.store.bg} />

                <Video identCode={MType.Video} event={this.event} store={this.store.modVideo} openFull={(i) => this.store.modInfo.openFull(i)} />

                <Info identCode={MType.Button} event={this.event} store={this.store.modInfo} />

                <Layer identCode={MType.Layer} event={this.event} store={{}} ntt={this.store.ntt || {}} />

                {/* 电影 */}
                {
                    (this.store.ntt && 'film' === this.store.ntt.ext.video_template) && (
                        <div class="center">
                            <div class="title">
                            </div>
                        </div>
                    )
                }
                {
                    (this.store.ntt && 'film' === this.store.ntt.ext.video_template) && (
                        <Recommend identCode={MType.Recommend} event={this.event} store={this.store.modReco} />
                    )
                }
                {/* 电视剧+图片 */}
                {/* 电视剧+选集 */}
                {
                    (this.store.modTab && this.store.ntt && ('teleplay_title_image' === this.store.ntt.ext.video_template || 'teleplay_number' === this.store.ntt.ext.video_template)) &&
                    <Tab identCode={MType.Tab} event={this.event} store={this.store.modTab} initEpisode={this.store.initEpisode} />
                }
                {
                    (this.store.modEpisode && this.store.ntt && ('teleplay_title_image' === this.store.ntt.ext.video_template || 'teleplay_number' === this.store.ntt.ext.video_template)) &&
                    <Episode identCode={MType.Episode} event={this.event} store={this.store.modEpisode} openFull={(i) => this.store.modInfo.openFull(i)} videoTemplate={this.store.ntt.ext.video_template} />
                }
            </div>
        )
    }
}
export default Root;