import React from 'react';
import {connect} from 'dva';
import {Carousel, Layout, Row, Col, Timeline, Icon, Divider, List} from 'antd';
import BaseComponent from 'components/BaseComponent';
import './index.less';
import Panel from "../../../components/Panel/Panel";
import $$ from "cmn-utils/lib";

const {Content} = Layout;

@connect()  //dva connect
export default class Home extends BaseComponent {
  state = {
    notifyData: [],
    commentData: []
  }

  componentDidMount() {
    this.getNotify()
    this.getComment()
  }

  //获取最近课程通知
  getNotify = () => {
    $$.get('http://192.168.0.8:8010/api/teacher/getNotify').then(
      resp => {
        this.setState({
          notifyData: resp.data
        })
      }
    )
  }

  //获取最新评论
  getComment = () => {
    $$.get('http://192.168.0.8:8010/api/topic/queryByUserId/T000000001').then(
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
    const {notifyData, commentData} = this.state
    // const data = [
    //   {title:'刘伟信', description:"嵌入式设计与开发-物联作业：完成实验五实验报告"},
    //   {title:'刘伟信', description:"2019年5月7日嵌入式课程设计-物联上课地点改为C409"},
    //   {title:'刘伟信', description:"2019年5月7日嵌入式课程设计-物联/嵌入式课程设计-网络课程资料已上传"}
    // ]
    return (
      <Layout className="full-layout page home-page">
        <Content>
          <Carousel autoplay>
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
