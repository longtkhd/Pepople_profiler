/**
 *
 * TableCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import SectionWrapper from 'components/SectionWrapper';
import { Table, Row, Col, Spin, Pagination, Button, Input } from 'antd';
import './styles.less';

import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  SearchOutlined,
} from '@ant-design/icons';

function TableCustom(props) {
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
            <span className="round" onClick={handleFirst}>
              <DoubleLeftOutlined />
            </span>
          </div>

          <Pagination
            {...props?.paginateOptions}
            // onShowSizeChange={props.onShowSizeChange}
          />

          <div className="next-paginate">
            <span
              // style={{ border: 'none' }}
              className="round"
              onClick={handleLast}
            >
              <DoubleRightOutlined />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

TableCustom.propTypes = {};

export default memo(TableCustom);
