/**
 *
 * AgencyDetails
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Descriptions } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';

// import FormInfoDetail from '../../../../admin/app/components/RecruiterContactInfo/node_modules/components/FormInfoDetail';
// import globalMessages from '../../../../admin/app/components/RecruiterContactInfo/node_modules/messages';
import messages from './messages';
import './styles.less'

function AccountAdminDetail(props) {

  const {
    data,
    title
  } = props;
  return (

    <div className="account-admin-details-container">
      <FormInfoDetail
        title={title}
        actions={
          <Row flex="flex" justify="center" align="middle">
            {/* <Col>
              <Link to={`/recruiter-jobs/${data.id}`}>
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                >
                  <FormattedMessage {...globalMessages.view} />
                </Button>
              </Link>
            </Col> */}
          </Row>
        }
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label={<FormattedMessage {...messages.firstName} />}>{data?.created_by?.first_name}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.lastName} />}>{data?.created_by?.last_name}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.jobTitle} />}>{data?.created_by?.job_title}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.contactNumber} />}>{data?.created_by?.phone_number}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.email} />}>{data?.created_by?.email}</Descriptions.Item>
        </Descriptions>
      </FormInfoDetail>
    </div>
  );
}

AccountAdminDetail.propTypes = {};

export default memo(AccountAdminDetail);
