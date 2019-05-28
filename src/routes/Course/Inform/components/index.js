import React from 'react';
import {connect} from 'dva';
import {Button, message, Layout, Row, Select, Input} from 'antd';
import BaseComponent from 'components/BaseComponent';
import './index.less';
import Panel from 'components/Panel';
import {enquireIsMobile} from '@/utils/enquireScreen';
import $$ from 'cmn-utils';

const {Content} = Layout;
const {TextArea} = Input;
const Option = Select.Option;
var formdata = new FormData();

@connect(({inform, loading}) => ({
    inform,
    loading: loading.models.inform
}))  //dva connect
export default class Inform extends BaseComponent {

    state = {
        isMobile: false,
        perCourseId: '',
        notification: ''
    };

    componentDidMount() {
        this.unregisterEnquire = enquireIsMobile(ismobile => {
            const {isMobile} = this.state;
            if (isMobile !== ismobile) {
                this.setState({
                    isMobile: ismobile
                });
            }
        });
    }

    //获取当前用户所选的所有课程
    fetchAllCourse = () => {
        const {dispatch, isMobile} = this.props;
        dispatch({
            type: 'inform/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseInfo',
                method: 'GET',
                url: '/teacher/allCourseSelect/'
            }
        });
        console.log(isMobile);
    };

    //获取所选课程的上课信息
    fetchCourseInfo = (value) => {
        const {dispatch} = this.props;
        console.log(value);
        dispatch({
            type: 'inform/@request',
            afterResponse: function (resp) {
                console.log(resp.data);
                return resp.data;
            },
            payload: {
                valueField: 'courseTimeInfo',
                method: 'GET',
                url: '/teacher/course/' + value
            }

        })
    }

    //获取所选课程为唯一标识
    handleChange = (value) => {
        this.setState({'perCourseId': value});
        // this.setState({'isDisabled': false})
    };

    //
    changeNotification = (e) => {
        this.notificationInput.focus();
        this.setState({notification: e.target.value});
        this.notificationInput.focus();
    };

    //提交通知内容
    handleClick = () => {
        const { perCourseId, notification } = this.state;
        formdata.perCourseId = perCourseId
        formdata.message = notification
        $$.postform('/teacher/courseNotify', formdata)
            .then(resp => message.success(resp.message))
          .catch(e => console.log(e))
    }

    componentWillUnmount() {
        // 清理监听
        this.unregisterEnquire();
    }

    render() {
        const {courseInfo, courseTimeInfo} = this.props.inform;
        const { isMobile, notification} = this.state
        return (
            <Layout className="full-layout page inform-page" style={{overflow: 'hidden'}}>
                <Content>
                    <Row gutter={26} className={isMobile ? "ant-row" : "ant-row___desktop"}>
                        <Panel title="发送通知" width={isMobile? 300 :500}>
                            <div align="center">
                                <Select size="large" placeholder="请选择课程名称"
                                        className={isMobile ? "ant-select" : "ant-select___desktop"}
                                        onMouseEnter={this.fetchAllCourse} onChange={this.fetchCourseInfo}>
                                    {courseInfo.map(d => <Option key={d.courseId}>{d.courseName}</Option>)}
                                </Select>
                                <br/>

                                <Select size="large" onChange={this.handleChange}
                                        className={isMobile ? "ant-select" : "ant-select___desktop"}>
                                    {courseTimeInfo.map(d => <Option
                                        key={d.perCourseId}>{d.courseDate} {d.courseTime} {d.courseTopic}</Option>)}
                                </Select>
                                <br/>
                                <TextArea
                                    className={isMobile ? "notificationInput" : "notificationInput___desktop"}
                                    autosize={{minRows: 4}}
                                    placeholder="请输入通知内容！"
                                    value={ notification }
                                    onChange={this.changeNotification}
                                    ref={node => this.notificationInput = node}
                                />
                                <Button style={{backgroundColor: '#2db7f5', color: 'white'}} onClick={this.handleClick}>
                                    提交
                                </Button>
                            </div>
                        </Panel>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
