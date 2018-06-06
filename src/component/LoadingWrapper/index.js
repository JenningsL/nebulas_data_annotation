import React from 'react';
import createReactClass from 'create-react-class'
import { Spin, Alert } from 'antd'

import './style.less';

export default function LoadingWrapper(Component, provideData) {
    return createReactClass({
        getInitialState() {
            return {
                readyState: 'loading',
                data: null
            };
        },
        componentDidMount() {
            provideData(this.props)
            .then(data => this.setState({
                readyState: 'loaded',
                data: data
            }))
            .catch(err => {
                console.log(err);
                this.setState({readyState: 'error'});
            });
        },
        renderLoader() {
            return (
                <div style={{textAlign: 'center', paddingTop: '20px'}}>
                    <Spin size="large" />
                </div>
            );
        },
        renderError() {
            return (
              <div style={{padding: 20}}>
                <Alert message="获取数据出错" type="error" showIcon/>
              </div>
            );
        },
        renderSuccess() {
            return <Component {...this.props} data={this.state.data}/>;
        },
        render() {
            let {readyState} = this.state;

            switch (readyState) {
                case 'loading':
                    return this.renderLoader();
                case 'loaded':
                    return this.renderSuccess();
                case 'error':
                    return this.renderError();
            }
        }
    });
};
