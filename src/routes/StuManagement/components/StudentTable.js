import React from 'react';
import DataTable from 'components/DataTable';
import {Popconfirm, Tag} from 'antd';
import BaseComponent from "components/BaseComponent";

export default class StudentTable extends BaseComponent {
    render() {
        const {onCancel, loading, rowKey, dataItem, alternateColor, hadleChange} = this.props;
        const columns = [
            {
                title: '学号',
                name: 'userId',
                tableItem: {}
            },
            {
                title: '学院',
                name: 'userAcademy',
                tableItem: {}
            },
            {
                title: '专业',
                name: 'userMajor',
                tableItem: {}
            },
            {
                title: '班级',
                name: 'userClass',
                tableItem: {}
            },
            {
                title: '姓名',
                name: 'userName',
                tableItem: {}
            },
            {
                title: '性别',
                name: 'userGender',
                tableItem: {}
            },
            {
                title: '电话',
                name: 'userPhone',
                tableItem: {}
            },
            {
                title: '备注',
                name: 'userRemarks',
                tableItem: {}
            },
            {
                title: '操作',
                name: 'opera',
                tableItem: {
                    render: (text, record) => (
                        <DataTable.Oper>
                            <Tag color="#87d068" onClick={() => hadleChange(record.userId)}>
                                修改
                            </Tag>

                            <Popconfirm title="你确定要删除吗" onConfirm={() => onCancel(record.userId)}>
                                <Tag color="#f50">删除</Tag>
                            </Popconfirm>
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
                pagination={{pageSize: 20}}/>
        )
    }
}
