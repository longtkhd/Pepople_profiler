/**
 *
 * RecruiterListPage
 *
 */

import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectGetRecruiterLoading,
  makeSelectGetRecruiterError,
  makeSelectRecruiterData,
  makeSelectSubscriptionInfo,
  makeSelectReInviteRecruiterLoading,
  makeSelectReInviteRecruiterResponse,
} from './selectors';
import {
  getRecruiterList,
  getSubscription,
  reInviteRecruiterAction,
} from './actions';
import reducer from './reducer';
import removeRecruiter from 'containers/common_provider/remove_recruiter/actions';
import {
  makeSelectRemoveRecruiterError,
  makeSelectRemoveRecruiterResponse,
} from 'containers/common_provider/remove_recruiter/selectors';
import { getUserInfo } from 'services/authentication';

import { Row, Col, Button, Space, Modal } from 'antd';
import PlusImg from 'images/icons/plus.png';
const { confirm } = Modal;

import FormInfoDetail from 'components/FormInfoDetail';
import TableCustom from 'components/TableCustom';
import MainLayout from 'components/layout/MainLayout';
import { openNotification } from 'utils/notification';
import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';
import ActionType from 'components/TableCustom/ActionType';

export function RecruiterListPage(props) {
  useInjectReducer({ key: 'recruiterListPage', reducer });

  const {
    recruiterError,
    recruiterLoading,
    recruiterData,
    getRecruiters,
    deleteRecruiter,
    subscriptionInfo,
    getSubscriptionInfo,
    removeRecruiterError,
    removeRecruiterResponse,
    reInviteRecruiter,
    reInviteRecruiterLoading,
    reInviteRecruiterResponse,
    goToRecruiterDetails,
    goToAgencyDetails,
  } = props;
  const pageSize = 10;
  const [dataSource, setDataSource] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSizes, setPageSizes] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const userInfo = getUserInfo();

  const handleRedirect = parent => {
    if (parent.role === 'recruiter') {
      goToRecruiterDetails(parent?.id);
    } else if (parent.role === 'agency') {
      goToAgencyDetails(parent?.agency_id);
    }
  };

  const handleSetLast = () => {
    const lastPage = parseInt(total / pageSize) + 1;
    setCurrent(lastPage);
  };

  const handleSetFirst = () => {
    setCurrent(1);
  };

  const handleChangePage = (currentPage, pageSize) => {
    setCurrent(currentPage);
    setPageSizes(pageSize);
    const agencyId = userInfo.agency_id;
    if (agencyId) {
      const params = {
        page: currentPage,
        size: pageSize,
      };
      getRecruiters(agencyId, params);
      getSubscriptionInfo(agencyId);
    }
  };

  const DeleteRecruiterModal = recruiter => {
    confirm({
      centered: true,
      closable: true,
      title: <FormattedMessage {...messages.deleteRecruiterTitle} />,
      content: (
        <p>
          <FormattedMessage {...messages.deleteRecruiterContent} />
        </p>
      ),
      okText: <FormattedMessage {...globalMessages.delete} />,
      okType: 'danger',
      cancelText: <FormattedMessage {...globalMessages.cancel} />,
      onOk() {
        deleteRecruiter(recruiter.id);
      },
      onCancel() {},
    });
  };

  const ReInviteRecruiter = recruiterId => {
    confirm({
      centered: true,
      closable: true,
      title: <FormattedMessage {...messages.reInviteRecruiterTitle} />,
      content: (
        <p>
          <FormattedMessage {...messages.reInviteRecruiterContent} />
        </p>
      ),
      okText: <FormattedMessage {...messages.invite} />,
      okType: 'primary',
      cancelText: <FormattedMessage {...globalMessages.cancel} />,
      onOk() {
        reInviteRecruiter(recruiterId);
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: <FormattedMessage {...messages.firstName} />,
      dataIndex: 'first_name',
      key: 'first_name',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.lastName} />,
      dataIndex: 'last_name',
      key: 'last_name',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.contactNumber} />,
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.jobTitle} />,
      dataIndex: 'job_title',
      key: 'job_title',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.openJobs} />,
      dataIndex: 'open_job',
      key: 'open_job',
      width: '15%',
    },
    {
      title: <FormattedMessage {...globalMessages.actions} />,
      key: 'action',
      width: '18%',
      render: (text, record) => (
        <Space size="middle" className="actions">
          <div className="table-action">
            <Link to="#">
              <div
                className={`color-red ${record.role === 'agency' &&
                  'color-disabled'} icon-inline`}
                onClick={() => checkShowDeleteRecruiterModal(record)}
              >
                <ActionType type="delete" />
              </div>
            </Link>
          </div>
          <Row justify="end" gutter={[16, 0]}>
            <Col>
              <ActionType onClick={() => handleRedirect(record)} type="view" />
            </Col>
          </Row>
          {!record.is_verify ? (
            <div className="table-action">
              <Button
                className="re-invite"
                type="default"
                onClick={() => ReInviteRecruiter(record.id)}
              >
                <FormattedMessage {...globalMessages.reInvite} />
              </Button>
            </div>
          ) : null}
        </Space>
      ),
    },
  ];

  const checkShowDeleteRecruiterModal = recruiter => {
    if (recruiter?.role == 'recruiter') {
      DeleteRecruiterModal(recruiter);
    }
  };

  const init = () => {
    if (userInfo) {
      const agencyId = userInfo.agency_id;
      if (agencyId) {
        const params = {
          page: current,
          size: pageSize,
        };
        getRecruiters(agencyId, params);
        getSubscriptionInfo(agencyId);
      }
    }
  };

  const maxRecruiter = useMemo(() => {
    return subscriptionInfo?.package_id?.max_recruiter;
  }, [subscriptionInfo?.package_id?.max_recruiter]);

  useEffect(() => {
    if (reInviteRecruiterResponse?.data) {
      openNotification(
        'success',
        <FormattedMessage {...messages.reInviteRecruiterSuccess} />,
      );
    }
  }, [reInviteRecruiterResponse]);

  useEffect(() => {
    if (recruiterData) {
      setTotal(recruiterData.total);
      const recruiterList = recruiterData.recruiter_list || [];
      setDataSource(
        recruiterList.map(recruiter => {
          recruiter.key = recruiter.id;
          return recruiter;
        }),
      );
    }
    return () => {};
  }, [recruiterData]);

  useEffect(() => {
    if (recruiterError) {
      openNotification('error', recruiterError.message);
    }
    return () => {};
  }, [recruiterError]);

  useEffect(() => {
    if (removeRecruiterResponse) {
      init();
      openNotification(
        'success',
        <FormattedMessage {...messages.deleteRecruiterSuccess} />,
      );
    }
    return () => {};
  }, [removeRecruiterResponse]);

  useEffect(() => {
    if (removeRecruiterError) {
      openNotification('error', removeRecruiterError.message);
    }
    return () => {};
  }, [removeRecruiterError]);

  useEffect(() => {
    init();
    return () => {};
  }, []);

  const onSearch = useCallback(value => {
    const agencyId = userInfo.agency_id;
    if (agencyId) {
      const params = {
        page: current,
        size: pageSizes,
        keyword: value,
      };
      getRecruiters(agencyId, params);
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Recruiter List</title>
        <meta name="description" content="Description of RecruiterListPage" />
      </Helmet>

      <MainLayout>
        <FormInfoDetail
          title="Recruiter List"
          actions={
            <Row flex="flex" justify="center" align="middle">
              <Col>
                <div className="mr-10">
                  <span className="color-grey">
                    <FormattedMessage {...messages.haveUsed} />
                  </span>
                  &nbsp;
                  <span className="bold-text">{`${total} / ${maxRecruiter ||
                    0} accounts`}</span>
                </div>
              </Col>
              <Col>
                <Button
                  type="primary"
                  className="btn-with-icon w-150 btn-inviteRecruiter"
                  icon={<img src={PlusImg} />}
                >
                  <FormattedMessage {...messages.invite} />
                  <div className="overlay-invite">
                    <Link to="/manual-invite" className="overlay-invite-link">
                      <FormattedMessage {...messages.manualInvite} />
                    </Link>
                    <Link to="/csv-invite" className="overlay-invite-link">
                      <FormattedMessage {...messages.importCSVFile} />
                    </Link>
                  </div>
                </Button>
              </Col>
            </Row>
          }
        >
          <TableCustom
            searchBox={true}
            handleSearchBox={onSearch}
            scroll={{ x: 1024 }}
            dataSource={dataSource}
            columns={columns}
            loading={recruiterLoading}
            paginate={true}
            pagination={false}
            paginateStyle={`paginate-custom-style`}
            isShowJump={true}
            setCurrentCustom={() => handleSetLast()}
            setCurrentFirst={() => handleSetFirst()}
            paginateOptions={{
              total,
              current,
              pageSize,
              onChange: handleChangePage,
            }}
          />
        </FormInfoDetail>
      </MainLayout>
    </div>
  );
}

RecruiterListPage.propTypes = {
  recruiterLoading: PropTypes.bool,
  recruiterError: PropTypes.object,
  recruiterData: PropTypes.object,
  getRecruiters: PropTypes.func,
  deleteRecruiter: PropTypes.func,
  subscriptionInfo: PropTypes.object,
  getSubscriptionInfo: PropTypes.func,
  removeRecruiterError: PropTypes.object,
  removeRecruiterResponse: PropTypes.object,
  reInviteRecruiter: PropTypes.func,
  reInviteRecruiterLoading: PropTypes.bool,
  reInviteRecruiterResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  recruiterError: makeSelectGetRecruiterError(),
  recruiterLoading: makeSelectGetRecruiterLoading(),
  recruiterData: makeSelectRecruiterData(),
  subscriptionInfo: makeSelectSubscriptionInfo(),
  removeRecruiterError: makeSelectRemoveRecruiterError(),
  removeRecruiterResponse: makeSelectRemoveRecruiterResponse(),
  reInviteRecruiterLoading: makeSelectReInviteRecruiterLoading(),
  reInviteRecruiterResponse: makeSelectReInviteRecruiterResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getRecruiters: (agencyId, params) => dispatch(getRecruiterList(agencyId, params)),
    deleteRecruiter: recruiterId => dispatch(removeRecruiter(recruiterId)),
    getSubscriptionInfo: agencyId => dispatch(getSubscription(agencyId)),
    reInviteRecruiter: recruiterId => dispatch(reInviteRecruiterAction(recruiterId)),
    goToRecruiterDetails: recruiterId => dispatch(push(`/recruiter-details/${recruiterId}`)),
    goToAgencyDetails: agencyId => dispatch(push(`/agency-details/${agencyId}`)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruiterListPage);
