import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {withRouter} from 'react-router'
import {Layout, Breadcrumb, Button, List, Avatar, Icon, Divider, Tag} from 'antd'
const Content = Layout.Content

import {dappAddress, account, neb} from '../../neb'
import './index.less'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: []
    }
  }

  componentDidMount() {
    this.fetchTasks()
    // let tasks = [
    //   {title: '是否收到', description: '123123123', reward: '100000000', id: '0', completed: false, data: 'sfasdfasadfasdf'},
    //   {title: '是否收到', description: '123123123', reward: '100000000', id: '1', completed: false, data: 'sfasdfasadfasdf'},
    //   {title: '是否收到', description: '123123123', reward: '100000000', id: '2', completed: true, data: 'sfasdfasadfasdf'},
    //   {title: '是否收到', description: '123123123', reward: '100000000', id: '3', completed: false, data: 'sfasdfasadfasdf'},
    // ]
    // this.setState({tasks})
  }

  fetchTasks() {
    let from = account.getAddressString()
    var value = "0";
    var nonce = "0"
    // var gas_price = "1000000"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getTasks";
    var callArgs = JSON.stringify(['0']);  //推荐用 JSON.stringify 来生成参数字符串,这样会避免出错!
    var contract = {
        "function": callFunction,
        "args": ''
    }

    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract)
    .then((resp) => {
        let tasks = JSON.parse(resp.result)
        console.log(tasks);
        this.setState({tasks})
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    })
  }

  render() {
    return (
      <Content className='content'>
        <div className='page'>
          <List
            className='task-list'
            itemLayout="horizontal"
            dataSource={this.state.tasks}
            renderItem={(item, i) => (
              <div className='list-item'>
                <div className='task-id'>
                  {item.id}
                </div>
                <div className='main'>
                  <h4>任务标题：{item.title}</h4>
                  <p>任务描述：{item.description}</p>
                  <p>标注数据：{item.data}</p>
                </div>
                <div className='reward'>
                  <p><Icon type="pay-circle" /></p>
                  <p>{item.reward / Math.pow(10, 18)} NAS</p>
                  <p>
                    <span>{item.answerNum >= item.validateNum ? <Tag>已完成</Tag> : <Tag color="#87d068">未完成</Tag>}</span>
                  </p>
                </div>
                <div className='actions'>
                  <Button type='primary' onClick={() => this.props.history.push(`/answer/${item.id}`)}>答题</Button>
                </div>
              </div>
            )}
          />
        </div>
      </Content>
    );
  }

}

Home = withRouter(Home)

export default Home;
