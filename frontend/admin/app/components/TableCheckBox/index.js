/**
 *
 * TableCheckBox
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Table, Spin } from 'antd';
import './styles.less';

// rowSelection object indicates the need for row selection

function TableCheckBox(props) {
  // const [selectionType, setSelectionType] = useState('checkbox');
  const tableLoading = {
    spinning: props?.loading ? props?.loading : false,
    indicator: <Spin className={`icon-color`} />,
  }
  return (
    <div className="table-checkbox-custom">
      <Table
        {...props}
        loading={tableLoading}
      />
    </div>
  );
}

TableCheckBox.propTypes = {};

export default memo(TableCheckBox);
