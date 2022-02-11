/**
 *
 * SubscriptionForm
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import globalMessages from 'messages';

import { Button, Input, Modal } from 'antd';
import SubscriptionPlan from 'components/SubscriptionPlan';
import SpinnerLoading from 'components/SpinnerLoading';
import SubscriptionPlanConfrimModal from 'components/modals/SubscriptionPlanConfrimModal';
import DowngradeNotificationModel from 'components/modals/DowngradeNotificationModal';

import getListPackageAction from 'containers/common_provider/get_package/actions';
import updateSubscriptionPlanAction, {
  paymentUpdatePlanAction,
  resetState,
} from 'containers/common_provider/update_subscription/actions';
import getAgencyInfoAction from 'containers/common_provider/get_agency_info/actions';
import {
  makeSelectGetPackageLoading,
  makeSelectGetPackageSuccess,
  makeSelectGetPackageError,
} from 'containers/common_provider/get_package/selectors';

import {
  makeSelectUpdateSubscriptionError,
  makeSelectUpdateSubscriptionResponse,
  makeSelectPaymentUpdateSuccess,
  makeSelectPaymentUpdateError,
  makeSelectUpdateSubscriptionLoading,
} from 'containers/common_provider/update_subscription/selectors';
import {
  makeSelectAgencyInfo,
  makeSelectGetAgencyInfoLoading,
} from 'containers/common_provider/get_agency_info/selectors';

import { onChargesInviteAtion } from 'containers/common_provider/charges_invite_state/actions';

import {
  makeSelectChargesInviteLoading,
  makeSelectChargesInviteError,
  makeSelectChargesInviteSuccess,
} from 'containers/common_provider/charges_invite_state/selectors';

import { getUserInfo } from 'services/authentication';
import { openNotification } from 'utils/notification';
import {
  clearNumber,
  getTotalPrice,
  getTotalTax,
} from 'utils/formatInputHelper';
import './styles.less';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import NumberFormat from 'react-number-format';
import { ContentModal } from 'components/modals/ContentModal';

const settings = {
  centerMode: true,
  infinite: false,
  centerPadding: '60px',
  focusOnSelect: true,
  slidesToShow: 4,
  responsive: [
    {
      breakpoint: 1260,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 580,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 0.5,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '10px',
      },
    },
    {
      breakpoint: 280,
      settings: {
        slidesToShow: 0.5,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '10px',
      },
    },
  ],
};

function SubscriptionForm(props) {
  const {
    history,
    showSubscribe,
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
    updateSubPlanLoading,
    paymentSuccess,
    paymentError,
    paymentUpdatePlan,
    clearState,
    chargesInvite,
    chargesInviteError,
    chargesInviteLoading,
    chargesInviteAction,
  } = props;

  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);
  const { nav1, nav2 } = state;

  const userInfo = getUserInfo();

  const [billingType, setBillingType] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [subscriptionPlans, setsubscriptionPlans] = useState([]);
  const [numberRecruiter, setNumberRecruiter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAlertPlan, setIsShowAlertPlan] = useState(false);
  const [showDowngradeNotiModel, setShowDowngradeNotiModel] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const getPlanPrice = () => {
    const plan = subscriptionPlans.find(plan => plan.id == selectedPlanId);
    const price =
      numberRecruiter && plan ? plan.price * numberRecruiter : plan?.price;
    return price;
  };

  const getSelectedPlanName = () => {
    const plan = subscriptionPlans.find(plan => plan.id == selectedPlanId);
    return plan?.package_name;
  };

  const getPackageMaxRecruiter = () => {
    const plan = subscriptionPlans.find(plan => plan.id == selectedPlanId);
    return plan?.max_recruiter;
  };

  const handleChangeNumber = e => {
    let value = clearNumber(e.target.value);
    if (value === '0') value = '1';
    setNumberRecruiter(value);
    hanldeSuggestSubscriptionPlan(value, subscriptionPlans);
  };

  const hanldeSuggestSubscriptionPlan = (
    numberRecruiter,
    subscriptionPlans,
  ) => {
    let suggestPlan;
    for (let i = 1; i < subscriptionPlans.length; i++) {
      if (subscriptionPlans[0].max_recruiter >= numberRecruiter) {
        suggestPlan = subscriptionPlans[0];
        break;
      }
      if (
        numberRecruiter >= subscriptionPlans[i - 1].max_recruiter &&
        numberRecruiter <= subscriptionPlans[i].max_recruiter
      ) {
        suggestPlan = subscriptionPlans[i];
        break;
      }
    }
    if (suggestPlan) {
      setSelectedPlanId(suggestPlan.id);
    }
  };

  const getPriceTotal = () => {
    const planPrice = getPlanPrice();
    return getTotalPrice(planPrice, billingType);
  };

  const getTaxTotal = () => {
    const planPrice = getPlanPrice();
    return getTotalTax(planPrice, billingType);
  };

  const onSelectPlan = planId => {
    setSelectedPlanId(planId);
  };

  const onOk = () => {
    setIsShowAlertPlan(false);
    setIsStarted(false);
  };

  const handleRedirect = () => {
    setIsStarted(false);
    history.push('/subscription-info');
  };

  const onClickSubscribePlan = () => {
    const packageSize = getPackageMaxRecruiter();
    if (!numberRecruiter) return;
    if (packageSize < numberRecruiter) {
      setIsShowAlertPlan(true);
      return;
    }
    let recruiterCount = agencyInfoResponse?.recruiter_count;
    if (recruiterCount && recruiterCount > numberRecruiter) {
      setShowDowngradeNotiModel(true);
      return;
    }
    /* If user not change anything, redirect to subscription info page */
    if (
      agencyInfoResponse?.company_info?.agency_size === numberRecruiter &&
      agencyInfoResponse?.subscription_plan?.package_id?.id === selectedPlanId
    ) {
      handleRedirect();
      return;
    }
    updateSubscriptionPlan();
  };

  const handleGetStarted = id => {
    if (!numberRecruiter) return;
    setSelectedPlanId(id);
    setIsStarted(true);
  };

  const updateSubscriptionPlan = () => {
    const updateData = {
      billing_type: billingType,
      package_id: selectedPlanId,
      price:
        Math.round((getPriceTotal() + getTaxTotal() + Number.EPSILON) * 100) /
        100,
      price_before_tax: getPriceTotal(),
      agency_size: numberRecruiter,
    };
    onUpdateSubscriptionPlan(userInfo.agency_id, updateData);
  };

  const handleConfirmUpdatePayment = payload => {
    const message =
      payload?.chargesInfo?.status === 'Update' ? (
        <FormattedMessage
          {...messages.paymentUpdateContent}
          values={{
            ...payload?.chargesInfo,
          }}
        />
      ) : (
        <FormattedMessage
          {...messages.paymentUpgradeContent}
          values={{ ...payload?.chargesInfo }}
        />
      );
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={
            <FormattedMessage
              {...messages.paymentModalTitle}
              values={{ status: payload?.chargesInfo?.status }}
            />
          }
          message={message}
        />
      ),
      okText: 'Confirm',
      cancelText: 'Cancel',
      cancelButtonProps: { className: 'modal-btn-cancel' },
      okButtonProps: { className: 'modal-btn-ok' },
      onOk() {
        paymentUpdatePlan(userInfo?.agency_id, payload);
        Modal.destroyAll();
        setIsStarted(false);
      },
      onCancel() {
        setIsStarted(false);
      },
    });
  };

  const handleConfirmUpdateAgencySize = payload => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={'Notification'}
          message={`You changed the number of employers in your agency by more than
          ${payload?.recruiters} now.
          The cost you need to pay for the change to be completed is
          AUD $${payload?.amountBeforeTax} + GTS. \n
          Do you agree to this term ?`}
        />
      ),
      okText: 'Confirm',
      cancelText: 'Cancel',
      cancelButtonProps: { className: 'modal-btn-cancel' },
      okButtonProps: { className: 'modal-btn-ok' },
      onOk() {
        chargesInviteAction(agencyInfoResponse?.id, {
          ...payload,
          isAgencySize: true,
        });
        setIsStarted(false);
      },
      onCancel() {
        setIsStarted(false);
      },
    });
  };

  const handleUpdateSuccess = () => {
    Modal.success({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={'Notification'}
          message={`Successfully changed plan information.`}
          isSuccess={true}
        />
      ),
      okButtonProps: { className: 'modal-btn-ok' },
      onOk() {
        clearState();
        handleRedirect();
      },
    });
  };

  useEffect(() => {
    if (userInfo?.agency_id) {
      getListPackage(userInfo.agency_id);
      getAgencyInfo(userInfo.agency_id);
      clearState();
    }
    return () => {
      clearState();
    };
  }, []);

  useEffect(() => {
    if (agencyInfoResponse) {
      setNumberRecruiter(agencyInfoResponse?.company_info?.agency_size || '');
      if (agencyInfoResponse?.subscription_plan) {
        setSelectedPlanId(
          agencyInfoResponse?.subscription_plan?.package_id?.id,
        );
      }
    }
  }, [agencyInfoResponse]);

  useEffect(() => {
    if (isStarted && selectedPlanId) {
      onClickSubscribePlan();
    }
  }, [isStarted, selectedPlanId]);

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
    if (updateSubPlanResponse) {
      resetState();
      handleRedirect();
    }
  }, [updateSubPlanResponse]);

  useEffect(() => {
    if (paymentSuccess) {
      handleUpdateSuccess();
    }
  }, [paymentSuccess]);

  useEffect(() => {
    const error = listPackageError || paymentError || chargesInviteError;
    if (error) {
      openNotification(
        'error',
        error?.message || 'LOADING SUBSCRIPTION ERROR!',
      );
    }
  }, [listPackageError, paymentError, chargesInviteError]);

  useEffect(() => {
    if (updateSubPlanError) {
      if (updateSubPlanError?.message === 'CHANGE_PLAN') {
        handleConfirmUpdatePayment(updateSubPlanError?.payload);
      } else if (updateSubPlanError?.message === 'CHANGE_AGENCY_SIZE') {
        handleConfirmUpdateAgencySize(updateSubPlanError?.payload);
      } else {
        openNotification('error', updateSubPlanError?.message);
      }
    }
  }, [updateSubPlanError]);

  useEffect(() => {
    if (chargesInvite) {
      handleUpdateSuccess();
    }
  }, [chargesInvite]);

  useEffect(() => {
    const loading =
      listPackageLoading ||
      agencyInfoLoading ||
      updateSubPlanLoading ||
      chargesInviteLoading;
    setIsLoading(loading);
  }, [
    listPackageLoading,
    agencyInfoLoading,
    updateSubPlanLoading,
    chargesInviteLoading,
  ]);

  return (
    <>
      {isLoading && <SpinnerLoading loading={isLoading} />}
      {!isLoading && (
        <div className="subscription-form-container">
          <div className="subscription-header">
            <div className="title text-center">
              <div className="title-number-agency">
                <FormattedMessage {...messages.title} />
                <Input
                  placeholder={'Enter value'}
                  value={numberRecruiter}
                  onChange={e => handleChangeNumber(e)}
                />
              </div>
            </div>
          </div>
          <div className="plan-list">
            <div style={{ width: '100%' }}>
              <Slider
                asNavFor={nav1}
                ref={slider => (slider2.current = slider)}
                {...settings}
              >
                {subscriptionPlans.map(plan => {
                  const {
                    id,
                    package_name,
                    description,
                    price,
                    color,
                    max_assessment_limit,
                    max_cv_parsing,
                  } = plan;
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
                        color={color}
                        maxAssessment={max_assessment_limit}
                        maxCV={max_cv_parsing}
                        onSelectPlan={onSelectPlan}
                        onGetStarted={handleGetStarted}
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>

          <div className="footer text-center">
            <div className="total">
              <span className="total-text">
                <FormattedMessage {...messages.total} />
              </span>
              <span className="total-amount bold-text">
                <NumberFormat
                  placeholder=""
                  prefix="AUD $"
                  suffix=" + GST per month"
                  thousandSeparator={true}
                  displayType={'text'}
                  value={getPriceTotal()}
                />
              </span>
            </div>
            <div className="subscribe-button">
              <Button
                type="primary"
                disabled={selectedPlanId && numberRecruiter ? false : true}
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

      {isShowAlertPlan ? (
        <SubscriptionPlanConfrimModal
          onOk={onOk}
          planName={getSelectedPlanName()}
        />
      ) : null}

      {showDowngradeNotiModel ? (
        <DowngradeNotificationModel
          onSuccess={() => {
            setShowDowngradeNotiModel(false);
            setIsStarted(false);
          }}
        />
      ) : null}
    </>
  );
}

SubscriptionForm.propTypes = {
  showSubscribe: PropTypes.bool,
  onSubscribePlanDone: PropTypes.func,
  getListPackage: PropTypes.func,
  listPackageResponse: PropTypes.object,
  listPackageLoading: PropTypes.bool,
  getAgencyInfo: PropTypes.func,
  agencyInfoResponse: PropTypes.object,
  agencyInfoLoading: PropTypes.bool,
  listPackageError: PropTypes.object,
  onUpdateSubscriptionPlan: PropTypes.func,
  updateSubPlanError: PropTypes.object,
  updateSubPlanResponse: PropTypes.object,
  updateSubPlanLoading: PropTypes.bool,
  paymentSuccess: PropTypes.object,
  paymentError: PropTypes.object,
  paymentUpdatePlan: PropTypes.func,
  clearState: PropTypes.func,
  onPaymentDone: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  listPackageLoading: makeSelectGetPackageLoading(),
  listPackageResponse: makeSelectGetPackageSuccess(),
  listPackageError: makeSelectGetPackageError(),
  updateSubPlanResponse: makeSelectUpdateSubscriptionResponse(),
  updateSubPlanError: makeSelectUpdateSubscriptionError(),
  agencyInfoResponse: makeSelectAgencyInfo(),
  agencyInfoLoading: makeSelectGetAgencyInfoLoading(),
  paymentSuccess: makeSelectPaymentUpdateSuccess(),
  paymentError: makeSelectPaymentUpdateError(),
  updateSubPlanLoading: makeSelectUpdateSubscriptionLoading(),
  chargesInvite: makeSelectChargesInviteSuccess(),
  chargesInviteError: makeSelectChargesInviteError(),
  chargesInviteLoading: makeSelectChargesInviteLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    getListPackage: agencyId => dispatch(getListPackageAction(agencyId)),
    getAgencyInfo: agencyId => dispatch(getAgencyInfoAction(agencyId)),
    onUpdateSubscriptionPlan: (agencyId, data) =>
      dispatch(updateSubscriptionPlanAction(agencyId, data)),
    paymentUpdatePlan: (agencyId, data) =>
      dispatch(paymentUpdatePlanAction(agencyId, data)),
    clearState: () => dispatch(resetState()),
    chargesInviteAction: (agencyId, params) =>
      dispatch(onChargesInviteAtion(agencyId, params)),
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
