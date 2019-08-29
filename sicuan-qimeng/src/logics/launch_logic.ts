import { BehaviorExt } from "../../entitys";
import { FormatUrl } from "stb-tools";
import { Tools } from "../configs/config.tool";

const enum MGlobalType {
    BlankReport = "blank_report",
    PreviousReport = "previous_report",
}

class LaunchLogic {
    /**
     * 推荐位行为
     */
    behavior(ntt: BehaviorExt, options: { backUrl?: string, pageType?: string }): Promise<{ url: string, behavior: string, pageName: string, after }> {
        return new Promise((resolve_all) => {
            let ret = {
                url: "",
                behavior: "",
                pageName: "",
                after: null
            };

            if (ntt) {
                // let lgc = new AssetData();
                // let nttMai = MainData.initMain();

                let behavior = "";
                if (ntt && ntt.behavior) {
                    behavior = ntt.behavior;

                    ret.behavior = behavior;
                }
                // 专题列表：m_open_special_page
                // 视频详情：m_open_video_page
                // 播放记录：m_open_playlist_page
                // 收藏页面：m_open_collect_page
                // 媒资列表：m_open_asset_page
                // 搜索页面：m_open_search_page
                // 专题详情：m_open_special_detail_page
                // 打开WEB页面：m_open_web_url TODO
                // 明星页面：m_open_star_page
                // 打开标签页面：m_open_label_page
                // 打开视频播放器：m_open_video_player
                // 打开播放器：m_open_player
                // 我的订购：m_open_payment_page
                // 设置页面：m_open_setting_page
                // 小窗播放：m_open_min_video_player
                // 返回首页：m_go_back_home
                // 打开推荐页: m_open_launch_recom_page
                let url = "",
                    params: any = {};
                // 打开媒资
                if ("m_open_asset_page" === behavior) {
                    // 所有栏目
                    if ("" === ntt.asset_item_package_id && "" === ntt.asset_package_key) {
                        url = `${Tools.getPath()}children_list.html`;
                        ret.pageName = "list";
                    }
                    // 指定栏目
                    else if ("" !== ntt.asset_item_package_id) {
                        url = `${Tools.getPath()}column.html`;
                        params = {
                            package_id: ntt.asset_package_id,
                            item_package_id: ntt.asset_item_package_id,
                            package_key: ntt.asset_package_key
                        };
                        ret.pageName = "list";

                        ret.after = {
                            page_type: 'list',
                            package_id: ntt.asset_package_id,
                            item_package_id: ntt.asset_item_package_id
                        }
                    }
                    else {
                        // // 栏目信息
                        // nttMai.then((value: { global_variable: { business_code: string } }) => {
                        //     let business_code = value.global_variable.business_code;
                        //     lgc.column({
                        //         package_key: ntt.asset_package_key,
                        //         business_code: business_code,
                        //     }).then((info: any) => {
                        //         if (info._success) {
                        //             const { type } = info.data.package_ext;
                        //             // 列表页面
                        //             // 'video'=>'点播',
                        //             // 'label'=>'标签',
                        //             if ("video" === type || "label" === type) {
                        //                 url = "./children_list.html";
                        //                 params = {
                        //                     asset_key: ntt.asset_package_key,
                        //                     asset_item_id: ntt.asset_item_package_id,
                        //                 };
                        //                 reOpt.behavior = "list";
                        //             }
                        //             // 明星列表
                        //             // 'star'=>'明星'
                        //             else if ("star" === type) {
                        //                 url = "./children_list.html";
                        //                 params = {
                        //                     asset_key: ntt.asset_package_key,
                        //                     asset_item_id: ntt.asset_item_package_id,
                        //                 };
                        //                 reOpt.behavior = "list";
                        //             }
                        //             // 专题列表
                        //             // 'special'=>'专题',
                        //             else if ("special" === type) {
                        //                 url = "./special.html";
                        //                 params = {
                        //                     asset_key: ntt.asset_package_key,
                        //                     asset_item_id: ntt.asset_item_package_id,
                        //                 };
                        //                 reOpt.behavior = "special_list";
                        //             }
                        //             // 返回地址
                        //             if (undefined !== options.backUrl) {
                        //                 params.back_url = options.backUrl;
                        //             } else {
                        //                 params.back_url = new FormatUrl(window.location.href, {}).getEncodeURIComponent();
                        //             }
                        //             // 当前页面类型
                        //             if (options.pageType) {
                        //                 params.pageType = options.pageType;
                        //             }
                        //             reOpt.url = new FormatUrl(url, params).getEncodeURIComponent();
                        //             resolve_all(reOpt);
                        //         }
                        //     });
                        // })
                        return;
                    }
                }
                // 专题列表
                // if ("m_open_special_page" === behavior) {
                //     url = "./special.html";
                // }
                // 详情
                else if ("m_open_video_page" === behavior) {
                    url = `${Tools.getPath()}details.html`;
                    params = {
                        video_id: ntt.video_id,
                    };
                    ret.pageName = "video_detail";
                    ret.after = {
                        page_type: "video_detail",
                        video_id: ntt.video_id
                    }
                }
                // 返回首页
                else if ("m_go_back_home" === behavior) {
                    url = `${Tools.getPath()}index.html`;
                    ret.pageName = "home";
                    ret.after = {
                        page_type: "home"
                    }
                }
                // 打开推荐页
                // else if ('m_open_launch_recom_page' === behavior) {
                //     url = './second_page.html';
                //     params = {
                //         launch_id: ntt.launch_id,
                //         cate_id: ntt.recom_page_id,
                //         page_key: ntt.page_key,
                //     };
                //     reOpt.pageType = "index";
                // }
                // 播放记录
                else if ("m_open_playlist_page" === behavior) {
                    url = `${Tools.getPath()}record.html`;
                    // params = {
                    //     type: "play"
                    // };
                    ret.pageName = "playlist";
                    ret.after = {
                        page_type: "playlist"
                    }
                }
                // 收藏
                else if ("m_open_collect_page" === behavior) {
                    url = `${Tools.getPath()}record.html`;
                    // params = {
                    //     type: "collect"
                    // };
                    ret.pageName = "collect";
                    ret.after = {
                        page_type: "collect"
                    }
                }
                // 搜索
                else if ("m_open_search_page" === behavior) {
                    url = `${Tools.getPath()}search.html`;
                    ret.pageName = "search";
                    ret.after = {
                        page_type: "search"
                    }
                }
                // 自定义专题详情
                else if ("m_open_special_detail_page" === behavior) {
                    url = `${Tools.getPath()}dynamic_special.html`;
                    params = {
                        special_id: ntt.special_id
                    };
                    ret.pageName = "special_detail";
                    ret.after = {
                        page_type: "special_detail"
                    }
                }
                // 明星详情
                else if ("m_open_star_page" === behavior) {
                    url = `${Tools.getPath()}star.html`;
                    params = {
                        id: ntt.star_person_id
                    };
                    ret.pageName = "star_person_detail";
                    ret.after = {
                        page_type: "star_person_detail",
                        star_person_id: ntt.star_person_id
                    }
                }
                // 标签页面
                // else if ("m_open_label_page" === behavior) {
                //     url = "./children_list.html";
                //     params = {
                //         condition: Json.serializ({ field: ntt.filter, key: ntt.label_id, title: ntt.label_name })
                //     };
                //     reOpt.pageType = "filter";
                // }
                // 视频播放器
                // else if ("m_open_video_player" === behavior) {
                //     url = "./play.html";
                //     params = { video_id: ntt.video_id };
                //     // reOpt.pageType = "play";
                // }
                // 播放器
                // else if ("m_open_player" === behavior) {
                //     // url = "play.html";
                //     // 指定播放器类型播放源类型单独匹配
                // }
                // 我的订购
                // else if ("m_open_payment_page" === behavior) {
                //     url = "./vip.html";
                //     reOpt.pageType = "star_person_detail";
                // }
                // 设置页面
                // else if ("m_open_setting_page" === behavior) {
                //     // url = "setting.html";
                // }
                // 小窗播放
                else if ("m_open_min_video_player" === behavior) {
                    // 设置全屏地址
                    params = {
                        video_id: ntt.video_id
                    };
                    ret.pageName = "play";
                    ret.after = {
                        page_type: "play",
                        video_id: ntt.video_id,
                        seq: ntt.episode
                    }

                }
                // 指定 web 页面
                else if ("m_open_web_url" === behavior) {
                    url = ntt.target_url;
                    ret.pageName = "open_web_url";
                    ret.after = {
                        page_type: "open_web_url"
                    }
                }
                // 返回地址
                if (undefined !== options.backUrl) {
                    params.back_url = options.backUrl;
                } else if ("m_open_web_url" !== behavior) {
                    params.back_url = new FormatUrl(window.location.href, {}).getEncodeURIComponent();
                }
                // 当前页面类型
                if (options.pageType) {
                    params.pageType = options.pageType;
                }
                if ("m_open_web_url" === behavior) {
                    ret.url = url;
                } else {
                    ret.url = new FormatUrl(url, params).getEncodeURIComponent();
                }
                resolve_all(ret);
            }
        });
    }
}
export {
    LaunchLogic,
    MGlobalType
}