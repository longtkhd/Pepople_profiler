/**
 *
 * TableCustom
 *
 */

import React, { memo, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import SectionWrapper from 'components/SectionWrapper';
import { Table, Row, Col, Spin, Pagination, Button, Input } from 'antd';
import './styles.less';

import { DoubleRightOutlined, DoubleLeftOutlined, SearchOutlined } from '@ant-design/icons';

function TableCustom(props) {
  const [searchResults, setSearchResults] = useState(null);

  const { isShowJump } = props;
  const tableLoading = {
    spinning: props?.loading ? props?.loading : false,
    indicator: <Spin className={`icon-color`} />,
  };

  const handleLast = () => {
    if (isShowJump) props.setCurrentCustom();
    else return () => {};
  };
  const handleFirst = () => {
    if (isShowJump) props.setCurrentFirst();
    else return () => {};
  };

  return (
    <div className="table-simple-ui">
      {props.searchBox && (
        <Row>
          <Col span={8}>
            <Input.Search
              enterButton={<SearchOutlined />}
              className={`input-search-custom`}
              allowClear
              onSearch={props.handleSearchBox}
            />
          </Col>
          <Col />
        </Row>
      )}
      <Table {...props} loading={tableLoading} />
      {props.paginate && (
        <div
          className={`pagination-simple-ui ${
            props.paginateStyle ? props.paginateStyle : null
          }`}
        >
          <div className="prev-paginate ">
            <Button className="round" onClick={handleFirst}>
              <DoubleLeftOutlined />
            </Button>
          </div>
          <Pagination {...props.paginateOptions} />
          <div className="next-paginate">
            <Button
              // style={{ border: 'none' }}
              className="round"
              onClick={handleLast}
            >
              <DoubleRightOutlined />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

TableCustom.propTypes = {};

export default memo(TableCustom);
