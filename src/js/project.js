import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../css/widgets/swiper.scss';
import { getScript, getSearch } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/project.scss';
import ProjectList from './components/project/project-list';

class Project extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "noMore": true,
            "size": 20,
            "disciplineName": "射箭",
            "list": [
                {
                    "rsc": "ARW470000",
                    "eventName": "女子团体",
                    "medals": [
                        {
                            "medalType": "ME_GOLD",
                            "organisation": "KOR",
                            "organisationName": "韩国",
                            "organisationImgUrl": "http://img1.cache.netease.com/pcluster/olympicinfo/post/7df/616/7ee/23a7b6f489cadb9d943d556_90x60.jpg",
                            "scheduleResult": "5",
                            "recordIndicators": 2,
                            "athletesList": [
                                "崔米尚",
                                "奇甫倍",
                                "张惠珍"
                            ]
                        },
                        {
                            "medalType": "ME_SILVER",
                            "organisation": "RUS",
                            "organisationName": "俄罗斯联邦",
                            "organisationImgUrl": "http://img1.cache.netease.com/pcluster/olympicinfo/post/94a/57d/f41/f821faa94c64bf317e9fa12_90x60.jpg",
                            "scheduleResult": "1",
                            "recordIndicators": null,
                            "athletesList": [
                                "图亚娜",
                                "佩洛娃",
                                "斯特潘诺娃"
                            ]
                        },
                        {
                            "medalType": "ME_BRONZE",
                            "organisation": "TPE",
                            "organisationName": "中华台北",
                            "organisationImgUrl": "http://img1.cache.netease.com/pcluster/olympicinfo/post/775/26c/b3b/57b572d72f465387afaad83_90x60.jpeg",
                            "scheduleResult": "5",
                            "recordIndicators": null,
                            "athletesList": [
                                "雷千莹",
                                "林诗嘉",
                                "谭雅婷"
                            ]
                        }
                    ]
                },
                {
                    "rsc": "ARM470000",
                    "eventName": "男子团体",
                    "medals": [
                        {
                            "medalType": "ME_GOLD",
                            "organisation": "KOR",
                            "organisationName": "韩国",
                            "organisationImgUrl": "http://img1.cache.netease.com/pcluster/olympicinfo/post/7df/616/7ee/23a7b6f489cadb9d943d556_90x60.jpg",
                            "scheduleResult": "6",
                            "recordIndicators": null,
                            "athletesList": [
                                "金优镇",
                                "古帮昌",
                                "李成延"
                            ]
                        },
                        {
                            "medalType": "ME_SILVER",
                            "organisation": "USA",
                            "organisationName": "美国",
                            "organisationImgUrl": "http://img1.cache.netease.com/pcluster/olympicinfo/post/3ae/a4b/6a9/dbbf4113b3ac3dbd7152a58_90x60.jpg",
                            "scheduleResult": "0",
                            "recordIndicators": null,
                            "athletesList": [
                                "艾尔利森",
                                "加勒特",
                                "卡明斯基"
                            ]
                        },
                        {
                            "medalType": "ME_BRONZE",
                            "organisation": "AUS",
                            "organisationName": "澳大利亚",
                            "organisationImgUrl": "http://img1.cache.netease.com/pcluster/olympicinfo/post/ddd/956/cc8/52b9bdf418368cd706b92f3_90x60.jpg",
                            "scheduleResult": "6",
                            "recordIndicators": null,
                            "athletesList": [
                                "波特斯",
                                "莱恩",
                                "沃斯"
                            ]
                        }
                    ]
                }
            ]
        };
    }
    render() {
        return (
            <ProjectList {...this.state}/>
        )
    }
};

render((
    <Project />
), document.getElementById('root'));