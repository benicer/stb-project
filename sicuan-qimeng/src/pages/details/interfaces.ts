declare namespace Details {
    interface IFocProps {
        identCode: number | string;
        event: any;
        store;
    }

    // 组件
    interface IRootProps extends IFocProps {
    }
    interface IRootState {

    }
    interface IVideoProps extends IFocProps {
        openFull(episode);
    }
    interface IVideoState {

    }
    interface ILayerProps extends IFocProps {
        ntt;
    }
    interface ILayerState {

    }
    interface IIntroProps extends IFocProps {
        description
    }
    interface IIntroState {
    }
    interface ITabProps extends IFocProps {
        initEpisode: (pageIndex: number) => void;
    }
    interface ITabState {
    }
    interface IEpisodeProps extends IFocProps {
        openFull(episode);
        videoTemplate: string;
    }
    interface IEpisodeState {
    }
    interface IRecommendProps extends IFocProps {
    }
    interface IRecommendState {
    }


    // 其他
    interface IRequest {
        video_id: string;
    }
    interface IMemo {
        identCode: number;
        index: number;
    }
    interface ISource {
        url: string;
    }
    interface ITest {

    }
}