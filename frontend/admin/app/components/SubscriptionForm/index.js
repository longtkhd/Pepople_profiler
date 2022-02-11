/**
 *
 * SubscriptionForm
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Button, Radio } from 'antd';

import SubscriptionPlan from 'components/SubscriptionPlan';
import HighlightText from 'components/atoms/HighlightText';
import SpinnerLoading from 'components/SpinnerLoading';

import getListPackageAction from 'containers/common_provider/get_package/actions';
import {
  makeSelectGetPackageLoading,
  makeSelectGetPackageSuccess,
  makeSelectGetPackageError,
} from 'containers/common_provider/get_package/selectors';

import updateSubscriptionPlanAction from 'containers/common_provider/update_subscription/actions';
import {
  makeSelectUpdateSubscriptionError,
  makeSelectUpdateSubscriptionResponse,
} from 'containers/common_provider/update_subscription/selectors';

import getAgencyInfoAction from 'containers/common_provider/get_agency_info/actions';
import {
  makeSelectAgencyInfo,
  makeSelectGetAgencyInfoLoading,
} from 'containers/common_provider/get_agency_info/selectors';

import { getUserInfo } from 'services/authentication';
import { openNotification } from 'utils/notification';

import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';
import globalMessages from 'messages';

function SubscriptionForm(props) {
  const {
    displayChargeText,
    showSubscribe,
    onSubscribePlanDone,
    getListPackage,
    listPackageResponse,
    listPackageLoading,
    getAgencyInfo,
    agencyInfoResponse,
    agencyInfoLoading,
    listPackageError,
    onUpdateSubscriptionPlan,
    updateSubPlanError,
    updateSubPlanResponse,
  } = props;

  const lastBillingType = localStorage.getItem('billingType')
    ? parseInt(localStorage.getItem('billingType'))
    : 0;
  const [user, setUser] = useState({});
  const [billingType, setBillingType] = useState(lastBillingType);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [subscriptionPlans, setsubscriptionPlans] = useState([]);
  const [suggestName, setSuggestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const billingOptions = [
    { label: <FormattedMessage {...messages.monthly} />, value: 0 },
    { label: <FormattedMessage {...messages.yearly} />, value: 1 },
  ];

  const getPlanPrice = () => {
    const plan = subscriptionPlans.find(plan => plan.id == selectedPlanId);
    return plan?.price;
  };

  const hanldeSuggestSubscriptionPlan = (agencySize, subscriptionPlans) => {
    const suggestPlan = subscriptionPlans.find(
      plan => plan.package_size === parseInt(agencySize),
    );
    if (suggestPlan) {
      setSelectedPlanId(suggestPlan.id);
      setSuggestName(suggestPlan.package_name);
    }
  };

  const getTotalPrice = () => {
    const planPrice = getPlanPrice();
    let total = 0;
    if (planPrice) {
      if (billingType == 0) {
        total = planPrice;
      } else {
        total = planPrice * 12;
      }
    }
    return total;
  };

  const onSelectPlan = planId => {
    setSelectedPlanId(planId);
  };

  const onChangeBillingType = e => {
    setBillingType(e.target.value);
    localStorage.setItem('billingType', e.target.value);
  };

  const onClickSubscribePlan = () => {
    const updateData = {
      billing_type: billingType,
      package_id: selectedPlanId,
    };

    if (!user) {
      openNotification('error', 'UserNot Found!');
      return;
    }
    onUpdateSubscriptionPlan(user.agency_id, updateData);
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      const agencyId = userInfo.agency_id;
      if (agencyId) {
        getListPackage(agencyId);
        getAgencyInfo(agencyId);
      }
    }
  }, []);

  useEffect(() => {
    if (listPackageResponse) {
      const list = listPackageResponse.list || [];
      setsubscriptionPlans(
        list.map(p => {
          p.key = p.id;
          return p;
        }),
      );
    }
  }, [listPackageResponse]);

  useEffect(() => {
    const agencySize = agencyInfoResponse?.company_info?.agency_size;
    if (agencySize && subscriptionPlans) {
      hanldeSuggestSubscriptionPlan(agencySize, subscriptionPlans);
    }
  }, [agencyInfoResponse, subscriptionPlans]);

  useEffect(() => {
    if (updateSubPlanResponse) {
      if (onSubscribePlanDone) {
        onSubscribePlanDone(true);
      }
    }
  }, [updateSubPlanResponse]);

  useEffect(() => {
    const error = listPackageError || updateSubPlanError;
    if (error) {
      openNotification(
        'error',
        error?.message || 'LOADING SUBSCRIPTION ERROR!',
      );
    }
  }, [listPackageError, updateSubPlanError]);

  useEffect(() => {
    const loading = listPackageLoading || agencyInfoLoading;
    setIsLoading(loading);
  }, [listPackageLoading, agencyInfoLoading]);

  return (
    <>
      {isLoading && <SpinnerLoading loading={isLoading} />}
      {!isLoading && (
        <div className="subscription-form-container">
          <div className="header">
            <div className="title text-center">
              <div>
                <FormattedMessage {...messages.title} />
              </div>
              <HighlightText>
                <FormattedMessage
                  {...messages.recommend}
                  values={{ planName: suggestName }}
                />
              </HighlightText>
            </div>
            {displayChargeText ? (
              <div className="charged-text text-center">
                <FormattedMessage {...messages.notice} />
              </div>
            ) : null}
          </div>
          <div className="plan-list">
            {subscriptionPlans.map(plan => {
              const { id, package_name, description, price, color } = plan;
              return (
                <div
                  className={`plan-item ${
                    selectedPlanId == id ? 'plan-item-selected' : ''
                  }`}
                  key={id}
                >
                  <SubscriptionPlan
                    id={id}
                    name={package_name}
                    description={description}
                    price={price}
                    onSelectPlan={onSelectPlan}
                    color={color}
                  />
                </div>
              );
            })}
          </div>
          <div className="billing-type">
            <span className="billing-text">
              <FormattedMessage {...messages.selectBillingType} />
            </span>
            <Radio.Group
              options={billingOptions}
              value={billingType}
              onChange={onChangeBillingType}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div className="footer text-center">
            <div className="total">
              <span className="total-text">
                <FormattedMessage {...messages.total} />
              </span>
              &nbsp;
              <span className="total-amount bold-text">{`AU$${getTotalPrice()} + GST per ${
                billingType == 0 ? 'month' : 'year'
              }`}</span>
            </div>
            <div className="subscribe-button">
              <Button
                type="primary"
                disabled={selectedPlanId ? false : true}
                onClick={onClickSubscribePlan}
              >
                {showSubscribe ? (
                  <FormattedMessage {...messages.subscribe} />
                ) : (
                  <FormattedMessage {...globalMessages.next} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

SubscriptionForm.propTypes = {
  displayChargeText: PropTypes.bool.isRequired,
  onSubscribePlanDone: PropTypes.func,
  listPackageResponse: PropTypes.object,
  listPackageError: PropTypes.object,
  updateSubPlanError: PropTypes.object,
  updateSubPlanResponse: PropTypes.object,
  getListPackage: PropTypes.func,
  getAgencyInfo: PropTypes.func,
  onUpdateSubscriptionPlan: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  listPackageLoading: makeSelectGetPackageLoading(),
  listPackageResponse: makeSelectGetPackageSuccess(),
  listPackageError: makeSelectGetPackageError(),
  updateSubPlanResponse: makeSelectUpdateSubscriptionResponse(),
  updateSubPlanError: makeSelectUpdateSubscriptionError(),
  agencyInfoResponse: makeSelectAgencyInfo(),
  agencyInfoLoading: makeSelectGetAgencyInfoLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    getListPackage: agencyId => dispatch(getListPackageAction(agencyId)),
    getAgencyInfo: agencyId => dispatch(getAgencyInfoAction(agencyId)),
    onUpdateSubscriptionPlan: (agencyId, data) =>
      dispatch(updateSubscriptionPlanAction(agencyId, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SubscriptionForm);
