/**
 *
 * AdminUserList
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAdminUserList from './selectors';
import reducer from './reducer';
import messages from './messages';

import MainLayout from 'components/layout/MainLayout';
import TableCustom from 'components/TableCustom';
import { Row, Col } from 'antd'
import Status from 'components/Status'
import ActionType from 'components/TableCustom/ActionType'
import './styles.less'
import FormInfoDetail from 'components/FormInfoDetail'
import { push } from 'connected-react-router';
import { makeSelectRecruiterListByAdmin } from 'containers/common_provider/get_recruiter_list/selectors'
import { getRecruiterByAdmin } from 'containers/common_provider/get_recruiter_list/actions'
import SectionWrapper from 'components/SectionWrapper';
import ContainerFluid from 'components/ContainerFluid';
import Title from 'components/atoms/Title'
export function AdminUserList(props) {
  const {
    history,
    onGetRecruiter,
    recruiterList
  } = props
  useInjectReducer({ key: 'adminUserList', reducer });

  const [current, setCurrent] = useState(1);
  const [pageSizes, setPageSizes] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const data = recruiterList?.recruiter_list;
  const total = recruiterList?.total;

  useEffect(() => {

    onGetRecruiter({
      params: {
        page: current,
        size: pageSizes,
        sort_field: sortField,
        sort_direction: sortDirection
      }

    })
    // return () => { }
  }, [current, pageSizes])



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
      render: (record) => (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType onClick={() => history.push(`/recruiter-detail/${record}`)} type="view" />
            {/* <ActionType onClick={(record) => console.log(record.key)} type="view" /> */}

          </Col>

        </Row>
      ),
      align: 'right'


    },

  ];

  const handleChangePage = useCallback((page, pageSize) => {



    onGetRecruiter({
      params: {
        page: page,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
    });
    setPageSizes(pageSize)
    setCurrent(page);
  }, []);







  return (
    <div>
      <Helmet>
        <title>AdminUserList</title>
        <meta name="description" content="Description of AdminUserList" />
      </Helmet>

      <MainLayout>
        <SectionWrapper className="recruiters">
          <div className="title-argency-list">

            <Title style={{ padding: '0 30px' }}>Recruiter List</Title>
          </div>
          <ContainerFluid>
            <TableCustom
              dataSource={data}
              columns={ClientColumns}
              rowKey={record => record.id}
              pagination={false}
              paginate={true}
              paginateStyle={`paginate-custom-style`}
              // defaultCurrent={1}
              paginateOptions={{
                // defaultCurrent: 1,
                current: current,
                defaultPageSize: pageSizes,
                total,
                onChange: handleChangePage,
              }}

            />
          </ContainerFluid>


        </SectionWrapper>
      </MainLayout>
    </div>
  );
}

AdminUserList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // adminUserList: makeSelectAdminUserList(),
  recruiterList: makeSelectRecruiterListByAdmin()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetRecruiter: (params) => dispatch(getRecruiterByAdmin(params))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminUserList);
