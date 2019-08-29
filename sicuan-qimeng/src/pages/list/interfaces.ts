declare namespace List {
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
        switchColumn(columnId): void;
    }
    interface IMenuState {

    }
    interface IListProps extends IFocProps {
        getMenuIndex:()=>number;
    }
    interface IListState {

    }

    // 其他
    interface IRequest {
        package_key: string;
    }
    interface IMemo {
        identCode:number|string;
        menuIndex:number;
        listIndex:number;
        pageIndex:number;
    }
    interface ISource {
        url: string;
    }
    interface ITest {

    }
}