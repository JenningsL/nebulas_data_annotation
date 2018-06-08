import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Layout, InputNumber, Select, message } from 'antd'
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
  }

  submitAnswer = (taskId, answer) => {
    let args = JSON.stringify([taskId, answer])
    window.postMessage({
        "target": "contentscript",
        "data":{
            "to": dappAddress,
            "value": '0',
            "contract":{
                "function": 'answer',
                "args": args
            }
        },
        "method": "neb_sendTransaction",
    }, "*");
  }

  handleSubmit = (e) => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.submitAnswer(this.props.match.params.id, values.answer)
          message.success('已提交，请确认交易并等待验证')
          setTimeout(() => this.props.history.push('/'), 1000)
        }
      })
  }

  renderAnswerBox() {
    const { getFieldDecorator } = this.props.form
    const type = this.props.data.type
    if (type === 'choice') {
      return (
        <FormItem label='答案'>
          {getFieldDecorator('answer', {
            rules: [{ required: true, message: '不能为空' }],
          })(
            <Select style={{ width: 120 }}>
              {this.props.data.options.map((opt, i) => <Option value={opt}>{opt}</Option>)}
            </Select>
          )}
        </FormItem>
      )
    } else if (type === 'open') {
      return (
        <FormItem label='答案'>
          {getFieldDecorator('answer', {
            rules: [{ required: true, message: '不能为空' }],
          })(
            <Input placeholder='输入你的答案'/>
          )}
        </FormItem>
      )
    }
  }

  render() {
    // render publish page

    const task = this.props.data
    return (
      <Content className='content'>
        <div className='page answer-page'>
          <Form onSubmit={this.handleSubmit} className="publish-form">
            <h3>{task.title}</h3>
            <p>任务说明：{task.description}</p>
            <p className='task-data'>{task.data}</p>
            <p>奖励<Icon type="pay-circle" />
              <span className='important-number'>{task.reward / Math.pow(10, 18)}</span> NAS，
              <span className='important-number'>{task.validateNum}</span>人平分
            </p>
            {this.renderAnswerBox()}
            <FormItem>
              <Button type="primary" htmlType="submit" className="publish-form-button">
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
      </Content>
    )
  }

}

Answer = Form.create()(Answer)

async function getData(props) {
  let taskId = props.match.params.id

  let from = account.getAddressString()
  var value = "0";
  var nonce = "0"
  var gas_price = "1000000"
  var gas_limit = "2000000"
  var callFunction = "getTask";
  var callArgs = JSON.stringify([taskId]);  //推荐用 JSON.stringify 来生成参数字符串,这样会避免出错!
  var contract = {
      "function": callFunction,
      "args": callArgs
  }

  return await neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract)
    .then((resp) => {
      console.log(resp);
        let task = JSON.parse(resp.result)
        console.log(task);
        return task
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    })
}

Answer = LoadingWrapper(Answer, getData)

export default Answer
