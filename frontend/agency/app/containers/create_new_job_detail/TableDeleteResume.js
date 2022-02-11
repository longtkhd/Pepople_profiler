import React, { memo } from 'react';
import { Table, Space } from 'antd';
import ActionType from 'components/TableCustom/ActionType';


const TableDeleteResume = (props) => {
  const { deleteResume } = props;
  // console.log(props);
  const columns = [
    {
      title: 'Candidate name',
      dataIndex: 'name',
      key: 'name',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <span onClick={() => deleteResume(record.id) }>
            <ActionType type="delete" />
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div className="table-simple-ui last-cell-right scrolled-y">
      <Table {...props} columns={columns} dataSource={props.data} rowKey={ row => row.id } />
    </div>
  )
};

export default memo(TableDeleteResume);
