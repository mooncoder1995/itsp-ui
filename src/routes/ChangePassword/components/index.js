import React from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Layout, message} from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils';
import Panel from "../../../components/Panel";
import './index.less';

const {Content} = Layout;

@connect(({ changePassword, loading }) => ({
  changePassword,
  loading: loading.models.changePassword
}))  //dva connect
class changePassword extends BaseComponent {

  state = {
    confirmDirty: false
  };

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values.password);
        dispatch({
          type: 'changePassword/@request',
          afterResponse: resp => {
            if(resp.code === 201) {
              message.success("密码修改成功！")
            } else {message.error(resp.message)}
          },
          payload: {
            method: 'PUT',
            url: 'http://59.67.107.169:8010/api/user/user',
            data: {
              "userPassword": values.password,
              "userId": $$.getStore("user").userId
            }
          },
          success: () => {
            $$.removeStore('user');
            this.history.push('/sign/login');
          }

        })
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码输入不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    // const tailFormItemLayout = {
    //   align: center
    //   // wrapperCol: {
    //   //   xs: {
    //   //     span: 0,
    //   //     offset: 10,
    //   //   },
    //   //   sm: {
    //   //     span: 16,
    //   //     offset: 8,
    //   //   },
    //   // },
    // };

    return (
      <Layout className="full-layout page changePassword-page">
        <Content>
          <Panel>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item label="请输入新密码:">
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请输入您的密码!',
                  }, {
                    validator: this.validateToNextPassword,
                  }],
                })(
                  <Input type="password"/>
                )}
              </Form.Item>
              <Form.Item label="请确认输入修改的密码:">
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: '请确认输入修改的密码!',
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur}/>
                )}
              </Form.Item>
              <Form.Item >
                <Button type="primary" htmlType="submit">修改</Button>
              </Form.Item>
            </Form>
          </Panel>
        </Content>
      </Layout>
    );
  }
}

export default Form.create()(changePassword);
