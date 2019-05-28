import React from 'react';
import WaterFall from 'components/WaterFall';
import LazyLoad from 'components/LazyLoad';
import {Layout, Card} from 'antd';
import BaseComponent from 'components/BaseComponent';
import './index.less';
import {connect} from "dva";
import $$ from "cmn-utils"

const {Content} = Layout;
const {Meta} = Card;

@connect(({lessons, loading}) => ({
  lessons,
  loading: loading.models.lessons
}))
export default class Lessons extends BaseComponent {
  state = {
    dataSrc: '',
    visible: false,
    allCourse: [],
    lessonSource: []
  }

  componentDidMount() {
    $$.removeStore('lessonItem')
    this.getAllCourseNames()
    const self = this;
    document.addEventListener('lazybeforeunveil', ({target}) => {
      self.water.layout();
    });
  }

  //获取所有的课程名称
  getAllCourseNames() {
    const {dispatch, lessons} = this.props
    const resUrl = ($$.getStore('user').userRoleName === "学生")
      ? 'http://192.168.0.8:8010/api/student/allCourseSelect'
      : 'http://192.168.0.8:8010/api/teacher/allCourseSelect'
    dispatch({
      type: 'lessons/@request',
      afterResponse: resp => resp.data,
      payload: {
        valueField: 'courseNames',
        method: 'GET',
        url: resUrl
      }
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const {courseNames} = this.props.lessons;
    return (
      <Layout className="full-layout page lessons-page">
        <Content>
          <WaterFall
            ref="waterFall"
            className="gallery-water-fall"
            dataSource={courseNames}
            columnWidth={240}
            fitWidth
            gutter={16}
            getInstance={water => (this.water = water)}
            render={item => (
              <Card
                hoverable
                cover={
                  <LazyLoad
                    dataSrc={item.imgUrl}
                    onClick={
                      _ => {
                        this.props.dispatch({
                          type: 'lessons/change',
                          payload: {item}
                        })
                        $$.setStore('lessonItem', item);
                        this.history.replace(`/column/intro/`)
                      }}
                  />
                }
              >
                <Meta
                  title={item.courseName}
                  // description={item.courseRemarks}
                />
              </Card>
            )}
          />
        </Content>
      </Layout>
    );
  }
}