import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import BaseComponent from 'components/BaseComponent';
const { Content } = Layout;

@connect()  //dva connect
export default class Blank extends BaseComponent {
  componentWillMount() {
    this.history.push('/preview')
  }
  render() {
    return (
      <Layout className="full-layout page blank-page">
        <Content ></Content>
      </Layout>
    );
  }
}
