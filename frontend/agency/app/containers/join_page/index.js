/**
 *
 * JoinPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectJoinPage from './selectors';
import reducer from './reducer';
import {
  initStep,
  nextStepForm,
  initJoinPagge,
} from './actions';
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info_setup/selectors';
import getAgencyInfoSetup from 'containers/common_provider/get_agency_info_setup/actions';
import createPasswordAction from 'containers/common_provider/create_password_setup/actions';
import updateNotificationSetting from 'containers/common_provider/update_notification_setting_setup/actions';
import { makeSelectCreatePasswordResponse, makeSelectCreatePasswordError } from 'containers/common_provider/create_password_setup/selectors';

import RegisterLayout from 'components/layout/RegisterLayout';
import JoinForm from './JoinForm';
import jwt_decoded from 'jwt-decode';
import SpinnerLoading from 'components/SpinnerLoading';
import './styles.less';

import { openNotification } from 'utils/notification';
import messages from './messages';
import { FormattedMessage } from 'react-intl';

import { CONFIG } from 'constants/config';
import useSocket from 'use-socket.io-client';
const server = CONFIG.SERVER;
const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;

export function JoinPage(props) {
  useInjectReducer({ key: 'joinPage', reducer });
  const [tokenId, setTokenId] = useState(null);
  const [accessTok, setAccessTok] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const {
    joinPage,
    nextStepForm,
    initJoinPagge,
    createNewPassword,
    getAgencyInfo,
    agencyInfo,
    createPasswordError,
    createPasswordResponse,
    onUpdateNotificationSetting,
    history, //Why did you delete this my code ? :D
  } = props;

  const {
    recruiterInfo,
    loadingPage,
    error,
  } = joinPage; //state in join page

  const [socket] = useSocket(server);

  useEffect(() => {
    if (recruiterInfo) {
      
      if(!recruiterInfo?.success){
        history.push('/404')
      }
      else{
        setAccessTok(recruiterInfo?.data?.token?.accessToken);
        setDecoded(jwt_decoded(recruiterInfo?.data?.token?.accessToken));
      }
      
    }
  }, [recruiterInfo]);

  useEffect(() => {
    if (createPasswordResponse?.success) {
      openNotification('success', <FormattedMessage  {...messages.createPasswordSuccess} />);
      if (!agencyInfo) return;
      socket.emit('clientSendNotification', {
        sender_id: decoded.id,
        receiver_id: agencyInfo.owner_id,
        type: NOTIFICATION_TYPES.RECRUITER_INVITATION_ACCEPTED,
        title: 'New recruiter onboarding!',
        content: `<div><span class="notification-content-highlight">${decoded.firstname} ${decoded.lastname}</span> has accepted your invitation and has joined the platform.</div>`,
      });
    }
  }, [createPasswordResponse]);

  useEffect(() => {
    if (createPasswordError) {
      openNotification('error', createPasswordError.message.title, createPasswordError.message.content);
    }
  }, [createPasswordError]);

  useEffect(() => {
    if (error?.message) {
      // history.push('/404')
    }
  }, [error]);

  useEffect(() => {
    if (decoded && accessTok) {
      getAgencyInfo(accessTok, decoded.agency_id);
    }
  }, [decoded, accessTok]);

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    const tokenID = query.get('token') || null;
    if (tokenID) {
      setTokenId(tokenID);
      const payload = {
        token: tokenID,
      };
      initJoinPagge(payload);
    }
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loadingPage) return <SpinnerLoading loading={loadingPage} />;

  return (
    <div className="h100">
      <Helmet>
        <title>Recruiter Join</title>
        <meta name="description" content="Description of join page" />
      </Helmet>
      <RegisterLayout
        loading={loadingPage}
        showFooter={true}
        className={'join-page-footer'}
      >
        <div className="join h100">
          <div className="join-body">
            <JoinForm
              step={joinPage.step}
              accessTok={accessTok}
              tokenId={tokenId}
              createNewPassword={createNewPassword}
              onUpdateNotificationSetting={onUpdateNotificationSetting}
              userInfo={decoded}
              nextStepForm={nextStepForm}
            />
          </div>
        </div>
      </RegisterLayout>
    </div>
  );
}

JoinPage.propTypes = {
  initStep: PropTypes.func.isRequired,
  nextStepForm: PropTypes.func.isRequired,
  initJoinPagge: PropTypes.func.isRequired,
  createNewPassword: PropTypes.func.isRequired,
  onUpdateNotificationSetting: PropTypes.func,
  getAgencyInfo: PropTypes.func,
  agencyInfo: PropTypes.object,
  createPasswordResponse: PropTypes.object,
  createPasswordError: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  joinPage: makeSelectJoinPage(),
  agencyInfo: makeSelectAgencyInfo(),
  createPasswordResponse: makeSelectCreatePasswordResponse(),
  createPasswordError: makeSelectCreatePasswordError(),
});

const mapDispatchToProps = {
  initStep,
  nextStepForm,
  initJoinPagge,
  createNewPassword: (accessToken, data) => createPasswordAction(accessToken, data),
  onUpdateNotificationSetting: (accessToken, data) => updateNotificationSetting(accessToken, data),
  getAgencyInfo: (accessToken, agencyId) => getAgencyInfoSetup(accessToken, agencyId),
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(JoinPage);
