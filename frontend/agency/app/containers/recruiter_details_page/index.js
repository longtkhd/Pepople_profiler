/**
 *
 * RecruiterDetailsPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';

import { getRecruiterDetail} from './actions';
import removeRecruiter from 'containers/common_provider/remove_recruiter/actions';
import deactiveRecruiter from 'containers/common_provider/deactive_recruiter/actions';
import {
  makeSelectGetRecruiterDetailsLoading,
  makeSelectGetRecruiterDetailsError,
  makeSelectRecruiterDetails,
} from './selectors';
import { makeSelectUpdateRecruiterResponse } from 'containers/common_provider/update_recruiter/selectors';
import { makeSelectRemoveRecruiterResponse } from 'containers/common_provider/remove_recruiter/selectors';
import { makeSelectDeactiveRecruiterResponse } from 'containers/common_provider/deactive_recruiter/selectors';

import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import RecruiterContactInfo from 'components/RecruiterContactInfo';
import RecruiterJobDetails from 'components/RecruiterJobDetails';

import { Button, Row, Col, Modal } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { openNotification } from 'utils/notification';
import './styles.less';

import globalMessages from 'messages';
import messages from './messages';
import { FormattedMessage } from 'react-intl';

export function RecruiterDetailsPage(props) {
  useInjectReducer({ key: 'recruiterDetailsPage', reducer });

  const {
    history,
    match,
    socket,
    recruiterDetails,
    getRecruiterDetails,
    updateRecruiterResponse,
    deleteRecruiter,
    deleteRecruiterResponse,
    onDeactiveRecruiter,
    deactiveRecruiterResponse,
    goToRecruiterList,
  } = props;
  const { recruiterId } = match.params;

  const openDeleteModal = () => {
    Modal.confirm({
      centered: true,
      closable: true,
      title: <FormattedMessage {...messages.deleteRecruiterModal.title} />,
      content: (
        <div>
          <p><FormattedMessage {...messages.deleteRecruiterModal.content} /></p>
        </div>
      ),
      okText: <FormattedMessage {...globalMessages.delete} />,
      okType: 'danger',
      cancelText: <FormattedMessage {...globalMessages.cancel} />,
      onOk() {
        deleteRecruiter(recruiterId);
      },
      onCancel() { },
    })
  }

  const DeactiveRecruiterModal = () => {
    Modal.confirm({
      centered: true,
      closable: true,
      title: <FormattedMessage {...messages.deactiveRecruiterModal.title} />,
      content: (
        <div>
          <p><FormattedMessage {...messages.deactiveRecruiterModal.content} /></p>
        </div>
      ),
      okText: <FormattedMessage {...globalMessages.deactive} />,
      okType: 'danger',
      cancelText: <FormattedMessage {...globalMessages.cancel} />,
      onOk() {
        deactiveRecruiter(recruiterId);
      },
      onCancel() { },
    })
  }

  const deactiveRecruiter = (recruiterId) => {
    onDeactiveRecruiter(recruiterId);
  }

  useEffect(() => {
    if (updateRecruiterResponse) {
      openNotification('success', <FormattedMessage {...messages.updateRecruiterSuccess} />);
      getRecruiterDetails(recruiterId, {
        params: {
          populate_statistic: true
        }
      });
    }
    return () => { }
  }, [updateRecruiterResponse])

  useEffect(() => {
    if (deleteRecruiterResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.deleteRecruiterSuccess} />);
      goToRecruiterList();
    }
    return () => { }
  }, [deleteRecruiterResponse])

  useEffect(() => {
    if (deactiveRecruiterResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.deactiveRecruiterSuccess} />);
      goToRecruiterList();
    }
    return () => { }
  }, [deactiveRecruiterResponse])

  useEffect(() => {
    getRecruiterDetails(recruiterId, {
      params: {
        populate_statistic: true
      }
    });
    return () => { }
  }, [])

  return (
    <div>
      <Helmet>
        <title>Recruiter Details</title>
        <meta
          name="description"
          content="Recruiter Details"
        />
      </Helmet>
      <MainLayout>
        <ButtonBack history={history} />
        <div className="recruiter-information">
          <Row justify="space-between">
            <Col lg={12} md={12} sm={24} xs={24}>
              {recruiterDetails && <RecruiterContactInfo data={recruiterDetails} recruiterId={recruiterId} socket={socket} />}
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              {recruiterDetails && <RecruiterJobDetails data={recruiterDetails} />}
            </Col>
          </Row>
        </div>
        <div className="recruiter-actions">
          <Row justify="end">
            <Button type="danger" className="btn-delete" icon={<i class="action-icon far fa-trash-alt" />} onClick={openDeleteModal} >
              <FormattedMessage {...globalMessages.delete} />
            </Button>
            <Button type="default" className="grey-button btn-deactivate" icon={<LockOutlined />} onClick={DeactiveRecruiterModal} >
              <FormattedMessage {...globalMessages.deactive} />
            </Button>
          </Row>
        </div>
      </MainLayout>
    </div>
  );
}

RecruiterDetailsPage.propTypes = {
  error: PropTypes.func,
  loading: PropTypes.bool,
  recruiterDetails: PropTypes.object,
  getRecruiterDetails: PropTypes.func,
  updateRecruiterResponse: PropTypes.object,
  deleteRecruiter: PropTypes.func,
  deleteRecruiterResponse: PropTypes.object,
  onDeactiveRecruiter: PropTypes.func,
  deactiveRecruiterResponse: PropTypes.object,
  goToRecruiterList: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  error: makeSelectGetRecruiterDetailsError(),
  loading: makeSelectGetRecruiterDetailsLoading(),
  recruiterDetails: makeSelectRecruiterDetails(),
  updateRecruiterResponse: makeSelectUpdateRecruiterResponse(),
  deleteRecruiterResponse: makeSelectRemoveRecruiterResponse(),
  deactiveRecruiterResponse: makeSelectDeactiveRecruiterResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getRecruiterDetails: (recruiterId, params) => dispatch(getRecruiterDetail(recruiterId, params)),
    deleteRecruiter: (recruiterId) => dispatch(removeRecruiter(recruiterId)),
    onDeactiveRecruiter: (recruiterId) => dispatch(deactiveRecruiter(recruiterId)),
    goToRecruiterList: () => dispatch(push('/recruiter-list')),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruiterDetailsPage);
