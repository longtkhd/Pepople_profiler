/**
 *
 * SubscriptionFormSetup
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import globalMessages from 'messages';
import messages from './messages';

import getListPackage from 'containers/common_provider/get_package_setup/actions';
import updateSubscriptionPlan from 'containers/common_provider/update_subscription_setup/actions';
import getAgencyInfo from 'containers/common_provider/get_agency_info_setup/actions';
import {
  makeSelectGetPackageLoading,
  makeSelectGetPackageSuccess,
  makeSelectGetPackageError,
} from 'containers/common_provider/get_package_setup/selectors';
import {
  makeSelectUpdateSubscriptionError,
  makeSelectUpdateSubscriptionResponse,
} from 'containers/common_provider/update_subscription_setup/selectors';
import {
  makeSelectAgencyInfo,
  makeSelectGetAgencyInfoLoading,
} from 'containers/common_provider/get_agency_info_setup/selectors';

import { Button, Input, Modal } from 'antd';
import SubscriptionPlan from 'components/SubscriptionPlan';
import SpinnerLoading from 'components/SpinnerLoading';
import SubscriptionPlanConfrimModal from 'components/modals/SubscriptionPlanConfrimModal';

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

const settings = {
  centerMode: true,
  infinite: false,
  centerPadding: '60px',
  focusOnSelect: true,
  slidesToShow: 4,
  dots: true,
  arrows: true,

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

function SubscriptionFormSetup(props) {
  const {
    setupToken,
    user,
    showSubscribe,
    onSubscribePlanDone,
    onGetListPackage,
    listPackageResponse,
    listPackageLoading,
    onGetAgencyInfo,
    agencyInfoResponse,
    agencyInfoLoading,
    listPackageError,
    onUpdateSubscriptionPlan,
    updateSubPlanError,
    updateSubPlanResponse,
    onBack,
  } = props;

  const [billingType, setBillingType] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [numberRecruiter, setNumberRecruiter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAlertPlan, setIsShowAlertPlan] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [state, setState] = useState({ nav1: null, nav2: null });

  const slider1 = useRef();
  const slider2 = useRef();

  const { nav1, nav2 } = state;

  let renderPlan = () => {
    return (
      <div style={{ width: '100%' }}>
        <Slider
          asNavFor={nav1}
          ref={slider => (slider2.current = slider)}
          slidesToShow={3}
          swipeToSlide={true}
          focusOnSelect={true}
          slidesToScroll={1}
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
    );
  };

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

  const onClickSubscribePlan = () => {
    const packageSize = getPackageMaxRecruiter();
    if (!numberRecruiter) return;
    if (packageSize < numberRecruiter) {
      setIsShowAlertPlan(true);
      return;
    }
    let recruiterCount = agencyInfoResponse?.recruiter_count;
    if (recruiterCount && recruiterCount > numberRecruiter) {
      Modal.error({
        title: <FormattedMessage {...messages.errorTitle} />,
        content: <FormattedMessage {...messages.errorRecruiter} />,
        onOk: function() {
          setIsStarted(false);
        },
      });
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
      price: getPriceTotal() + getTaxTotal(),
      price_before_tax: getPriceTotal(),
      agency_size: numberRecruiter,
    };
    if (!user) {
      openNotification('error', 'User not found!');
      return;
    }
    onUpdateSubscriptionPlan(
      setupToken.accessToken,
      user.agency_id,
      updateData,
    );
  };

  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
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
      setSubscriptionPlans(
        list.map(p => {
          p.key = p.id;
          return p;
        }),
      );
    }
  }, [listPackageResponse]);

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

  useEffect(() => {
    if (user && setupToken) {
      const agencyId = user.agency_id;
      if (agencyId) {
        onGetListPackage(setupToken.accessToken, agencyId);
        onGetAgencyInfo(setupToken.accessToken, agencyId);
      }
    }
  }, []);

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
              <div className="title-content">
                <FormattedMessage {...messages.notice} />
              </div>
            </div>
          </div>
          <div className="plan-list">{renderPlan()}</div>
          <div className="subscription-footer text-center">
            <div className="subscription-total">
              <span className="total-text">
                <FormattedMessage {...messages.total} />
              </span>
              &nbsp;
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
            <div className="subscription-actions">
              <Button
                type="primary"
                onClick={() => onBack()}
              >
                <FormattedMessage {...globalMessages.back} />
              </Button>
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
    </>
  );
}

SubscriptionFormSetup.propTypes = {
  setupToken: PropTypes.object,
  user: PropTypes.object,
  onSubscribePlanDone: PropTypes.func,
  listPackageResponse: PropTypes.object,
  listPackageError: PropTypes.object,
  updateSubPlanError: PropTypes.object,
  updateSubPlanResponse: PropTypes.object,
  onGetListPackage: PropTypes.func,
  onGetAgencyInfo: PropTypes.func,
  onUpdateSubscriptionPlan: PropTypes.func,
  onBack: PropTypes.func,
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
    onGetListPackage: (accessToken, agencyId) =>
      dispatch(getListPackage(accessToken, agencyId)),
    onGetAgencyInfo: (accessToken, agencyId) =>
      dispatch(getAgencyInfo(accessToken, agencyId)),
    onUpdateSubscriptionPlan: (accessToken, agencyId, data) =>
      dispatch(updateSubscriptionPlan(accessToken, agencyId, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SubscriptionFormSetup);
