/**
 *
 * RecruiterJobDetails
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Descriptions } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';
import { EyeOutlined } from '@ant-design/icons';
import './styles.less';
import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

function RecruiterJobDetails(props) {
  const {
    data
  } = props;

  return (
    <div className="recruiter-job-details-container">
      <FormInfoDetail
        title={<FormattedMessage {...messages.title} />}
        actions={
          <Row flex="flex" justify="center" align="middle">
            <Col>
              <Link to={`/recruiter-jobs/${data.id}`}>
                <Button
                  type="default"
                  className="btn-view"
                  icon={<EyeOutlined />}
                >
                  <FormattedMessage {...globalMessages.view} />
                </Button>
              </Link>
            </Col>
          </Row>
        }
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label={<FormattedMessage {...messages.closedJobs} />}>{data?.close_job}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.openJobs} />}>{data?.open_job}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.cvParsingUsed} />}>{data?.totalCvParsing}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.assesmentUsage} />}>{data?.totalAssessmentReport}</Descriptions.Item>
          <Descriptions.Item prefixCls={' '} label={''}>&nbsp;&nbsp;&nbsp; </Descriptions.Item>
        </Descriptions>
      </FormInfoDetail>
    </div>
  );
}

RecruiterJobDetails.propTypes = {
  data: PropTypes.object.isRequired,
};

export default memo(RecruiterJobDetails);
