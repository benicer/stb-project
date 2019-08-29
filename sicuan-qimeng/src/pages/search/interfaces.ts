declare namespace Search {
    interface IFocProps {
        identCode?: number | string;
        event: any;
        store;
    }

    // 组件
    interface IRootProps extends IFocProps {
    }
    interface IRootState {

    }
    interface IMenuProps extends IFocProps {
        search(keyworlds: string);
        isEmpty(): boolean;
    }
    interface IMenuState {

    }
    interface IListProps extends IFocProps {
    }
    interface IListState {

    }
    interface IBtnToggleProps extends IFocProps {
        toggle();
    }

    // 其他
    interface IRequest {
        package_key: string;
    }
    interface IMemo {
        identCode?: number | string;
        index?: number;
        pageIndex?: number;
        keyworlds?: string;
        mode?: IMode;
    }
    interface ISource {
        url: string;
    }
    type IMode = "search" | "hot" | "empty";

}