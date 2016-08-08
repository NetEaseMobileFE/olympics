import 'core-js/fn/promise';
import React, { Component } from 'react';
import { render } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import 'swiper';
import '../css/widgets/swiper.scss';
import { getScript, getSearch } from './utils/util';
import CSSModules from 'react-css-modules';
import styles from '../css/organisation.scss';
import OrgList from './components/organisation/org-list';


class Organisation extends Component {
   constructor(props) {
     super(props);

     this.state = {
          "noMore": true,
          "size": 20,
          "list": [
              {
                  "date": "2016-08-06",
                  "medals": [
                      0,
                      1,
                      1
                  ],
                  "competitions": [
                      {
                          "medalType": "ME_SILVER",
                          "recordIndicators": 1,
                          "discipline": "SH",
                          "disciplineName": "射击",
                          "eventName": "女子10米气步枪",
                          "scheduleResult": "207.0",
                          "athletesList": ["杜丽"]
                      },
                      {
                          "medalType": "ME_BRONZE",
                          "recordIndicators": null,
                          "discipline": "SH",
                          "disciplineName": "射击",
                          "eventName": "女子10米气步枪",
                          "scheduleResult": "185.4",
                          "athletesList": ["易思玲"]
                      }
                  ]
              },
              {
                  "date": "2016-08-07",
                  "medals": [
                      1,
                      1,
                      2
                  ],
                  "competitions": [
                      {
                          "medalType": "ME_GOLD",
                          "recordIndicators": null,
                          "discipline": "SH",
                          "disciplineName": "射击",
                          "eventName": "女子10米气手枪",
                          "scheduleResult": "199.4",
                          "athletesList": ["张梦雪"]
                      },
                      {
                          "medalType": "ME_SILVER",
                          "recordIndicators": null,
                          "discipline": "SW",
                          "disciplineName": "游泳",
                          "eventName": "男子400米自由泳",
                          "scheduleResult": "3:41.68",
                          "athletesList": ["孙杨"]
                      },
                      {
                          "medalType": "ME_BRONZE",
                          "recordIndicators": null,
                          "discipline": "FE",
                          "disciplineName": "击剑",
                          "eventName": "女子重剑个人",
                          "scheduleResult": "15",
                          "athletesList": ["孙一文"]
                      },
                      {
                          "medalType": "ME_BRONZE",
                          "recordIndicators": null,
                          "discipline": "SH",
                          "disciplineName": "射击",
                          "eventName": "男子10米气手枪",
                          "scheduleResult": "180.4",
                          "athletesList": ["庞伟"]
                      }
                  ]
              },
              {
                  "date": "2016-08-08",
                  "medals": [
                      2,
                      0,
                      0
                  ],
                  "competitions": [
                      {
                          "medalType": "ME_GOLD",
                          "recordIndicators": null,
                          "discipline": "WL",
                          "disciplineName": "举重",
                          "eventName": "男子56kg",
                          "scheduleResult": "307",
                          "athletesList": ["龙清泉"]
                      },
                      {
                          "medalType": "ME_GOLD",
                          "recordIndicators": null,
                          "discipline": "DV",
                          "disciplineName": "跳水",
                          "eventName": "女子双人3米跳板",
                          "scheduleResult": "345.60",
                          "athletesList": [
                              "吴敏霞",
                              "施廷懋",
                              "孙扬",
                              "孙扬",
                              "孙扬",
                              "庞伟"
                          ]
                      }
                  ]
              }
          ],
          "organisationName": "中国"
      };
   }
   render() {
      return (
         <OrgList {...this.state}/>
      )
   }
};

render((
   <Organisation />
), document.getElementById('root'));