import React from 'react'
import BaseComponent from 'components/BaseComponent'
import {Modal, Form, Input, Select} from 'antd'
const {Option} = Select

class StuInfo extends BaseComponent {

  render() {
    const {
      visible, onCancel, onCreate, form, title, text, map, courseInfo
    } = this.props;
    const {getFieldDecorator} = form;
    return (
      <Modal
        visible={visible}
        title={title}
        okText={text}
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="horizontal" >
          <Form.Item label="学号">
            {getFieldDecorator('userId', {
              rules: [{required: true, message: '请输入学号!'}],
            })(
              <Input/>
            )}
          </Form.Item>
          {map ?
          <div>
            <Form.Item label="学院">
              {getFieldDecorator('userAcademy', {
                rules: [{required: true, message: '请输入学院!'}],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="专业">
              {getFieldDecorator('userMajor', {
                rules: [{required: true, message: '请输入专业!'}],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="班级">
              {getFieldDecorator('userClass', {
                rules: [{required: true, message: '请输入班级!'}],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="姓名">
              {getFieldDecorator('userName', {
                rules: [{required: true, message: '请输入姓名!'}],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="性别">
              {getFieldDecorator('userGender', {
                rules: [{required: true, message: '请输入性别!'}],
              })(
                <Select>
                  <Option key="男">男</Option>
                  <Option key="女">女</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="电话">
              {getFieldDecorator('userPhone', {
                rules: [{required: false, message: '请输入电话!'}],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('userRemarks', {
                rules: [{required: false, message: '请输入备注!'}],
              })(
                <Input/>
              )}
            </Form.Item>
          </div>
            : <Form.Item label="课程名称">
              {getFieldDecorator('courseId', {
                rules: [{required: true, message: '请输入备注!'}],
              })(
                <Select>
                  {courseInfo.map(item =>
                    <Option key={item.courseId}>{item.courseName}</Option>
                  )}
                </Select>
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    )
  }
}

const InfoForm = Form.create()(StuInfo);
export default InfoForm;