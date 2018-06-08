import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Layout, InputNumber, Select, message, List, Tag } from 'antd'
import {Link} from 'react-router-dom'
const FormItem = Form.Item
const Option = Select.Option
const { Header, Content, Footer } = Layout
import {Redirect} from 'react-router-dom'
import {dappAddress, account, neb} from '../../neb'
import LoadingWrapper from '../../component/LoadingWrapper'

import './index.less'

class Answer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSubmit = (e) => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.fetchAnswers(values.address)
        }
      })
  }

  fetchAnswers(author) {
    var value = "0";
    var nonce = "0"
    // var gas_price = "1000000"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getAnswers";
    var callArgs = JSON.stringify([null, author]);  //推荐用 JSON.stringify 来生成参数字符串,这样会避免出错!
    var contract = {
        "function": callFunction,
        "args": ''
    }

    neb.api.call(author, dappAddress, value, nonce, gas_price, gas_limit, contract)
    .then((resp) => {
        let answers = JSON.parse(resp.result)
        console.log(answers);
        this.setState({answers})
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    })
  }

  render() {
    // render publish page
    const {getFieldDecorator} = this.props.form
    return (
      <Content className='content'>
        <div className='page'>
          <h3>查询我发布的任务</h3>
          <Form onSubmit={this.handleSubmit} className="publish-form">
            <FormItem>
              {getFieldDecorator('address', {
                rules: [{ required: true, message: '不能为空' }],
              })(
                <Input placeholder='请输入你的钱包地址'/>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="publish-form-button">
                查询
              </Button>
            </FormItem>
          </Form>
          <List
            className='task-list'
            itemLayout="horizontal"
            dataSource={this.state.answers}
            renderItem={(item, i) => (
              <div className='list-item'>
                <div className='task-id'>
                  {item.id}
                </div>
                <div className='main'>
                  <h4>任务标题：{item.task.title}</h4>
                  <p>任务描述：{item.task.description}</p>
                  <p>标注数据：{item.task.data}</p>
                  <p>我的回答：{item.answer}</p>
                </div>
                <div className='reward'>
                  <p><Icon type="pay-circle" /></p>
                  <p>{parseInt(item.task.reward) / item.task.validateNum / Math.pow(10, 18)} NAS</p>
                  <p>
                    <span>{item.validated ? <Tag>已获得</Tag> : <Tag color="#87d068">待验证</Tag>}</span>
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </Content>
    )
  }

}

Answer = Form.create()(Answer)

export default Answer
