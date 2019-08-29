declare namespace Play {
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
    interface ISignProps {
        store;
    }
    interface ISignState {

    }
    interface IProgressProps {
        store;
        titel:string;
    }
    interface IProgressState {

    }
    interface ITabProps extends IFocProps {
        initEpisode:(pageIndex:number)=>void;
    }
    interface ITabState {
        display:boolean;
    }
    interface IEpisodeProps extends IFocProps {
        authFull(episode): Promise<{ authStatus: boolean, orderData: Config.AuthenticationResult }> ;
        currentEpisode:number;
    }
    interface IEpisodeState {
        display:boolean;
    }

    // 其他
    interface IRequest {
        /**
         * 频道号|播放串|媒资"{video_id:'123',episode:'2'}"
         */
        value: any;
        /**
         *  流类型 直播流(live) 点播流(dot)
         */
        stream_type: "live" | "dot";
        /**
         * 播放源类型（频道号、播放串
         */
        value_type: "channel" | "playstring" | "asset";
        back_url: string;
    }
    interface IMemo {

    }
    interface ISource {
        url: string;
    }
    interface ITest {

    }
}