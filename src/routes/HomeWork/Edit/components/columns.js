import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { Button, Popconfirm } from 'antd';
import BaseComponent from "components/BaseComponent";

export default class Columns extends BaseComponent{
    render() {
        const { onCancel, loading, rowKey,dataItem, alternateColor } = this.props;

        const columns = [
            {
                title: '课程名称',
                name: 'courseName',
                tableItem: {}
            },
            {
                title: '课程日期',
                name: 'courseDate',
                tableItem: {}
            },
            {
                title: '课程时间',
                name: 'courseTime',
                tableItem: {

                }
            },
            {
                title: '课程地点',
                name: 'courseRoom',
                tableItem: {}
            },
            {
                title: '课程主题',
                name: 'courseTopic',
                tableItem: {
                    sorter: true
                }
            },
            {
                title: '作业',
                name: 'fileUrl',
                tableItem: {
                    render: (fileUrl,record) => (
                        <a href={fileUrl} target="_blank" text-decoration="none">
                            <Icon type="edit"/>{record.courseTopic}{fileUrl.substring(fileUrl.lastIndexOf('.'), fileUrl.length)}
                        </a>
                    )
                }
            },
            {
                title: '操作',
                name: 'opera',
                tableItem: {
                    render: (text, record) => (
                        <DataTable.Oper>
                            {/*<Button tooltip="修改">*/}
                            {/*<Icon type="edit" />*/}
                            {/*</Button>*/}
                            {/*<Button tooltip="删除" onClick={() => onCancel(record.perCourseId)}>*/}
                                {/*<Icon type="trash" />*/}
                            {/*</Button>*/}
                            <button>
                                <Popconfirm title="你确定要删除吗" onConfirm={() => onCancel(record.perCourseId)}>
                                    <Icon type="trash" />
                                </Popconfirm>
                            </button>
                        </DataTable.Oper>
                    )
                }
            }
        ]

        return (
            <DataTable
                loading={loading}
                columns={columns}
                alternateColor={alternateColor}
                rowKey={rowKey}
                dataItems={dataItem}
                pagination={{ pageSize: 20 }}  />
        )
    }
}
