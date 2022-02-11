import React, { memo } from 'react';
import { Table, Space } from 'antd';
import ActionType from 'components/TableCustom/ActionType';


const PreviewFileUpLoad = (props) => {
  const { deleteCandidatePreview } = props;
  // console.log(props);
  const columns = [
    {
      title: 'Resume name',
      dataIndex: 'name',
      key: 'name',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record) => {
        // console.log('re>',record);
        return (
          <Space size="middle">
            <span onClick={() => deleteCandidatePreview(record.uid) }>
              <ActionType type="delete" />
            </span>
          </Space>
        )
      },
    },
  ];

  return (
    <div className="table-simple-ui last-cell-right scrolled-y">
      <Table {...props} columns={columns} dataSource={props.data} rowKey={ row => row.uid } />
    </div>
  )
};

export default memo(PreviewFileUpLoad);
