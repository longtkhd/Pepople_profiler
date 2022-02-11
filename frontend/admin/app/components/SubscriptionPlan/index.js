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
  const { id, name, description, price, onSelectPlan, color } = props;

  const onClick = () => {
    onSelectPlan(id);
  }

  return (
    <div className="subscription-plan-container text-center" onClick={onClick}>
      <div className="plan-name" style={{ color: color }}>{name}</div>
      <div className="plan-description">{description}</div>
      <div className="plan-price">{`AU$${price} per user/mth`}</div>
      <div className="plan-button">
        <Button style={{ backgroundColor: color }}>
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
