import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {enquireIsMobile} from '@/utils/enquireScreen';
import {Form, Layout, Button, Icon, Input, Spin} from 'antd';
import './index.less';

const {Content} = Layout;
const FormItem = Form.Item;

@connect(({login, loading}) => ({
  login,
  loading: loading.models.login
}))
class Login extends Component {
  state = {
    isMobile: false
  }

  componentDidMount() {
    this.judgeIsMobile();
  }

  //判断是否是手机
  judgeIsMobile = () => {
    this.unregisterEnquire = enquireIsMobile(ismobile => {
      const {isMobile} = this.state;
      if (isMobile !== ismobile) {
        this.setState({
          isMobile: ismobile
        });
      }
    });
  }

  handleSubmit = e => {
    const {form, dispatch} = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/login',
          payload: values
        });
      }
    });
  };

  render() {
    const {isMobile} = this.state;
    const {loading, form} = this.props;
    const {getFieldDecorator} = form;

    return (
      <Layout className="full-layout login-page">
        <Content>
          <Spin tip="登录中..." spinning={!!loading}>
            <Form onSubmit={this.handleSubmit} className={isMobile? "login-form" : "login-form login-form___desktop"}>
              <div className="user-img">
                <b>交互式教学</b>
                <span>服务平台</span>
              </div>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{required: true, message: '请输入您的用户名'}]
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user"/>}
                    placeholder="学/工号"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: '请输入您的密码'}]
                })(
                  /*<Input.Password size="large" placeholder="密码"/> */
                  <Input
                    size="large"
                    prefix={<Icon type="lock"/>}
                    placeholder="密码"
                    type="password"
                  />
                )}
              </FormItem>
              <FormItem>
                {/*{getFieldDecorator('remember', {*/}
                {/*valuePropName: 'checked',*/}
                {/*initialValue: true*/}
                {/*})(<Checkbox>记住我</Checkbox>)}*/}
                {/*<Link className="login-form-forgot" to="#">*/}
                {/*忘记密码*/}
                {/*</Link>*/}
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
              </FormItem>
            </Form>
          </Spin>
        </Content>
      </Layout>
    );
  }
}

export default Form.create()(Login);
