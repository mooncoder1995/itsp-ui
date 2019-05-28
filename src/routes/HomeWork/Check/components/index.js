import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { enquireIsMobile } from '@/utils/enquireScreen';
import {Layout, Row, Col, Select, message} from 'antd';
import BaseComponent from 'components/BaseComponent';
import Panel from 'components/Panel';
import HomeWorkTable from './columns';
import './check.less';

const { Content } = Layout;
const Option = Select.Option;

@connect(({ datatable, loading }) => ({
    datatable,
    loading: loading.models.datatable
}))
export default class Check extends BaseComponent {

    state = {
        isMobile: false,
        alternateColor: true
    };

    componentDidMount() {
        this.unregisterEnquire = enquireIsMobile(ismobile => {
            const { isMobile } = this.state;
            if (isMobile !== ismobile) {
                this.setState({
                    isMobile: ismobile
                });
            }
        });
    }

    //获取老师所教授的所有课程
    fetchAllCourse = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'datatable/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseInfo',
                method: 'GET',
                url: 'http://59.67.107.169:8010/api/teacher/allCourseSelect'
            }
        });
    };

    //获取指定课程的上课时间等信息
    fetchCourseInfo = (value) => {
        const { dispatch } = this.props;
        console.log(value);
        dispatch({
            type: 'datatable/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseTimeInfo',
                method: 'GET',
                url: 'http://59.67.107.169:8010/api/teacher/course/' + value
            }

        })
    };

    //获取所有作业信息
    handleChange = (value) => {
        const { dispatch, datatable } = this.props;
        const { dataList } = datatable;
        dataList.list.splice(0,dataList.list.length);
        dispatch({
            type: 'datatable/@request',
            afterResponse: function(resp) {
                let arrInfo = { list: []};
                resp.data.forEach(function (item) {
                    arrInfo.list.push(item);
                });
                console.log(arrInfo);
                // console.log(resp.data);
                return arrInfo;
            },
            payload: {
                valueField: 'dataList',
                method: 'GET',
                url: 'http://59.67.107.169:8010/api/teacher/checkIn/' + value
            }
        });
    };

    //删除学生作业
    onCancel = (perCourseId, userId) => {
        const { dispatch, datatable } = this.props;
        const { dataList } = datatable;
        dispatch({
            type: 'datatable/@request',
            // afterResponse: resp => resp.message,
            afterResponse: function(resp) {
                if (resp.code === 204) {
                    dataList.list.forEach((item, index) => {
                        if(item.perCourseId === perCourseId && item.userId === userId){
                            dataList.list.splice(index, 1);
                            // console.log(index);
                        }
                    })
                    message.success(resp.message);
                } else {
                    message.error(resp.message);
                }
            },
            payload: {
                method: 'DELETE',
                url: `http://59.67.107.169:8010/api/file/file?perCourseId${perCourseId}&userId=${userId}`
            },
        });
    };

    componentWillUnmount() {
        // 清理监听
        this.unregisterEnquire();
    }

    render() {
        const { datatable, loading } = this.props;
        const { dataList, courseInfo, courseTimeInfo } = datatable;
        const { isMobile, alternateColor } = this.state;

        return (
            <Layout className="full-layout page datatable-page">
                <Content>
                    <Row gutter={40}>
                        <Panel title="选择课程信息">
                            <Col md={9}>
                                <Select size="large" placeholder="请选择课程名称" className={isMobile ? "ant-select" : "ant-select___desktop"}
                                        onMouseEnter={this.fetchAllCourse} onChange={this.fetchCourseInfo}>
                                    {courseInfo.map(d => <Option key={d.courseId} >{d.courseName}</Option>)}
                                </Select>
                            </Col>
                            <Col md={9}>
                                <Select size="large" placeholder="请选择对应课程信息" className={isMobile ? "ant-select" : "ant-select___desktop"}
                                        onChange={this.handleChange}>
                                    {courseTimeInfo.map(d => <Option key={d.perCourseId}>{d.courseDate} {d.courseTime} {d.courseTopic}</Option>)}
                                </Select>
                            </Col>
                        </Panel>
                    </Row>

                    <Panel title="所有作业" scroll>
                        {/*<DataTable pagination={{ pageSize: 20 }} {...dataTableProps1} />*/}
                        <HomeWorkTable
                            loading={loading}
                            rowKey='perCourseId'
                            alternateColor={alternateColor}
                            dataItem={dataList}
                            onCancel={this.onCancel}
                        />
                    </Panel>
                </Content>
            </Layout>
        );
    }
}
