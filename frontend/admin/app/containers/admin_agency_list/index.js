/**
 *
 * AgencyPage
 *
 */

import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAgencyPage from './selectors';
import reducer from './reducer';
import messages from './messages';
import TableCustom from 'components/TableCustom';
import SectionWrapper from 'components/SectionWrapper';
import ButtonBack from 'components/ButtonBack';
import Status from 'components/Status';
import ActionType from 'components/TableCustom/ActionType';
import { Row, Col } from 'antd';
import Title from 'components/atoms/Title';
import MainLayout from 'components/layout/MainLayout';
import './styles.less';
import {
  getArgencyList,
  deleteAgencyDefault,
  deactiveAgencyDefault,
} from 'containers/common_provider/agency_list/actions';
import {
  makeSelectArgencyInfo,
  makeSelectDeleteAgency,
  makeSelectDeleteAgencyError,
  makeSelectDeactiveAgencySuccess,
} from 'containers/common_provider/agency_list/selectors';
import { openNotification } from 'utils/notification';

export function AgencyPage(props) {
  useInjectReducer({ key: 'agencyPage', reducer });
  const {
    onGetAgencyList,
    agencyData,
    history,
    onDeleteAgency,
    deleteStatus,
    errors,
    onDeactiveAgency,
    deactiveStatus,
  } = props;
  const total = agencyData?.total;
  const dataList = agencyData?.list;

  const [current, setCurrent] = useState(1);
  const [pageSizes, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleDelete = agencyId => {
    onDeleteAgency(agencyId);
  };

  const handleDeactive = agencyId => {
    onDeactiveAgency(agencyId);
  };
  const handleSetLast = () => {
    const lastPage = parseInt(total / pageSizes) + 1;

    setCurrent(lastPage);
  };
  const handleSetFirst = () => {
    setCurrent(1);
  };

  useEffect(() => {
    if (deleteStatus) {
      openNotification('success', 'Delete Agency Success');
    }
  }, [deleteStatus]);

  useEffect(() => {
    if (deactiveStatus) {
      openNotification('success', 'Deactive Agency Success');
    }
  }, [deactiveStatus]);

  useEffect(() => {
    if (errors) {
      openNotification('error', 'Oops, Something went wrong !');
    }
  }, [errors]);

  const renderStatus = text => {
    if (!text?.is_verify) {
      return (
        <Row justify="start" gutter={[16, 0]}>
          <Col>
            <Status type="registering" />
          </Col>
        </Row>
      );
    } else {
      return text?.is_active ? (
        <Row justify="start" gutter={[16, 0]}>
          <Col>
            <Status type="active" />
          </Col>
        </Row>
      ) : (
        <Row justify="start" gutter={[16, 0]}>
          <Col>
            <Status type="deactive" onClick={() => handleDeactive(id)} />
          </Col>
        </Row>
      );
    }
  };

  const handleActionStatus = (text, parent) => {
    let id = parent?.id;
    // console.log(parent.id)
    if (!text?.is_verify) {
      return (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType type="delete" onClick={() => handleDelete(id)} />
          </Col>
          <Col>
            <ActionType type="Refresh" />
          </Col>
          {/* <Col>
          <ActionType type="Refresh" />

        </Col> */}
          <Col>
            <ActionType
              onClick={() => history.push(`/admin-agency-detail/${id}`)}
              type="view"
            />
          </Col>
        </Row>
      );
    } else {
      return text?.is_active ? (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType type="Deactive" onClick={() => handleDeactive(id)} />
          </Col>

          <Col>
            <ActionType
              onClick={() => history.push(`/admin-agency-detail/${id}`)}
              type="view"
            />
          </Col>
        </Row>
      ) : (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType type="delete" onClick={() => handleDelete(id)} />
          </Col>

          <Col>
            <ActionType
              onClick={() => history.push(`/admin-agency-detail/${id}`)}
              type="view"
            />
          </Col>
        </Row>
      );
    }
  };

  useEffect(() => {
    onGetAgencyList({
      params: {
        page: current,
        size: pageSizes,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
    });
    return () => {};
  }, [current, pageSizes, deleteStatus, deactiveStatus]);

  const ClientColumns = [
    {
      title: 'AGENCY NAME',
      dataIndex: 'agency_name',
      key: '1',
      width: '15%',
    },
    {
      title: 'Plan',
      dataIndex: 'subscription_plan_name',
      key: '2',
      render: text => (text ? <p>{text}</p> : <p>-</p>),
      width: '15%',
    },
    {
      title: 'No. of recruiters',
      dataIndex: 'recruiter_count',
      key: '3',
      render: text => (text ? <p>{text}</p> : <p>-</p>),
      width: '20%',
    },
    {
      title: 'STATUS',
      dataIndex: 'created_by',
      key: '4',
      render: text => renderStatus(text),
      align: 'start',
    },
    {
      title: 'ACTIONS',
      dataIndex: 'created_by',
      key: '5',
      render: (text, id) => handleActionStatus(text, id),
      // render: (text, list) => console.log(text, list)
    },
  ];

  const handleChangePage = useCallback(async (currentPage, pageSize) => {
    setPageSize(pageSize);
    setCurrent(currentPage);

    await onGetAgencyList({
      params: {
        page: currentPage,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
    });
  });

  const onSearch = useCallback(async value => {
    await onGetAgencyList({
      params: {
        page: current,
        size: pageSizes,
        sort_field: sortField,
        sort_direction: sortDirection,
        keyword: value,
      },
    });
  }, []);

  return (
    <div>
      <Helmet>
        <title>AgencyPage</title>
        <meta name="description" content="Description of AgencyPage" />
      </Helmet>

      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>
        <SectionWrapper className="agencies">
          <div className="title-argency-list">
            <Title>Agency List</Title>
          </div>

          {/* <ContainerFluid > */}
          <div className="agency-list-profiler">
            <TableCustom
              searchBox={true}
              handleSearchBox={onSearch}
              dataSource={dataList}
              rowKey={record => record.id}
              columns={ClientColumns}
              paginate={true}
              pagination={false}
              paginateStyle={`paginate-custom-style`}
              isShowJump={true}
              setCurrentCustom={() => handleSetLast()}
              setCurrentFirst={() => handleSetFirst()}
              paginateOptions={{
                total,
                current,
                onChange: handleChangePage,
              }}
            />
          </div>

          {/* </ContainerFluid> */}
        </SectionWrapper>
      </MainLayout>
      {/* <FormattedMessage {...messages.header} /> */}
    </div>
  );
}

AgencyPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agencyPage: makeSelectAgencyPage(),
  agencyData: makeSelectArgencyInfo(),
  deleteStatus: makeSelectDeleteAgency(),
  errors: makeSelectDeleteAgencyError(),
  deactiveStatus: makeSelectDeactiveAgencySuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAgencyList: params => dispatch(getArgencyList(params)),
    onDeleteAgency: agencyId => dispatch(deleteAgencyDefault(agencyId)),
    onDeactiveAgency: agencyId => dispatch(deactiveAgencyDefault(agencyId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AgencyPage);
