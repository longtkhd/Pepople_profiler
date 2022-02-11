/**
 *
 * AdminRecruiterList
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAdminRecruiterList from './selectors';
import reducer from './reducer';
import messages from './messages';
import getRecruiterByAgency from 'containers/common_provider/get_recruiter_list/actions';
import { makeSelectRecruiterListResponse } from 'containers/common_provider/get_recruiter_list/selectors';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import TableCustom from 'components/TableCustom';
import { Row, Col } from 'antd';
import ActionType from 'components/TableCustom/ActionType';
import FormInfoDetail from 'components/FormInfoDetail';

export function AdminRecruiterList(props) {
  const { history, ongetRecruiter, recruiterList } = props;
  const agencyId = props.match.params.id;
  useInjectReducer({ key: 'adminRecruiterList', reducer });

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSizes] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  // const [recruiterData, setRecruiterData] = useState(null)
  const recruiterData = recruiterList?.data?.recruiter_list;
  const total = recruiterList?.data?.total;
  const handleSetLast = () => {
    const lastPage = parseInt(total / pageSize) + 1;
    setCurrent(lastPage);
  };
  const handleSetFirst = () => {
    setCurrent(1);
  };

  const handleRedirect = (id, parent) => {
    return parent?.role === 'agency' ? (
      <Row justify="end" gutter={[16, 0]}>
        <Col>
          <ActionType
            onClick={() =>
              history.push(`/admin-agency-detail/${parent?.agency_id}`)
            }
            type="view"
          />
          {/* <ActionType onClick={(record) => console.log(record.key)} type="view" /> */}
        </Col>
      </Row>
    ) : (
      <Row justify="end" gutter={[16, 0]}>
        <Col>
          <ActionType
            onClick={() => history.push(`/recruiter-detail/${id}`)}
            type="view"
          />
          {/* <ActionType onClick={(record) => console.log(record.key)} type="view" /> */}
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    ongetRecruiter(agencyId, {
      params: {
        page: current,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
    });
  }, [current, pageSize]);

  const handleChangePage = useCallback((page, pageSize) => {
    setPageSizes(pageSize);
    setCurrent(page);

    ongetRecruiter(agencyId, {
      params: {
        page: current,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
    });
    setPageSizes(pageSize);
    setCurrent(page);
  }, []);

  const onSearch = useCallback(async value => {
    await ongetRecruiter(agencyId, {
      params: {
        page: current,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
        keyword: value,
      },
    });
  }, []);

  const ClientColumns = [
    {
      title: 'first name',
      dataIndex: 'first_name',
      key: '1',
      // width: '10%'
      // render: text => <p>{text}</p>,
    },
    {
      title: 'last name',
      dataIndex: 'last_name',
      key: '2',
      // width: '10%'
    },
    {
      title: 'contact number',
      dataIndex: 'phone_number',
      key: '3',
      // width: '10%'
    },
    {
      title: 'job title',
      dataIndex: 'job_title',
      key: '4',
      // width: '10%'
    },
    {
      title: 'open job',
      dataIndex: 'open_job',
      key: '5',
      // width: '10%'
    },

    {
      title: 'ACTIONS',
      dataIndex: 'id',
      key: '6',
      width: '20%',
      render: (id, parent) => handleRedirect(id, parent),

      align: 'right',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>AdminRecruiterList</title>
        <meta name="description" content="Description of AdminRecruiterList" />
      </Helmet>

      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>
        <div className="recruiter-list-child">
          <FormInfoDetail title="Recruiter List">
            <TableCustom
              searchBox={true}
              handleSearchBox={onSearch}
              dataSource={recruiterData}
              columns={ClientColumns}
              rowKey={record => record.id}
              pagination={false}
              paginate={true}
              paginateStyle={`paginate-custom-style`}
              // defaultCurrent={1}
              paginateOptions={{
                // defaultCurrent: 1,
                current: current,
                defaultPageSize: pageSize,
                total,
                onChange: handleChangePage,
              }}
              isShowJump={true}
              setCurrentCustom={() => handleSetLast()}
              setCurrentFirst={() => handleSetFirst()}
            />
          </FormInfoDetail>
        </div>
      </MainLayout>
    </div>
  );
}

AdminRecruiterList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminRecruiterList: makeSelectAdminRecruiterList(),
  recruiterList: makeSelectRecruiterListResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ongetRecruiter: (agencyId, params) =>
      dispatch(getRecruiterByAgency(agencyId, params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminRecruiterList);
