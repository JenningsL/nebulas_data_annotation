import React from 'react'
import { BrowserRouter, Route, IndexRoute, Redirect, Switch } from 'react-router-dom'
import {withRouter} from 'react-router'
import { Layout, LocaleProvider, Menu, Icon, Modal } from 'antd';
import Home from './pages/Home'
import Publish from './pages/Publish'
import Answer from './pages/Answer'
import Intro from './pages/Intro'
import MyPublish from './pages/MyPublish'
import MyAnswer from './pages/MyAnswer'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import './App.less'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if(typeof(window.webExtensionWallet) === "undefined"){
          //alert ("Extension wallet is not installed, please install it first.")
          Modal.warning({
            title: '您还没有安装星云链钱包插件，将无法正常使用。请先到 https://github.com/nebulasio/WebExtensionWallet 安装。',
          })
      }
    }, 500)
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    return (
      <LocaleProvider>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          >
            <div className="logo">
              <Icon type="rocket" />
              数据标注平台
            </div>
            <Menu theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              onSelect={(item, key, selectedKeys) => this.props.history.push(item.key)}
              >
              <Menu.Item key="/">
                <Icon type="profile" />
                <span>任务列表</span>
              </Menu.Item>
              <Menu.Item key="/my_publish">
                <Icon type="user" />
                <span>我的发布</span>
              </Menu.Item>
              <Menu.Item key="/my_answer">
                <Icon type="pay-circle" />
                <span>我的回答</span>
              </Menu.Item>
              <Menu.Item key="/publish">
                <Icon type="form" />
                <span>发布任务</span>
              </Menu.Item>
              <Menu.Item key="/intro">
                <Icon type="question-circle-o" />
                <span>规则说明</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Switch>
              <Route path='/' component={Home} exact/>
              <Route path='/publish' component={Publish} />
              <Route path='/answer/:id' component={Answer} />
              <Route path='/intro' component={Intro} />
              <Route path='/my_publish' component={MyPublish} />
              <Route path='/my_answer' component={MyAnswer} />
            </Switch>
            <Footer style={{ textAlign: 'center' }}>
              Powered by Nebulas
            </Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }

}

App = withRouter(App)

export default App
