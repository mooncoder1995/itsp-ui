import React from 'react';
import {connect} from 'dva';
import {Carousel, Layout, Row, Col, Timeline, Icon, Divider, List} from 'antd';
import BaseComponent from 'components/BaseComponent';
import './index.less';
import Panel from "../../../components/Panel/Panel";
import $$ from "cmn-utils/lib";
import {enquireIsMobile} from '@/utils/enquireScreen';

const {Content} = Layout;

@connect()  //dva connect
export default class Home extends BaseComponent {
  state = {
    notifyData: [],
    commentData: [],
    isMobile: false
  }

  componentDidMount() {
    this.getNotify()
    this.getComment()
    this.judgeIsMobile()
  }

  //判断是否是手机
  judgeIsMobile = () => {
    this.unregisterEnquire = enquireIsMobile(ismobile => {
      const {isMobile} = this.state;
      if (isMobile !== ismobile) {
        this.setState({
          isMobile: ismobile
        });
      }
    });
  }

  //获取最近课程通知
  getNotify = () => {
    let sendUrl = $$.getStore('user').userRoleName === '学生'
      ? 'http://59.67.107.169:8010/api/student/getNotify'
      : 'http://59.67.107.169:8010/api/teacher/getNotify'
    $$.get(sendUrl).then(
      resp => {
        this.setState({
          notifyData: resp.data
        })
      }
    )
  }

  //获取最新评论
  getComment = () => {
    $$.get('http://59.67.107.169:8010/api/topic/queryByUserId/T000000001').then(
      resp => {
        let data = []
        resp.data.forEach((item,index) => {
          if(index <4) {
            data.push(item)
          }
        })
        this.setState({
          commentData: data
        })
      }
    )
  }

  render() {
    const {notifyData, commentData, isMobile} = this.state
    return (
      <Layout className="full-layout page home-page">
        <Content>
          <Carousel autoplay  className={isMobile? 'ant-carousel slick-slide': ''}>
            <div className='back-one'><div className='image-one'><h3>1</h3></div></div>
            <div className='back-two'><div className='image-two'><h3>2</h3></div></div>
            <div className='back-three'><div className='image-three'><h3>3</h3></div></div>
          </Carousel>
          <Row gutter={26} style={{marginTop: '20px'}}>
            <Col md={12}>
              <Panel title="课程信息通知" height={300}>
                <List
                  style={{paddingLeft: '40px'}}
                  itemLayout="horizontal"
                  dataSource={notifyData}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="https://ant.design">{item.notifyTime}</a>}
                        description={item.notifyContent}
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            </Col>
            <Col md={12}>
              <Panel title="最新评论信息" height={300}>
                <Timeline style={{marginTop: '20px', paddingLeft: '40px'}}>
                  {commentData.map((item, index) =>
                    <Timeline.Item dot={<Icon type="clock-circle-o" style={{fontSize: '16px'}}/>}>
                    {item.topicCreatedTime}<br/>
                    {item.topicUserId}发布留言：{item.topicContent}
                    </Timeline.Item>)}
                </Timeline>
              </Panel>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
