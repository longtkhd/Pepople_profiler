/**
 *
 * SubscriptionPlan
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function SubscriptionPlan(props) {
  const {  id, name, description, price, color, maxAssessment, maxCV, onSelectPlan, onGetStarted } = props;

  const onClick = () => {
    onSelectPlan(id);
  }

  const handleStarted = (e) => {
    e.stopPropagation();
    onGetStarted(id);
  }

  return (
    <div className="subscription-plan-container text-center" onClick={onClick}>
      <div className="plan-name" style={{ color: color }}>{name}</div>
      <div className="plan-description plan-detail">{description}</div>
      <div className="plan-description">
        <p>Up to {maxCV} candidate reports / user / month</p>

        <p>
          Up to {maxCV} resumes parsed
        (auto formatted) / user / month
        </p>

        <p>{maxAssessment ? `Up to ${maxAssessment} candidate talent assessments / user / month` : `No access to talent assessments`}</p>
      </div>
      <div className="plan-price">{`AUD $${price} per user/mth`}</div>
      <div className="plan-button">
        <Button style={{ backgroundColor: color }} onClick={(e) => {
          handleStarted(e)
        }}>
          <FormattedMessage {...messages.getStarted} />
        </Button>
      </div>
    </div>
  )
}

SubscriptionPlan.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  color: PropTypes.string,
  onSelectPlan: PropTypes.func,
};

export default memo(SubscriptionPlan);
