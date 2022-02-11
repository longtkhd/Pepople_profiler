/**
 *
 * AdminJobDetail
 *
 */

import React, { memo, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Row, Col, Button, Descriptions } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';
import './styles.less'

function AdminJobDetail(props) {
  const {
    data, title
  } = props;


  return (
    <div className="job-admin-details-container">
      <FormInfoDetail
        title={title}
        actions={
          <Row flex="flex" justify="center" align="middle">
          </Row>
        }
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label={<FormattedMessage {...messages.closeJob} />}>{data?.close_job}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.openJob} />}>{data?.open_job}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.CvParsing} />}>{data?.cv_parsing}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.totalReport} />}>{data?.total_candidate_report}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.totalAssess} />}>{data?.totalAssessmentReport}</Descriptions.Item>
        </Descriptions>
      </FormInfoDetail>
    </div>
  );
}

AdminJobDetail.propTypes = {};

export default memo(AdminJobDetail);
