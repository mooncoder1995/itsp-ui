import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Layout, Row, Col, Select, message} from 'antd';
import BaseComponent from 'components/BaseComponent';
import Panel from 'components/Panel';
import $$ from 'cmn-utils';
import Columns from './columns';
import './index.less';
const { Content } = Layout;
const Option = Select.Option;

@connect(({ edit, loading }) => ({
    edit,
    loading: loading.models.datatable
}))
export default class Edit extends BaseComponent {
    state= {
        alternateColor: true
    }

    componentDidMount() {
       this.getCourseData();
    }

    getCourseData() {
        const { dispatch } = this.props;
        dispatch({
            type: 'edit/@request',
            afterResponse: function(resp) {
                let arrInfo = { list: []};
                resp.data.forEach(item => arrInfo.list.push({
                    perCourseId:item.perCourse.perCourseId,
                    courseId:item.perCourse.courseId,
                    courseName:item.perCourse.courseName,
                    courseRoom:item.perCourse.courseRoom,
                    courseDate:item.perCourse.courseDate,
                    courseTime:item.perCourse.courseTime,
                    courseTopic:item.perCourse.courseTopic,
                    fileUrl:item.fileUrl
                }));
                console.log(arrInfo);
                return arrInfo;
            },
            payload: {
                valueField: 'allCourseInfo',
                method: 'GET',
                url: 'http://192.168.0.8:8010/api/student/allHomework'
            }
        });
    }
    //获取学生的所有课程
    fetchAllCourse = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'edit/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseInfo',
                method: 'GET',
                url: 'http://192.168.0.8:8010/api/student/allCourseSelect'
            }
        });
    };

    //获取指定课程的上课时间等信息
    fetchCourseInfo = (value) => {
        const { dispatch } = this.props;
        console.log(value);
        dispatch({
            type: 'edit/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseTimeInfo',
                method: 'GET',
                url: 'http://192.168.0.8:8010/api/student/course/' + value
            }

        })
    };

    onCancel = (perCourseId) => {
        const { dispatch, edit } = this.props;
        const { allCourseInfo } = edit;
        dispatch({
            type: 'edit/@request',
            afterResponse: function(resp) {
                if(resp.code === 204) {
                    allCourseInfo.list.forEach((item, index) => {
                        if(item.perCourseId === perCourseId ){
                            allCourseInfo.list.splice(index, 1);
                        }
                    })
                    message.success(resp.message);
                } else {
                    message.error(resp.message);
                }

            },
            payload: {
                method: 'DELETE',
                url: `http://192.168.0.8:8010/api/file/file?perCourseId=${perCourseId}&userId=${$$.getStore("user").userId}`
            },
        });
    }

    //获取所有作业信息
    // handleChange = (value) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'edit/@request',
    //         afterResponse: function(resp) {
    //             let arrInfo = { list: []};
    //             resp.data.forEach(function (item) {
    //                 arrInfo.list.push(item);
    //             });
    //             console.log(arrInfo);
    //             // console.log(resp.data);
    //             return arrInfo;
    //         },
    //         payload: {
    //             valueField: 'dataList',
    //             method: 'GET',
    //             url: '/student/checkIn/' + value
    //         }
    //     });
    // };

    render() {
        const { edit, loading } = this.props;
        const { alternateColor } = this.state;
        const { allCourseInfo, courseInfo, courseTimeInfo } = edit;

        return (
            <Layout className="full-layout page edit-page">
                <Content>
                    {/*<Row gutter={40}>*/}
                        {/*<Panel title="选择课程信息">*/}
                            {/*<Col md={9}>*/}
                                {/*<Select size="large" placeholder="请选择课程名称"*/}
                                        {/*onMouseEnter={this.fetchAllCourse} onChange={this.fetchCourseInfo}>*/}
                                    {/*{courseInfo.map(d => <Option key={d.courseId} >{d.courseName}</Option>)}*/}
                                {/*</Select>*/}
                            {/*</Col>*/}
                            {/*<Col md={9}>*/}
                                {/*<Select size="large" placeholder="请选择对应课程信息"*/}
                                       {/*onChange={this.handleChange}>*/}
                                    {/*{courseTimeInfo.map(d => <Option key={d.perCourseId}>{d.courseDate} {d.courseTime}</Option>)}*/}
                                {/*</Select>*/}
                            {/*</Col>*/}
                        {/*</Panel>*/}
                    {/*</Row>*/}

                    <Panel title="所有作业" height={500} scroll>
                        <Columns
                            loading={loading}
                            rowKey='perCourseId'
                            dataItem={allCourseInfo}
                            alternateColor={alternateColor}
                            onCancel={this.onCancel}
                        />
                    </Panel>
                </Content>
            </Layout>
        );
    }
}
