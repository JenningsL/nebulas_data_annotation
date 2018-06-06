import React from 'react'
import { BrowserRouter, Route, IndexRoute, Redirect, Switch } from 'react-router-dom'
import {withRouter} from 'react-router'
import { Layout, LocaleProvider, Menu, Icon } from 'antd';
import Home from './pages/Home'
import Publish from './pages/Publish'
import Answer from './pages/Answer'
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
            <div className="logo" />
            <Menu theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              onSelect={(item, key, selectedKeys) => this.props.history.push(item.key)}
              >
              <Menu.Item key="/">
                <Icon type="user" />
                <span>任务列表</span>
              </Menu.Item>
              <Menu.Item key="/publish">
                <Icon type="user" />
                <span>发布任务</span>
              </Menu.Item>
              <Menu.Item key="/my">
                <Icon type="pie-chart" />
                <span>我答的题</span>
              </Menu.Item>
              <Menu.Item key="/rule">
                <Icon type="desktop" />
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
            </Switch>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }

}

App = withRouter(App)

export default App
