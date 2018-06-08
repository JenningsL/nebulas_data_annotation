import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {withRouter} from 'react-router'
import {Layout, Breadcrumb, Button, List, Avatar, Icon, Divider, Tag} from 'antd'
const Content = Layout.Content

import {dappAddress, account, neb} from '../../neb'
import './index.less'

class Intro extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Content className='content'>
        <div className='page'>
          <h3>简介</h3>
          <p>这是一个基于<a href='https://nebulas.io/'>星云链</a>的有偿数据标注平台，用户可以支付一定数量的NAS发布标注任务，标注用户完成标注后即可获得相应奖励。发布、标注、结算的过程均在智能合约中自动执行。</p>
          <h3>如何发布任务</h3>
          <p>进入发布任务页面，填写任务的标题和描述，以及需要标注的语料数据，并选择问题类型。如果是选择题，还需要提供答案选项。发布者可以要求至少N位标注者相互验证（当有N位标注者给出相同答案时则验证通过），相互验证的过程会在在智能合约中自动完成。</p>
          <p>目前只支持自然语言处理的语料标注，后续会增加图像类的标注功能。</p>
          <h3>如何完成任务</h3>
          <p>在任务列表中选择任务点击答题按钮，提交答案。注意：回答已经完成的任务不会获得奖励。</p>
        </div>
      </Content>
    );
  }

}

export default Intro;
