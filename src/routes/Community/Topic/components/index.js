import React from 'react';
import { connect } from 'dva';
import { Layout, List, Avatar } from 'antd';
import BaseComponent from 'components/BaseComponent';
import $$ from 'cmn-utils'

const { Content } = Layout;

@connect(({topic, loading}) => ({
  topic,
  loading: loading.models.topic
}))
export default class Topic extends BaseComponent {
  componentDidMount = () => {
    this.getAllComments()
  }

  //获取所有评论
  getAllComments = () => {
    this.props.dispatch({
      type: 'topic/@request',
      afterResponse: resp => resp.data,
      payload: {
        valueField: 'topic',
        method: 'GET',
        url: 'http://59.67.107.169:8010/api/topic/queryAllTopic'
      }

    })
  }
  render() {
    const {topic} = this.props.topic
    return (
      <Layout className="full-layout page topic-page">
        <Content>
          <List
            itemLayout='horizontal'
            dataSource={topic}
            renderItem={item =>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.userImg}/>}
                  title={
                    <a href="javascript:;" onClick={_ => {
                      $$.setStore('topicId', item.topicId)
                      $$.setStore('beforeUrl', '/community')
                      this.history.push('/column/per/community/intro')
                    }}>
                      {item.topicContent}
                    </a>
                  }
                  description={item.topicCreatedTime}
                />
              </List.Item>
            }
          />
        </Content>
      </Layout>
    );
  }
}
