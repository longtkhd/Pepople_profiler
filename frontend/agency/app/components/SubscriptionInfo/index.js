/**
 *
 * SubscriptionInfo
 *
 */

import { Col, Row } from 'antd';
import React, { memo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import AlertIcon from 'images/group-6.svg';

import './styles.less';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';

function SubscriptionInfo({ subInfo }) {
  const trialDate = subInfo
    ? moment(subInfo.expire_trial_date)
        .add(1, 'days')
        .diff(new moment(), 'days')
    : undefined;

  return (
    <div>
      {!subInfo && (
        <Row className="sub-info__subscription sub-info__found">
          <div className="sub-info__alert">
            <span className="sub-info__alert-text">
              You haven't subscribed to a plan yet
            </span>
            <img
              src={AlertIcon}
              alt={'Subscription Alert'}
              className="sub-info__alert-icon"
            />
          </div>
          <Link className="sub-info__btn-sub" to="/plans">
            Subscribe
          </Link>
        </Row>
      )}
      {subInfo && (
        <>
          <Row align="middle" className="sub-info">
            <Col className="sub-info__col">
              <span className="sub-info__label">Plan Level</span>
              <span className="sub-info__text">
                {subInfo.package_id?.package_name}
              </span>
            </Col>
            <Col className="sub-info__col">
              <span className="sub-info__label">Maximum Accounts</span>
              <span className="sub-info__text">
                {subInfo.package_id?.max_recruiter}
              </span>
            </Col>
            <Col className="sub-info__col">
              <span className="sub-info__label">Maximum CV Parsing</span>
              <span className="sub-info__text">
                {subInfo.package_id?.max_cv_parsing}
              </span>
            </Col>
            <Col className="sub-info__col">
              <span className="sub-info__label">Maximum Assessments Limit</span>
              <span className="sub-info__text">
                {subInfo.package_id?.max_assessment_limit}
              </span>
            </Col>
            <Col className="sub-info__col">
              <span className="sub-info__label">Next Payment Date</span>
              <span className="sub-info__text">
                {subInfo.next_payment_date &&
                  moment(subInfo.next_payment_date).format('DD MMM YYYY')}
              </span>
            </Col>
            <Col className="sub-info__col">
              <span className="sub-info__label">Payment Amount</span>
              <span className="sub-info__text">
                {subInfo?.price_before_tax && (
                  <NumberFormat
                    placeholder=""
                    prefix="AUD $"
                    suffix=" + GST"
                    thousandSeparator={true}
                    displayType={'text'}
                    value={subInfo?.price_before_tax}
                  />
                )}
              </span>
            </Col>
          </Row>
          {subInfo.expire_trial_date && trialDate > 0 && (
            <Row align="stretch" className="sub-info__subscription">
              <div className="sub-info__alert">
                <div className="sub-info__alert-text">
                  <span className="alert__trial-day">
                    You are in the free trial period.
                    <span>{trialDate} days remaining.</span>
                  </span>
                  <span className="alert__trial-description">
                    Your credit card will not be charged until your free trial
                    expires on
                    <span>
                      {subInfo.expire_trial_date &&
                        moment(subInfo.expire_trial_date).format('DD MMM YYYY')}
                    </span>
                  </span>
                </div>
                <img
                  src={AlertIcon}
                  alt={'Subscription Alert'}
                  className="sub-info__alert-icon"
                />
              </div>
            </Row>
          )}
        </>
      )}
    </div>
  );
}

SubscriptionInfo.propTypes = {
  subInfo: PropTypes.object,
};

export default memo(SubscriptionInfo);
