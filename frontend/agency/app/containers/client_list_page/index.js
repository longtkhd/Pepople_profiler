/**
 *
 * ClientListPage
 *
 */

import React, { memo, useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  fetchClientList,
  cleanClientList,
} from 'containers/common_provider/client_state/actions';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectClientListPage, {
  makeSelectClientData,
  makeSelectListClientTotal,
  makeSelectListClientLoading,
} from './selectors';
import {
  deleteClient,
  cleanUpDeleteClient,
} from 'containers/common_provider/client_state/delete_client/actions';
import {
  makeSelectDeleteClientResult,
  makeSelectDeleteClientLoading,
} from 'containers/common_provider/client_state/delete_client/selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonBack from 'components/ButtonBack';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import PlusImg from 'images/icons/plus.png';
import { Row, Col, Button, Input } from 'antd';
import { tokenDecoded } from 'utils/authHelper';
import { pushNotify } from 'utils/notify';
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import './styles.less';

export function ClientListPage(props) {
  useInjectReducer({ key: 'clientListPage', reducer });
  const {
    history,
    fetchClientList,
    clientData,
    total,
    loading,
    cleanClientList,
    deleteClient,
    deleteClientResult,
    cleanUpDeleteClient,
  } = props;

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [keyword, setKeyword] = useState('');

  const showModal = () => {
    setToggleModal(true);
  };

  const onCancel = () => {
    setToggleModal(false);
  };

  const onOk = () => {
    deleteClient(clientId);
  };

  const columnClosedJobs = [
    {
      title: (
        <div
          className={`text-group text-gray-1 text-w-bold text-size-12`}
        >{`business`}</div>
      ),
      dataIndex: 'business_name',
      key: 'business_name',
      width: '30%',
      render: text => (
        <p className={`text-group text-black-2 text-w-normal text-size-14`}>
          {text}
        </p>
      ),
    },
    {
      title: (
        <div className={`text-group text-gray-1 text-w-bold text-size-12`}>
          {'no. of closed jobs'}
        </div>
      ),
      dataIndex: 'close_job',
      key: 'close_job',
      render: text => (
        <p className={`text-group text-black-2 text-w-normal text-size-14`}>
          {text}
        </p>
      ),
    },
    {
      title: (
        <div
          className={`text-group text-gray-1 text-w-bold text-size-12`}
        >{`no. of open jobs`}</div>
      ),
      dataIndex: 'open_job',
      key: 'open_job',
      render: text => (
        <p className={`text-group text-black-2 text-w-normal text-size-14`}>
          {text}
        </p>
      ),
    },
    {
      title: (
        <div
          className={`text-group text-gray-1 text-w-bold text-size-12`}
        >{`Actions`}</div>
      ),
      key: 'action',
      render: record => (
        <Row justify="end" align="middle" gutter={[16, 0]}>
          <Col>
            <ActionType
              onClick={() => {
                showModal();
                setClientId(record.id);
              }}
              type="delete"
            />
          </Col>
          <Col>
            <ActionType
              onClick={() => history.push(`client-detail/${record.id}`)}
              type="view"
            />
          </Col>
        </Row>
      ),
      width: '20%',
    },
  ];

  const handleTableChange = useCallback(async (pagination, filters, sorter) => {
    setSortField(sorter.order === 'ascend' ? -1 : 1);
    setSortDirection(sorter.field);
    await fetchClientList(infoAuth?.agency_id, {
      params: {
        sort_field: sorter.field,
        sort_direction: sorter.order === 'ascend' ? -1 : 1,
        page: current,
        size: pageSize,
        paginate: true,
      },
    });
  }, []);

  const handleChangePage = useCallback(
    async currentPage => {
      setCurrent(currentPage);
      await fetchClientList(infoAuth?.agency_id, {
        params: {
          page: currentPage,
          size: pageSize,
          paginate: true,
          keyword: keyword && keyword,
        },
      });
    },
    [keyword],
  );

  const onSearch = useCallback(async value => {
    setKeyword(value);
    await fetchClientList(infoAuth?.agency_id, {
      params: {
        page: current,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
        keyword: value,
      },
    });
  }, []);

  const pushToCreate = useCallback(() => history.push('/client-create'), [
    history,
  ]);

  const handleSetLast = () => {
    const lastPage = Math.ceil(total / pageSize);
    setCurrent(lastPage);
  };

  const handleSetFirst = () => {
    setCurrent(1);
  };

  useEffect(() => {
    if (infoAuth) {
      fetchClientList(infoAuth?.agency_id, {
        params: {
          page: current,
          size: pageSize,
          sort_field: sortField,
          sort_direction: sortDirection,
          paginate: true,
          keyword: keyword && keyword
        },
      });
    }
  }, [infoAuth, keyword, current, deleteClientResult]);

  useEffect(() => {
    if (deleteClientResult?.success) {
      pushNotify({
        type: 'success',
        message: <FormattedMessage {...messages.deleteClientSuccess} />,
      });
      onCancel();
      cleanUpDeleteClient();
    }
  }, [deleteClientResult]);

  useEffect(() => {
    return () => {
      cleanClientList();
      cleanUpDeleteClient();
      setClientId(null);
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>Client List</title>
        <meta name="description" content="Description of ClientListPage" />
      </Helmet>
      <MainLayout>
        <ButtonBack history={history} />
        {/* POPUP */}
        <CombinedCustom
          width={500}
          toggleModal={toggleModal}
          title={`Are you sure?`}
          content={`Are you sure you want to permanently delete this client?`}
          footer={[
            <Row gutter={[8, 0]}>
              <Col>
                <ButtonCustom
                  onClick={onCancel}
                  className={`btn-default-outline w-120`}
                >
                  {`Cancel`}
                </ButtonCustom>
              </Col>
              <Col>
                <ButtonCustom onClick={onOk} className={`btn-danger w-120`}>
                  {`Delete`}
                </ButtonCustom>
              </Col>
            </Row>,
          ]}
        />
        <FormInfoDetail
          title={<FormattedMessage {...messages.clientList} />}
          actions={
            <Row>
              <Col>
                <Button
                  type="primary"
                  className="btn-create btn-with-icon w-150"
                  onClick={pushToCreate}
                  icon={<img src={PlusImg} />}
                  case="static"
                  onClick={pushToCreate}
                >
                  <FormattedMessage {...messages.create} />
                </Button>
              </Col>
            </Row>
          }
        >
          <TableCustom
            searchBox={true}
            handleSearchBox={onSearch}
            scroll={{
              x: 1024,
            }}
            onChange={handleTableChange}
            loading={loading}
            rowKey={record => record.id}
            dataSource={clientData}
            pagination={false}
            paginate={true}
            paginateStyle={`paginate-custom-style`}
            isShowJump={true}
            setCurrentCustom={() => handleSetLast()}
            setCurrentFirst={() => handleSetFirst()}
            paginateOptions={{
              current,
              defaultPageSize: pageSize,
              total,
              onChange: handleChangePage,
            }}
            columns={columnClosedJobs}
          />
        </FormInfoDetail>
      </MainLayout>
    </div>
  );
}

ClientListPage.propTypes = {
  fetchClientList: PropTypes.func.isRequired,
  cleanClientList: PropTypes.func,
  deleteClient: PropTypes.func.isRequired,
  cleanUpDeleteClient: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  clientListPage: makeSelectClientListPage(),
  clientData: makeSelectClientData(),
  total: makeSelectListClientTotal(),
  loading: makeSelectListClientLoading(),
  deleteClientResult: makeSelectDeleteClientResult(),
  deleteClientLoad: makeSelectDeleteClientLoading(),
});

const mapDispatchToProps = {
  fetchClientList,
  deleteClient,
  cleanClientList,
  cleanUpDeleteClient,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClientListPage);
