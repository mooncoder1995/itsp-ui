import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { enquireIsMobile } from '@/utils/enquireScreen';
import { Layout, Row, Select, Button, Upload, message, Icon } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Panel from 'components/Panel';
import './handle.less';

const { Content } = Layout;
const Option = Select.Option;


@connect(({ table, loading }) => ({
    table,
    loading: loading.models.table
}))
export default class Handle extends BaseComponent {
    state = {
        perCourseId: '',
        isDisabled: true,
        isMobile: false
    };

    componentDidMount() {
       this.judgeIsMobile()
    }
    //判断是否是手机
    judgeIsMobile = () => {
      this.unregisterEnquire = enquireIsMobile(ismobile => {
        const { isMobile } = this.state;
        if (isMobile !== ismobile) {
          this.setState({
            isMobile: ismobile
          });
        }
      });
    }
    //获取当前用户所选的所有课程
    fetchAllCourse = ( ) => {
        const { dispatch, isMobile } = this.props;
        dispatch({
            type: 'table/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseInfo',
                method: 'GET',
                url: 'http://192.168.0.8:8010/api/student/allCourseSelect/'
            }
        });
        console.log(isMobile);
    };

    //获取所选课程的上课信息
    fetchCourseInfo = (value) => {
        const { dispatch } = this.props;
        console.log(value);
        dispatch({
            type: 'table/@request',
            afterResponse: function(resp) {
                console.log(resp.data);
                return resp.data;
            },
            payload: {
                valueField: 'courseTimeInfo',
                method: 'GET',
                url: 'http://192.168.0.8:8010/api/student/course/' + value
            }

        })
    };

    //获取所选课程为唯一标识
    handleChange = (value) => {
        this.setState({'perCourseId': value}) ;
        this.setState({'isDisabled': false})
    };

    //对上传文件添加提示信息
    click = () => {
        if (this.state.isDisabled === true) {
            message.error(`请选择所要上传的课程信息！`)
        }
    };
    componentWillUnmount() {
        // 清理监听
        this.unregisterEnquire();
    }

    render() {
        const { table, loading} = this.props;
        const { isMobile } = this.state;
        const { courseInfo, courseTimeInfo} = table;
        //上传文件的参数设置
        const props = {
            name: 'uploadFile',
            action: 'http://192.168.0.8:8010/api/api/student/handIn/' + this.state.perCourseId,
            headers: {
                authorization: 'authorization-text',
            },
            //返回参数解析
            onChange(info) {
                console.log(info);
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    if (info.file.response.icon === 'success') {
                        message.success(`${info.file.name} 文件上传成功`);
                    } else {
                        message.error(`${info.file.name} 文件上传失败--` + `${info.file.response.message}`)
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <Layout className="full-layout page table-page" style={{overflow: 'hidden'}}>
                <Content>
                    <Row gutter={26}>
                        <Panel title="选择课程信息" width={500}>
                            <div align="center">
                                <Select size="large" placeholder="请选择课程名称" className={isMobile ? "ant-select" : "ant-select___desktop"}
                                        onMouseEnter={this.fetchAllCourse} onChange={this.fetchCourseInfo}>
                                    {courseInfo.map(d => <Option key={d.courseId} >{d.courseName}</Option>)}
                                </Select>
                                <br />

                                <Select size="large" onChange={this.handleChange} className={isMobile ? "ant-select" : "ant-select___desktop"}>
                                    {courseTimeInfo.map(d => <Option key={d.perCourseId}>{d.courseDate} {d.courseTime} {d.courseTopic}</Option>)}
                                </Select>
                                <br />
                                <Upload {...props} disabled={this.state.isDisabled}>
                                    <Button onClick={this.click} className={isMobile ? "ant-btn" : "ant-btn___desktop"}>
                                        <Icon type="upload" /> 上传作业
                                    </Button>
                                </Upload>
                            </div>
                        </Panel>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
