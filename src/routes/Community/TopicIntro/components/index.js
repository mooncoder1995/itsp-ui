import React from 'react';
import {connect} from 'dva';
import {Avatar, Form, Comment, Icon, Layout, List, Menu, Button, Input, message} from 'antd';
import BaseComponent from 'components/BaseComponent'
import {enquireIsMobile} from '@/utils/enquireScreen';
import $$ from 'cmn-utils'

const {Header, Content} = Layout;
const TextArea = Input.TextArea

//定义添加回复UI
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

@connect(({topicIntro, loading}) => ({
  topicIntro,
  loading: loading.models.topicIntro
}))
export default class TopicIntro extends BaseComponent {

  state = {
    visible: false,
    comments: [],
    submitting: false,
    value: '',
    isMobile: false
  }

  componentDidMount = () => {
    this.getOneComment()
    this.judgeIsMobile()
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

  //获取指定的评论信息
  getOneComment = () => {
    this.props.dispatch({
      type: 'topicIntro/@request',
      afterResponse: resp => resp.data,
      payload: {
        valueField: 'topicDetail',
        method: 'GET',
        url: `http://59.67.107.169:8010/api/topic/queryTopic/${$$.getStore('topicId')}`
      }
    })
  }

  //添加回复内容
  addComment = () => {
    this.props.dispatch({
      type: 'topicIntro/@request',
      afterResponse: resp => {
        if (resp.icon === 'success') {
          message.success(resp.message)
        } else {
          message.erro(resp.message)
        }
      },
      payload: {
        method: 'POST',
        url: `http://59.67.107.169:8010/api/reply/publicReply`,
        data: {
          replyTopicId: $$.getStore('topicId'),
          replyUserId: $$.getStore('user').userId,
          replyContent: this.state.value
        }
      }
    })
  }

  //返回
  goBack = () => {
    this.history.push($$.getStore('beforeUrl'))
  }
  //回复评论
  replyComment = () => {
    this.setState({
      visible: true
    })
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
    this.addComment()

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: ''
      })
      this.getOneComment()
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
    const {visible, comments, submitting, value, isMobile} = this.state
    const {topicDetail} = this.props.topicIntro
    return (
      <Layout className="full-layout topic-intro-page">
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
                返回评论主页
              </div>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{padding: '20px 50px'}}>
          <Comment
            className="comment-topic"
            actions={[<div onClick={this.replyComment}>回复</div>]}
            author={topicDetail.topicUserId}
            avatar={(
              <Avatar
                src={topicDetail.userImg}
              />)}
            content={topicDetail.topicContent}
            datetime={topicDetail.topicCreatedTime}
          >
            <div>
              <List
                dataSource={topicDetail.replyList}
                itemLayout="horizontal"
                className="comment-list"
                renderItem={item => (
                  <Comment
                    // actions={[<div onClick={this.openComment}>回复</div>]}
                    author={item.replyUserId}
                    avatar={(
                      <Avatar
                        src={$$.getStore('user').userImg}
                      />)}
                    content={item.replyContent}
                    datetime={item.replyCreatedTime}
                    style={{borderBottom: '1px solid #e2e2e2'}}
                  />
                )}
              />
              {visible &&
                <Comment
                  avatar={(
                    <Avatar
                      src={$$.getStore('user').userImg}
                      alt={$$.getStore('user').userName}
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
            </div>
          </Comment>
        </Content>
      </Layout>
    );
  }
}
