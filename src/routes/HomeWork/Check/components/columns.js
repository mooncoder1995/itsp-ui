import React from 'react';
import DataTable from 'components/DataTable';
import Icon from 'components/Icon';
import { Popconfirm} from 'antd';
import BaseComponent from "components/BaseComponent";

export default class HomeWorkTable extends BaseComponent{
    render() {
        const { onCancel, loading, rowKey, dataItem, alternateColor } = this.props;
        const columns = [
            {
                title: '学号',
                name: 'userId',
                tableItem: {}
            },
            {
                title: '专业',
                name: 'studentMajor',
                tableItem: {}
            },
            {
                title: '班级',
                name: 'studentClass',
                tableItem: {}
            },
            {
                title: '姓名',
                name: 'studentName',
                tableItem: {}
            },
            {
                title: '成绩',
                name: 'fileScore',
                tableItem: {}
            },
            {
                title: '评语',
                name: 'fileComment',
                tableItem: {}
            },
            {
                title: '作业',
                name: 'fileUrl',
                tableItem: {
                    render: (fileUrl,record) => (
                        <a href={fileUrl} target="pdf_show" text-decoration="none">
                            <Icon type="edit"/>{record.studentName}{fileUrl.substring(fileUrl.lastIndexOf('.'), fileUrl.length)}
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
                            <button>
                                <Popconfirm title="你确定要删除吗" onConfirm={() => onCancel(record.perCourseId, record.userId)}>
                                    <Icon type="trash" />
                                </Popconfirm>
                            </button>
                        </DataTable.Oper>
                    )
                }
            }
        ];

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
