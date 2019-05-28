import React from 'react';
import {connect} from 'dva';
import {Layout, Select, Tag, message, Icon, Modal} from 'antd';
import BaseComponent from 'components/BaseComponent';
import Panel from 'components/Panel';
import './index.less'
import StudentTable from './StudentTable'
import InfoForm from './InfoForm'

const {Content} = Layout;
const Option = Select.Option;
//找到对应元素的索引
function catchIndex(arr, key){
  let index1 = 0;
  arr.map(function (ar, index) {
    if(ar.userId === key){
      index1 = index;
    }
  });
  return index1;
}

@connect(({stuManagement, loading}) => ({
  stuManagement: stuManagement,
  loading: loading.models.stuManagement
}))  //dva connect
export default class StuManagement extends BaseComponent {

  state = {
    courseId: '',
    isUpdate: true,
    visible: false
  }
  componentDidMount() {
    this.fetchAllCourse()
  }

  //获取老师所教授的所有课程
  fetchAllCourse = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'stuManagement/@request',
      afterResponse: resp => resp.data,
      payload: {
        valueField: 'courseInfo',
        method: 'GET',
        url: 'http://59.67.107.169:8010/api/teacher/allCourseSelect'
      }
    });
  };

  //获取该课程下所有学生信息
  fetchStuInfo = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'stuManagement/@request',
      // afterResponse: resp => resp.data,
      afterResponse: (resp) => {
        if (resp.icon !== 'success') {
          message.error('resp.message')
        } else {
          let arrInfo = {list: []};
          resp.data.forEach(function (item) {
            arrInfo.list.push(item);
          });
          this.setState({
            courseId: value
          })
          return arrInfo;
        }
      },
      payload: {
        valueField: 'stuList',
        method: 'GET',
        url: 'http://59.67.107.169:8010/api/teacher/allStudent/' + value
      }
    })
  }

  //点击添加学生
  addStu = () => {
    this.setState({
      visible: true,
      isUpdate: false
    })
    const form = this.form
    form.resetFields()
  }

  //接受新建表单数据
  saveFormRef = (form) => {
    this.form = form;
  };

  //为课程添加新的学生
  onCreate = () => {
    const {dispatch} = this.props;
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      dispatch({
        type: 'stuManagement/@request',
        // afterResponse: resp => resp.message,
        afterResponse: resp => {
          if (resp.code === 201) {
            message.success(resp.message);
            this.fetchStuInfo(this.state.courseId)
          } else {
            message.error(resp.message);
          }
        },
        payload: {
          method: 'POST',
          url: 'http://59.67.107.169:8010/api/mapping/mapping',
          data: {
              "studentId": values.userId,
              "courseId": values.courseId
          }
        },
      })
      form.resetFields();
      this.setState({
        visible: false,
        isUpdate: true
      })
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      isUpdate: true
    })
  }

  //点击修改按钮
  editClick = (userId) => {
    this.setState({
      isUpdate: true
    })
    const form = this.form
    const dataSource = this.props.stuManagement.stuList.list
    const index = catchIndex(dataSource, userId);
    form.setFieldsValue({
      userId: dataSource[index].userId,
      userAcademy: dataSource[index].userAcademy,
      userMajor: dataSource[index].userMajor,
      userClass: dataSource[index].userClass,
      userName: dataSource[index].userName,
      userGender: dataSource[index].userGender,
      userPhone: dataSource[index].userPhone,
      userRemarks: dataSource[index].userRemarks,
    });
    this.setState({
      visible: true
    })
  }

  //修改学生信息
  onChange = () => {
    const {dispatch} = this.props;
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      dispatch({
        type: 'stuManagement/@request',
        // afterResponse: resp => resp.message,
        afterResponse: resp => {
          if (resp.code === 201) {
            message.success(resp.message);
            this.fetchStuInfo(this.state.courseId)
          } else {
            message.error(resp.message);
          }
        },
        payload: {
          method: 'PUT',
          url: 'http://59.67.107.169:8010/api/user/user',
          data: values
        },
      });
    })
    this.setState({
      visible: false,
      isUpdate: false
    })
  }

  //删除学生信息
  onCancel = (userId) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'stuManagement/@request',
      // afterResponse: resp => resp.message,
      afterResponse: resp => {
        if (resp.code === 204) {
          message.success(resp.message);
          this.fetchStuInfo(this.state.courseId)
        } else {
          message.error(resp.message);
        }
      },
      payload: {
        method: 'DELETE',
        url: `http://59.67.107.169:8010/api/teacher/removeStudent?studentId=${userId}&courseId=${this.state.courseId}`
      },
    });
  };

  render() {
    const {isUpdate, visible} = this.state
    const {stuManagement, loading} = this.props
    const {stuList, courseInfo} = stuManagement

    return (
      <Layout className="full-layout page stu-management-page">
        <Content>
          <Panel title="学生管理" scroll>
            <Tag color="#2db7f5">课程名称：</Tag>
            <Select placeholder="请选择课程名称" onChange={this.fetchStuInfo}>
              {courseInfo.map(d => <Option key={d.courseId}>{d.courseName}</Option>)}
            </Select>
            <Tag color="#2db7f5" style={{margin: 20, marginLeft: 0, width: 80, textAlign: 'center'}}
                 onClick={this.addStu}>
              <Icon type="plus"/>
              添加
            </Tag>
            <StudentTable
              loading={loading}
              rowKey='userId'
              alternateColor={true}
              dataItem={stuList}
              hadleChange={this.editClick}
              onCancel={this.onCancel}
            />
          </Panel>
          {isUpdate ?
            <InfoForm
              ref={this.saveFormRef}
              visible={visible}
              title="修改学生信息"
              text="更新"
              onCancel={this.handleCancel}
              onCreate={this.onChange}
              map={true}
            /> :
            <InfoForm
              ref={this.saveFormRef}
              visible={visible}
              title="添加学生"
              text="添加"
              onCancel={this.handleCancel}
              onCreate={this.onCreate}
              map={false}
              courseInfo={courseInfo}
            />
          }
        </Content>
      </Layout>
    );
  }
}
