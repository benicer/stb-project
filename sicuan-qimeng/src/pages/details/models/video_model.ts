import { IModel } from "stb-react";

class VideoModel implements IModel {
    getIndex: () => number;
    identCode: string | number; identCodeTo: string | number;
    setIndex: (index: number) => void;
    setFocus: (index: number) => void;

    init({ }, memo: Details.IMemo) {
        if (this.identCode === memo.identCode) this.setFocus(memo.index);
    }
}
export {
    VideoModel
}