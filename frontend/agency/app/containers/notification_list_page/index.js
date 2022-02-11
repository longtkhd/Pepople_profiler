/**
 *
 * NotificationListPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import { removeNotification, getNotificationListAction, removeAllNotification } from './actions';
import updateNotification from 'containers/common_provider/update_notification/actions';
import {
  makeSelectDeleteNotificationLoading,
  makeSelectDeleteNotificationError,
  makeSelectDeleteNotificationResponse,
  makeSelectGetNotificationListLoading,
  makeSelectGetNotificationListError,
  makeSelectGetNotificationListResponse,
  makeSelectDeleteAllNotificationLoading,
  makeSelectDeleteAllNotificationError,
  makeSelectDeleteAllNotificationResponse
} from './selectors';
import { makeSelectUpdateNotificationResponse } from 'containers/common_provider/update_notification/selectors';

import { Button, Empty, Modal, Pagination, Row, Col } from 'antd';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import Title from 'components/atoms/Title';
import NotificationItem from './NotificationItem';
import CombinedCustom from 'components/CombinedCustom';
import SpanCustom  from 'components/SpanCustom';
import { openNotification } from 'utils/notification';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './styles.less';

export function NotificationListPage(props) {
  useInjectReducer({ key: 'notificationListPage', reducer });
  const {
    history,
    getNotificationList,
    notificationListLoading,
    notificationListError,
    notificationListResponse,
    deleteNotification,
    deleteNotificationLoading,
    deleteNotificationError,
    deleteAllNotificationLoading,
    deleteAllNotificationError,
    deleteAllNotificationResponse,
    deleteNotificationResponse,
    onUpdateNotification,
    updateNotificationResponse,
    onDeleteAllNotification
  } = props;
  const SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,setPageSize] = useState(SIZE)
  const [notifications, setNotifications] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [notificationContent, setNotificationContent] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');


  function confirm(notificationId) {
    Modal.confirm({
      centered: true,
      title: <FormattedMessage {...globalMessages.areYouSure} />,
      icon: <ExclamationCircleOutlined />,
      content: <FormattedMessage {...messages.deleteNotification} />,
      okText: <FormattedMessage {...globalMessages.delete} />,
      onOk: () => {
        deleteNotification(notificationId);
      },
      confirmLoading: deleteNotificationLoading
    });
  }
  function confirmDeleteAll(listNotificationId) {
    Modal.confirm({
      centered: true,
      title: <FormattedMessage {...globalMessages.areYouSure} />,
      icon: <ExclamationCircleOutlined />,
      content: <FormattedMessage {...messages.deleteAllNotification} />,
      okText: <FormattedMessage {...messages.deleteAll} />,
      onOk: () => {
        onDeleteAll(listNotificationId);
      },
      confirmLoading: deleteAllNotificationLoading
    });
  }

  const onPaginationChange = (current, size) => {
    const params = {
      size,
      page: current,
      sort_field : 'created_at',
      sort_direction: -1,
      is_deleted: false
    };
    setCurrentPage(current);
    setPageSize(size)
    getNotificationList(params);
  }

  const init = () => {
    const params = {
      size: SIZE,
      page: currentPage,
      sort_field : 'created_at',
      sort_direction: -1,
      is_deleted: false
    };
    getNotificationList(params);
  }

  const onClickNotification = async notification => {
    const { id, status, content, title } = notification;
    if (status == 0) await onUpdateNotification(id, { status: 1 });
    setNotificationTitle(title);
    setNotificationContent(content);
    setToggleModal(true);
  }

  const onDeleteAll = () => {
    const arrayId = notifications.map((item, index) => item.id);
    onDeleteAllNotification(arrayId);
  }

  useEffect(() => {
    init();
    return () => { }
  }, [currentPage])

  useEffect(() => {
    const error = notificationListError || deleteNotificationError
    if (error) {
      openNotification('error', error.message);
    }
  }, [notificationListError, deleteNotificationError])

  useEffect(() => {
    const error = notificationListError || deleteAllNotificationError
    if (error) {
      openNotification('error', error.message);
    }
  }, [notificationListError, deleteAllNotificationError])

  useEffect(() => {
    if (deleteNotificationResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.deleteNotificationSuccess} />);
      init()
    }
  }, [deleteNotificationResponse])

  useEffect(() => {
    if (deleteAllNotificationResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.deleteAllNotificationSuccess} />);
      setCurrentPage(1);
    }
  }, [deleteAllNotificationResponse])

  useEffect(() => {
    if (updateNotificationResponse?.success) {
      init();
    }
  }, [updateNotificationResponse])

  useEffect(() => {
    if (notificationListResponse?.success) {
      setNotifications(notificationListResponse?.data?.notifications);
    }
  }, [notificationListResponse])

  useEffect(() => {
    init();
  }, [])

  return (
    <div>
      <Helmet>
        <title>Notification List</title>
        <meta
          name="description"
          content="Description of NotificationListPage"
        />
      </Helmet>
      <MainLayout loading={deleteNotificationLoading}>
        <ButtonBack history={history} />
        <div className="notification-list-page-container">
          <div className="mb-24 mt-24">
            <Title>
              <FormattedMessage {...messages.title} />
            </Title>
          </div>
          <div className="notification-list-page-layout mb-24">
            <div className="notification-list-page-action">
            {
              notifications?.length !== 0 ? (
                <Button
                  type="danger"
                  className="w-147"
                  disabled={notifications?.length == 0}
                  icon={<SpanCustom className={'action-icon'}><i className="far fa-trash-alt"></i></SpanCustom>}
                  onClick={() => confirmDeleteAll()}
                >
                  <FormattedMessage {...messages.deleteAll} />
                </Button>
              ) : null
            }
            </div>
            <div className="notification-list-page-data-area">
              {
                notifications?.length > 0 ? (
                  <div className="notification-list-page-data">
                    {notifications.map(notification =>
                      <div
                        key={notification.id}
                        onClick={() => onClickNotification(notification)}
                      >
                        <NotificationItem
                          key={notification.id}
                          id={notification.id}
                          content={notification.content}
                          status={notification.status}
                          createdDate={notification.created_date}
                          onDelete={() => confirm(notification.id)}
                        />
                      </div>
                    )}
                    <div className="notification-list-page-pagination">
                      <Pagination
                        defaultCurrent={currentPage}
                        total={notificationListResponse?.data.total}
                        pageSize={SIZE}
                        onChange={onPaginationChange}
                      />
                    </div>
                  </div>
                ) : (
                  <Empty />
                )
              }
            </div>
          </div>
        </div>
        <CombinedCustom
          width={500}
          toggleModal={toggleModal}
          showModal={() => setToggleModal(true)}
          title={notificationTitle || <FormattedMessage {...messages.notificationModalTitle} />}
          content={<div dangerouslySetInnerHTML={{ __html: notificationContent }} />}
          footer={[
            <Row gutter={[8, 0]}>
              <Col>
                <Button
                  className="w-120"
                  type="primary"
                  onClick={() => {
                    setToggleModal(false);
                  }}
                >
                  {`OK`}
                </Button>
              </Col>
            </Row>,
          ]}
        />
      </MainLayout>
    </div>
  );
}

NotificationListPage.propTypes = {
  getNotificationList: PropTypes.func,
  notificationListLoading: PropTypes.bool,
  notificationListError: PropTypes.object,
  notificationListResponse: PropTypes.object,
  deleteNotification: PropTypes.func,
  deleteNotificationLoading: PropTypes.bool,
  deleteNotificationError: PropTypes.object,
  deleteNotificationResponse: PropTypes.object,
  onUpdateNotification: PropTypes.func,
  updateNotificationResponse: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  notificationListLoading: makeSelectGetNotificationListLoading(),
  notificationListError: makeSelectGetNotificationListError(),
  notificationListResponse: makeSelectGetNotificationListResponse(),
  deleteNotificationLoading: makeSelectGetNotificationListLoading(),
  deleteNotificationError: makeSelectDeleteNotificationError(),
  deleteNotificationResponse: makeSelectDeleteNotificationResponse(),

  deleteAllNotificationLoading: makeSelectDeleteAllNotificationLoading(),
  deleteAllNotificationError: makeSelectDeleteAllNotificationError(),
  deleteAllNotificationResponse: makeSelectDeleteAllNotificationResponse(),

  updateNotificationResponse: makeSelectUpdateNotificationResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getNotificationList: data => dispatch(getNotificationListAction(data)),
    deleteNotification: notificationId => dispatch(removeNotification(notificationId)),
    onDeleteAllNotification: listNotificationId => dispatch(removeAllNotification(listNotificationId)),
    onUpdateNotification: (notificationId, data) => dispatch(updateNotification(notificationId, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(NotificationListPage);
