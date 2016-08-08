import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/organisation/list.scss';

@CSSModules(styles)
export default class extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isUnfolded: false
      };
   }

   handleClick = () => {
      this.setState({
         isUnfolded: true
      });
   };

   render() {
      let { organisationName, list, noMore, size } = this.props;

      list.map((v, i) => {
         v.date = parseInt(v.date.split('-')[1]) + '月' + parseInt(v.date.split('-')[2]) + '日';
         v.competitions.map((v, i) => {
            if(v.medalType === 'ME_GOLD') {
               v.medalTypeClass = 'medal--gold';
            } else if(v.medalType === 'ME_SILVER') {
               v.medalTypeClass = 'medal--silver';
            } else {
               v.medalTypeClass = 'medal--bronze';
            }
         })
      });

      return (
         <div>
            <h4>{organisationName}</h4>
            {
               list.map((v, i) => {
                  return (
                     <section styleName="list">
                        <div styleName="list_title">
                           <h5>{v.date}</h5>
                           <span>
                              获得
                              <i styleName="medal-gold-v2">{v.medals[0]}</i>
                              <i styleName="medal-silver-v2">{v.medals[1]}</i>
                              <i styleName="medal-bronze-v2">{v.medals[2]}</i>
                           </span>
                        </div>
                        <table styleName="table-medal">
                           <thead>
                              <tr>
                                 <th styleName="medal-title">奖牌</th>
                                 <th>运动员/运动队</th>
                                 <th>项目</th>
                              </tr>
                           </thead>
                           <tbody>
                              {v.competitions.map((v, i) => {
                                 return (
                                    <tr>
                                       <td styleName="medal-title">
                                          <i styleName={v.medalTypeClass}></i>
                                       </td>
                                       <td styleName="dis-team">
                                          <div>
                                             {v.athletesList.map((v, i) => {
                                                return <span>{v}</span>
                                             })}
                                          </div>
                                       </td>
                                       <td styleName="dis-title">
                                          <a href={v.discipline}>
                                             <span styleName="dis-name">{v.disciplineName}</span>
                                             <p>{v.eventName}决赛</p>
                                             <em>{v.recordIndicators ? <span styleName="record">{v.recordIndicators}</span>: null}{v.scheduleResult}</em>
                                          </a>
                                       </td>
                                    </tr>
                                 )
                              })}
                           </tbody>
                        </table>
                     </section>
                  )
               })
            }
         </div>
      )
   }
}