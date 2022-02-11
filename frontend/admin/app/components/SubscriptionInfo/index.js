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

function SubscriptionInfo({ subInfo }) {
  const trialDate = subInfo
    ? moment(subInfo.expire_trial_date)
      .add(1, 'days')
      .diff(new moment(), 'days')
    : undefined;

  return (
    <div>
      {!subInfo && (
        <Row align="middle" className="sub-info__subscription">
          <div className="sub-info__alert">
            <span className="sub-info__alert-text">
              Agency hasn't subscribed to a plan yet
            </span>
            <img
              src={AlertIcon}
              alt={'Subscription Alert'}
              className="sub-info__alert-icon"
            />
          </div>
          {/* <Link className="sub-info__btn-sub" to='/plans'>
            Subscribe
          </Link> */}
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
                {subInfo.expire_date &&
                  moment(subInfo.expire_date).format('DD MMM YYYY')}
              </span>
            </Col>
            <Col className="sub-info__col">
              <span className="sub-info__label">Payment Amount</span>
              <span className="sub-info__text">
                AU$2,275  + GST
              </span>
            </Col>
          </Row>
          {trialDate !== 0 && (
            <Row align="stretch" className="sub-info__subscription">
              <div className="sub-info__alert">
                <div className="sub-info__alert-text">
                  <span className="alert__trial-day">
                    This Agency is in the free trial period.
                    <span>{trialDate} days remaining.</span>
                  </span>
                  <span className="alert__trial-description">
                    Credit card will not be charged until free trial
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
