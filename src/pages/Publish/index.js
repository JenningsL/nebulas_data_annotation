import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Layout, InputNumber, Select, message } from 'antd'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
const FormItem = Form.Item
const Option = Select.Option
const { Header, Content, Footer } = Layout
import {dappAddress} from '../../neb'
const {TextArea} = Input

import './index.less'

class Publish extends Component {
  constructor(props) {
    super(props)
  }

  addTask = (task, reward) => {
    // let args = JSON.stringify([{
    //   title: '文本情感分类',
    //   description: '根据文本的感情色彩将文本分类为好评还是负评',
    //   type: 'choice',
    //   validateNum: 1,
    //   options: ['好评', '负评']
    // }])
    let args = JSON.stringify([task])
    window.postMessage({
        "target": "contentscript",
        "data":{
            "to": dappAddress,
            "value": reward + '',
            "contract":{
                "function": 'publish',
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
          let reward = values.reward
          delete values.reward
          if (values.options) {
            values.options = values.options.split(/,|，/)
          }
          console.log('Received values of form: ', values)
          this.addTask(values, reward)
          message.success('已提交，请确认转账并等待验证')
          setTimeout(() => this.props.history.push('/'), 1000)
        }
      })
  }

  render() {
    // render publish page
    const { getFieldDecorator, getFieldValue } = this.props.form
    return (
      <Content className='content'>
        <div className='page'>
          <Form onSubmit={this.handleSubmit} className="publish-form">
            <FormItem label='任务标题'>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '不能为空' }],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label='任务描述'>
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '不能为空' }],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label='任务类型'>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '不能为空' }],
                initialValue: 'open'
              })(
                <Select style={{ width: 120 }}>
                  <Option value="choice">选择题</Option>
                  <Option value="open">开放题</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label='标注数据'>
              {getFieldDecorator('data', {
                rules: [{ required: true, message: '不能为空' }]
              })(
                <TextArea rows={4}/>
              )}
            </FormItem>
            {
              getFieldValue('type') === 'choice' ?
              <FormItem label='选项'>
                {getFieldDecorator('options', {
                  rules: [{ required: true, message: '不能为空' }]
                })(
                  <Input placeholder='输入选项，选项之间以逗号分割'/>
                )}
              </FormItem>
              : ''
            }
            <FormItem label='验证人数'>
              {getFieldDecorator('validateNum', {
                rules: [{ required: true, message: '不能为空' }],
                initialValue: 1
              })(
                <InputNumber min={1} max={10}/>
              )}
            </FormItem>
            <FormItem label='奖金（NAS）'>
              {getFieldDecorator('reward', {
                rules: [{ required: true, message: '不能为空' }],
                initialValue: 1
              })(
                <InputNumber min={0} max={100}/>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="publish-form-button">
                发布
              </Button>
            </FormItem>
          </Form>
        </div>
      </Content>
    )
  }

}

Publish = Form.create()(Publish)
Publish = withRouter(Publish)

export default Publish
