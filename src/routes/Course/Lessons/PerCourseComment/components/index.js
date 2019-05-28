import React from 'react';
import {connect} from 'dva';
import {Layout, Icon, Menu, message, Comment, Avatar, List, Divider, Form, Input, Button} from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils'
import './index.less'
import {enquireIsMobile} from '@/utils/enquireScreen';

const {Header, Content, Footer, Sider} = Layout;
const TextArea = Input.TextArea
//定义发布主题的UI
const Editor = ({
                  onChange, onSubmit, submitting, value,
                }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value}/>
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
        style={{float: 'right'}}
      >
        添加留言
      </Button>
    </Form.Item>
  </div>
)

@connect()  //dva connect
export default class PerComment extends BaseComponent {
  state = {
    commentInfo: [],
    visible: false,
    submitting: false,
    value: '',
    isMobile: false
  }

  componentDidMount = () => {
    this.judgeIsMobile()
    this.getComment()
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

  //获取指定课程评论
  getComment() {
    $$.get(`http://59.67.107.169:8010/api/topic/queryByPerCourseId/${$$.getStore('perCourseId')}`)
      .then(resp =>
        this.setState({
          commentInfo: resp.data
        })).catch(e => console.log(e))
  }

  //返回课程详情页
  goBack = () => {
    this.history.replace('/column/intro')
  }

  //新建课程评论
  addTopic = () => {
    let data = {
      topicPercourseId: $$.getStore('perCourseId'),
      topicContent: this.state.value
    }
    $$.post(`http://59.67.107.169:8010/api/topic/publicTopic`, data).then(
      resp => {
        if (resp.icon === 'success') {
          message.success(resp.message)
        } else {
          message.error(resp.message)
        }
      }
    )
  }

  //按钮点击回调
  handleClick = () => {
    this.setState({visible: true})
  }
  //关闭回复
  closeComment = () => {
    this.setState({visible: false})
  }
  //提交评论
  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }
    this.setState({
      submitting: true,
    });

    //更新回复内容
    this.addTopic()

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: ''
      })

      this.getComment()
      //关闭评论编辑框
      this.closeComment(this)
    }, 1000);
  }

  //提交修改
  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const {commentInfo, submitting, value, visible, isMobile} = this.state

    return (
      <Layout className="full-layout per-comment-page">
        <Header style={{color: 'black'}}>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{lineHeight: '64px'}}
          >
            <Menu.Item>
              <div onClick={this.goBack}>
                <Icon type="arrow-left"
                      style={isMobile ? {color: 'white', fontSize: '25px', } :{color: 'white', fontSize: '25px', marginLeft: '50px', marginTop: '10px'}}/>
                返回课程主页
              </div>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{padding: '20px 50px'}}>
          <div>
            {commentInfo === null ? <div style={{marginLeft: '20px'}}>暂时没有评论</div> :
              <List
                itemLayout='horizontal'
                dataSource={commentInfo}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar
                        src={item.userImg}/>}
                      title={
                        <a href="javascript:;" onClick={_ => {
                          $$.setStore('topicId', item.topicId)
                          $$.setStore('beforeUrl', '/column/per/comment')
                          this.history.push('/column/per/community/intro')
                        }}>
                          {item.topicContent}
                        </a>
                      }
                      description={item.topicCreatedTime}
                    />
                  </List.Item>
                )}
              />
            }
            {visible &&
            <Comment
              avatar={(
                <Avatar
                  src="http://localhost:8010/file/icon1.jpeg"
                  alt="Shang Yuxiu"
                />
              )}
              content={(
                <Editor
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              )}
            />
            }
            <Button type="primary" icon='plus' style={{marginTop: '40px'}} onClick={this.handleClick}>
              发布课程留言
            </Button>
          </div>
        </Content>
        <Footer style={{textAlign: 'center'}}></Footer>
      </Layout>
    );
  }
}
