declare namespace Record {
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
        switchColumn(method: 'watch' | 'collect'): void;
        toggleMode();
        isEmpty();
        method: IColumn;
        mode: IMode;
    }
    interface IMenuState {

    }
    interface IListProps extends IFocProps {
        mode: IMode;
    }
    interface IListState {

    }
    interface ICommandProps extends IFocProps {
        mode: IMode;
        toggleMode;
        column;
        isEmpty
    }
    interface ICommandState {

    }

    // 其他
    interface IRequest {
        package_key: string;
        method: "collect" | "watch";
    }
    interface IMemo {
        identCode: number;
        index: number;
        column: IColumn;
        pageIndex: number;
    }
    interface ISource {
        url: string;
    }
    type IMode = "edit" | "preview";
    type IColumn = 'watch' | 'collect';
}