import React from 'react';
import {connect} from 'dva';
import {Layout, Row, Col, Slider, InputNumber, Input, Tag, Button, Select, message, Icon} from 'antd';
import BaseComponent from 'components/BaseComponent';
import './index.less';
import Panel from "components/Panel/Panel";

const {Content} = Layout;
const {TextArea} = Input;
const Option = Select.Option;


@connect(({preview, loading}) => ({
    preview,
    loading: loading.models.login
}))  //dva connect
export default class Preview extends BaseComponent {
    state = {
        inputValue: null,
        PDF_URL: '',
        stuWork: '',
        fileComment: ''
        // checked: []
    };

    constructor(props) {
        super(props);
    }

    onChange = (value) => {
        this.setState({
            inputValue: value,
        });
    };

    //获取老师所教所有课程
    fetchAllCourse = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'preview/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseInfo',
                method: 'GET',
                url: '/teacher/allCourseSelect'
            }
        });
    };

    //获取课程详细信息
    fetchCourseInfo = (value) => {
        console.log(`selected ${value}`);
        const {dispatch} = this.props;
        dispatch({
            type: 'preview/@request',
            afterResponse: resp => resp.data,
            payload: {
                valueField: 'courseTimeInfo',
                method: 'GET',
                url: '/teacher/course/' + value
            }
        });
    };

    //获取学生作业名单
    fetchStuInfo = (value) => {
        console.log(`selected ${value}`);
        const {dispatch} = this.props;
        dispatch({
            type: 'preview/@request',
            afterResponse: resp => resp.data,
            // afterResponse: (resp) => {
            //     console.log(resp.data);
            // },
            payload: {
                valueField: 'stuInfo',
                method: 'GET',
                url: '/teacher/checkIn/' + value
            }
        });
    };

    //预览学生作业
    displayHomework = (value, option) => {
        console.log(option);
        this.setState({
            inputValue: Number(value.split('|')[1]),
            fileComment: value.split('|')[4],
            stuWork: {
                "PDF_URL": value.split('|')[0],
                "perCourseId": value.split('|')[2],
                "userId": value.split('|')[3],
            }
        });
    };

    //清空
    // emitEmpty = () => {
    //     this.fileCommentInput.focus();
    //     this.setState({ fileComment: '' });
    // };

    changeFileComment = (e) => {
        this.fileCommentInput.focus();
        this.setState({fileComment: e.target.value});
        this.fileCommentInput.focus();
    };

    //提交分数以及评语
    subComment = () => {
        const {dispatch} = this.props;
        const {stuWork, inputValue, fileComment} = this.state;
        dispatch({
            type: 'preview/@request',
            afterResponse: resp => {
                if (resp.code === 201) {
                    message.success(resp.message);
                } else {
                    message.error(resp.message);
                }
                return resp.data;
            },
            payload: {
                method: 'PUT',
                url: '/teacher/correct',
                data: {
                    "perCourseId": stuWork.perCourseId,
                    "userId": stuWork.userId,
                    "fileScore": inputValue,
                    "fileComment": fileComment
                }
            },
        });
    };

    render() {
        const {checked, stuWork, inputValue, fileComment} = this.state;
        const {courseInfo, courseTimeInfo, stuInfo} = this.props.preview;
        const marks = {
            0: '0分',
            // 60: '60分',
            60: {
                style: {
                    color: 'red',
                },
                label: <strong>60分</strong>,
            },
            80: {
                style: {
                    color: '#2db7f5',
                },
                label: <strong>80分</strong>,
            },
            100: {
                style: {
                    color: 'green',
                },
                label: <strong>100分</strong>,
            },
        };

        return (
            <Layout className="full-layout page preview-page">
                <Content>
                    <Row gutter={26}>
                        <Col md={8}>
                            <Panel title="选择作业相关信息">
                                <Select
                                    placeholder="请选择课程名称"
                                    onMouseEnter={this.fetchAllCourse}
                                    onChange={this.fetchCourseInfo}>
                                    {courseInfo.map(d => <Option key={d.courseId}>{d.courseName}</Option>)}
                                </Select>
                                <Select
                                    placeholder="请选择对应课程信息"
                                    onChange={this.fetchStuInfo}>
                                    {courseTimeInfo.map(d => <Option
                                        key={d.perCourseId}>{d.courseDate} {d.courseTime} {d.courseTopic}</Option>)}
                                </Select>
                                <Select placeholder="请选择学生"
                                    // value={checked}
                                        onChange={this.displayHomework}>
                                    {stuInfo.map(d => <Option
                                        key={d.fileUrl + '|' + d.fileScore + '|' + d.perCourseId + '|' + d.userId + '|' + d.fileComment}
                                        disabled={(d.fileUrl.substring(d.fileUrl.lastIndexOf('.'), d.fileUrl.length)) !== '.pdf' ? true : false }
                                    >{d.studentName}{d.fileUrl.substring(d.fileUrl.lastIndexOf('.'), d.fileUrl.length)}</Option>)}
                                </Select>
                            </Panel>
                            <Panel title="作业批改内容" style={{textAlign: 'center'}}>
                                <Row>
                                    <div className="sliderDiv">
                                        <Slider
                                            marks={marks}
                                            value={typeof inputValue === "number" ? inputValue : 0}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </Row>
                                <Row>
                                    <Tag color="#2db7f5">分数：</Tag>
                                    <InputNumber
                                        id="inputScore"
                                        min={0}
                                        max={100}
                                        style={{marginLeft: 0}}
                                        value={inputValue}
                                        onChange={this.onChange}
                                    />
                                </Row>
                                <Row>
                                    <TextArea
                                        autosize={{minRows: 4}}
                                        className="commentInput"
                                        placeholder="请输入作业评语！"
                                        value={fileComment}
                                        onChange={this.changeFileComment}
                                        ref={node => this.fileCommentInput = node}
                                    />
                                </Row>
                                <Row>
                                    <Button onClick={this.subComment}>提交</Button>
                                </Row>
                            </Panel>
                        </Col>
                        <Col md={16}>
                            <Panel title="作业预览">
                                <iframe
                                    src={stuWork.PDF_URL}
                                    seamless="seamless"
                                    frameBorder="0"
                                    scrolling="no"
                                    name="pdf_show"
                                    id="iframe_pdf"
                                >
                                </iframe>
                                {/*</div>*/}
                            </Panel>
                        </Col>
                    </Row>
                </Content>
            </Layout>

        );
    }
}
