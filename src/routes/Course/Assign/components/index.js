import React from 'react';
import {connect} from 'dva';
import {Layout, Timeline, Icon} from 'antd';
import BaseComponent from 'components/BaseComponent';
import {IoIosBook} from 'react-icons/io';
import './index.less';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import $$ from "cmn-utils";

const {Content} = Layout;

@connect(({assign, loading}) => ({
    assign,
    loading: loading.models.assign
}))  //dva connect
export default class Assign extends BaseComponent {
    componentDidMount() {
        this.getTodayCourseData();
    }

    getTodayCourseData = () => {
        const {dispatch} = this.props;
        var sendURL = ''
        if ($$.getStore('user').userRoleName === "学生") {
            sendURL = "http://192.168.43.191:8010/api/student/todayCourse";
        } else {
            sendURL = "http://192.168.43.191:8010/api/teacher/todayCourse"
        }
        dispatch({
            type: 'assign/@request',
            afterResponse: resp => resp.data,
            // afterResponse: function(resp){
            //     console.log(resp.data);
            //     return resp.data;
            // },
            payload: {
                valueField: 'todayCourse',
                method: 'GET',
                url: sendURL
            }
        })
    }

    CountCourse() {
        const {assign} = this.props;
        const {todayCourse} = assign;
        console.log(todayCourse);
        let courseAssign = todayCourse.map(function (item, index) {
            console.log(item);
            return (
                <VerticalTimelineElement
                    className={item.courseName}
                    date={item.courseTime}
                    iconStyle={{background: 'rgb(33, 150, 243)', color: '#fff'}}
                    icon={<IoIosBook/>}
                >
                    <h3 className="vertical-timeline-element-title">课程名称：{item.courseName}</h3>
                    <h4 className="vertical-timeline-element-subtitle">课程地点：{item.courseRoom}</h4>
                    <p>
                        课程主题：{item.courseTopic}
                    </p>
                </VerticalTimelineElement>
            )
        });
        return courseAssign;
    };

    render() {
        const {todayCourse} = this.props.assign;
        return (
            <Layout className="full-layout page assign-page">
                <Content>
                    {(todayCourse.length !== 0) ?
                        <VerticalTimeline>
                            {this.CountCourse()}
                        </VerticalTimeline>
                        :
                        <Timeline mode="alternate">
                            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
                                <h2>
                                    今日没有课程！
                                </h2>
                            </Timeline.Item>
                        </Timeline>
                    }
                </Content>
            </Layout>
        );
    }
}
