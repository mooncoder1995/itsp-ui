import React from 'react';
import {connect} from 'dva';
import {Layout, Card, Row, Col, Tabs, List, Tag} from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils'
import './index.less'

const {Content} = Layout;
const TabPane = Tabs.TabPane;

@connect(({intro, loading}) => ({
  intro,
  loading: loading.models.intro
}))  //dva connect
export default class Intro extends BaseComponent {

  componentDidMount() {
    this.getOneCourseDetail()
  }

  //获取指定课程详细信息
  getOneCourseDetail = () => {
    const courseId = $$.getStore('lessonItem').courseId
    const resUrl = ($$.getStore('user').userRoleName === "学生")
      ? `http://192.168.0.8:8010/api/student/course/${courseId}`
      : `http://192.168.0.8:8010/api/teacher/course/${courseId}`
    this.props.dispatch({
      type: 'intro/@request',
      afterResponse: resp => resp.data,
      payload: {
        valueField: 'lessonInfo',
        method: 'GET',
        url: resUrl
      }
    })
  }

  render() {
    const {lessonInfo} = this.props.intro
    const courseInfo = $$.getStore('lessonItem')
    const renderTabBar = (props, DefaultTabBar) => (
      <Sticky bottomOffset={80}>
        {({ style }) => (
          <DefaultTabBar {...props} style={{ ...style, zIndex: 1}} />
        )}
      </Sticky>
    )

    return (
      <Layout className="full-layout intro-page">
        <Content>
          {/*<p>{window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.length)}</p>*/}
          {/*{courseDetail.map(item => <p>{item.perCourseId}</p>)}*/}
          <Row gutter={0}>
            <Col span={8}>
              <Card
                className='imgCard'
                cover={
                  <img
                    alt="courseImg"
                    src={courseInfo.imgUrl}
                  />
                }
              />
            </Col>
            <Col span={8}>
              <Card
                className='contentCard'
                title={courseInfo.courseName}
              >
                {courseInfo.teacher}
              </Card>
            </Col>
          </Row>
          <StickyContainer>
            <Tabs className='tabList' defaultActiveKey="2" renderTabBar={renderTabBar}>
              <TabPane tab="目录" key="2">
                <List
                  itemLayout="horizontal"
                  dataSource={lessonInfo}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Tag color="purple">{index+1}</Tag>
                       | {item.courseTopic}{item.courseRemarks} |
                      <a herf="javascript:;" onClick={_ => {
                        $$.setStore('perCourseId', item.perCourseId);
                        this.history.replace('/column/per/comment')
                      }
                      }>讨论</a>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="简介" key="1" style={{ height: 200 }}>
                {courseInfo.introduction}
              </TabPane>
            </Tabs>
          </StickyContainer>
        </Content>
      </Layout>
    );
  }
}
