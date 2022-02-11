import React, { memo } from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from 'components/SectionWrapper';
import Status from 'components/Status/loadable';
import TableCustom from 'components/TableCustom/loadable';

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const TableComponent = ({ title }) => {
  return (
    <SectionWrapper heading={title}>
      <TableCustom data={data} />
    </SectionWrapper>
  );
};

export default memo(TableComponent);
