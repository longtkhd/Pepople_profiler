/**
 *
 * AgencyPlanPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';

import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import SubscriptionForm from 'components/SubscriptionForm';

import './styles.less';

export function SubscriptionPlanPage(props) {
  useInjectReducer({ key: 'SubscriptionPlanPage', reducer });

  const { history } = props;

  const handleRedirect = () => {
    history.push('/subscription-info');
  };

  return (
    <div>
      <Helmet>
        <title>Subscription Plan Page</title>
        <meta
          name="description"
          content="Description of Subscription Plan Page"
        />
      </Helmet>
      <MainLayout mainLayoutStyles={{ backgroundColor: '#ffffff' }}>
        <ButtonBack history={history} />
        <div className="sub-plan__container">
          {/* <Slider
            asNavFor={nav1}
            ref={slider => (slider2.current = slider)}
            slidesToShow={3}
            swipeToSlide={true}
            focusOnSelect={true}
            slidesToScroll={1}
            {...settings}
          > */}
          <SubscriptionForm
            history={history}
            displayChargeText={false}
            showSubscribe={true}
            onPaymentDone={handleRedirect}
          />
          {/* </Slider> */}
        </div>
      </MainLayout>
    </div>
  );
}


const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    reset: () => {
      dispatch(resetState());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SubscriptionPlanPage);
