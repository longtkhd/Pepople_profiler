/**
 *
 * AgencyDetails
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col, Descriptions } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';
import { EyeOutlined } from '@ant-design/icons';
import Button from 'components/atoms/Button'


import messages from './messages';
import './styles.less'

function SubscriptionInfoAdmin(props) {
  const {
    data,
    history
  } = props;
  const planLevel = data?.subscription_plan_name;
  const billingType = data?.subscription_plan?.billing_type;
  const totalCvParsingByMonth = data?.totalCvParsingByMonth;
  const totalCvParsingByYear = data?.totalCvParsingByYear;
  const totalAssessmentReportByMonth = data?.totalAssessmentReportByMonth;
  const totalAssessmentReportByYear = data?.totalAssessmentReportByYear;
  const closeJob = data?.created_by?.close_job;
  const openJob = data?.created_by?.open_job;

  const [statusBilling, setStatusBilling] = useState(null);

  useEffect(() => {
    if (billingType == 0) {
      setStatusBilling('Monthly')

    } else if (billingType == 1) {
      setStatusBilling('Yearly')
    } else {
      setStatusBilling('-')
    }
  }, [billingType])



  return (
    <div className="subscription-details-container">
      <FormInfoDetail
        title={<FormattedMessage {...messages.title} />}
        actions={
          <Row flex="flex" justify="center" align="middle">
            <Col>
              <Link to={`/job-list`}>
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                >
                  <FormattedMessage {...messages.view} />
                </Button>
              </Link>
            </Col>
          </Row>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label={<FormattedMessage {...messages.openJob} />}>{openJob}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.closeJob} />}>{closeJob}</Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.cvParsing} />}>
            <Row justify='start' style={{ width: '100%' }}>
              <Col lg={6}>{'This month: '}{totalCvParsingByMonth} </Col>
              <Col lg={6}>{'This year: '}{totalCvParsingByYear}</Col>
            </Row>


          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage {...messages.talentAssessment} />}>
            <Row justify="start" style={{ width: '100%' }}>
              <Col lg={6}> {'This month: '}{totalAssessmentReportByMonth} </Col>
              <Col lg={6} >{'This year: '}{totalAssessmentReportByYear}</Col>
            </Row>


          </Descriptions.Item>

        </Descriptions>
        {/* <Row justify='center'>
          <Button
            className='btn-default-outline'
            onClick={() => history.push(`/payment-history/${data?.id}`)}
          >
            Payment History
            </Button>
        </Row> */}

      </FormInfoDetail>
    </div>
  );
}

SubscriptionInfoAdmin.propTypes = {};

export default memo(SubscriptionInfoAdmin);
