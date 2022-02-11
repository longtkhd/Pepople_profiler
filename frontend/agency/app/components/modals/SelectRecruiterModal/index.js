/**
 *
 * SelectRecruiterModal
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import {
  makeSelectGetRecruiterListLoading,
  makeSelectGetRecruiterListError,
  makeSelectRecruiterListResponse,
} from 'containers/common_provider/get_recruiter_list/selectors';
import getRecruiterList from 'containers/common_provider/get_recruiter_list/actions';

import TableCustom from 'components/TableCustom';
import { getUserInfo } from 'services/authentication';
import { Modal } from 'antd';
import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SelectRecruiterModal(props) {
  const {
    visible,
    closeModal,
    getAgencyRecruiters,
    getRecruiterListError,
    getRecruiterListLoading,
    recruiterListResponse,
    selectRecruiter,
  } = props;

  const [dataSource, setDataSource] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState({});
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 5;
  const userInfo = getUserInfo();

  const columns = [
    {
      title: <FormattedMessage {...messages.firstName} />,
      dataIndex: 'first_name',
      key: 'first_name',
      width: '20%',
    },
    {
      title: <FormattedMessage {...messages.lastName} />,
      dataIndex: 'last_name',
      key: 'last_name',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.role} />,
      dataIndex: 'job_title',
      key: 'job_title',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.email} />,
      dataIndex: 'email',
      key: 'email',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.contact} />,
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: '15%',
    },
  ];

  const handleOk = e => {
    closeModal();
    selectRecruiter(selectedRecruiter);
  };

  const handleCancel = e => {
    closeModal();
  };

  const handleSetLast = () => {
    const lastPage = parseInt(total / pageSize) + 1;
    setCurrent(lastPage);
  };

  const handleSetFirst = () => {
    setCurrent(1);
  };

  const handleChangePage = currentPage => {
    setCurrent(parseInt(currentPage));
  };

  const getRecruiterData = () => {
    const { agency_id } = userInfo;
    const params = {
      page: current,
      size: pageSize,
    };
    if (agency_id) {
      getAgencyRecruiters(agency_id, params);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRecruiter(selectedRows[0]);
    },
  };

  useEffect(() => {
    if (recruiterListResponse?.success) {
      setTotal(recruiterListResponse.data?.total || 0);
      const recruiterList = recruiterListResponse.data?.recruiter_list || [];
      setDataSource(
        recruiterList.map(recruiter => {
          recruiter.key = recruiter.id;
          return recruiter;
        }),
      );
    }
    return () => {};
  }, [recruiterListResponse]);

  useEffect(() => {
    getRecruiterData();
    return () => {};
  }, [current]);

  const onSearch = useCallback(async value => {
    const { agency_id } = userInfo;
    const params = {
      page: current,
      size: pageSize,
      keyword: value,
    };
    if (agency_id) {
      getAgencyRecruiters(agency_id, params);
    }
  });
  return (
    <Modal
      title={<FormattedMessage {...messages.title} />}
      width={1000}
      className="recruiter-modal"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <TableCustom
        searchBox={true}
        handleSearchBox={onSearch}
        loading={getRecruiterListLoading}
        dataSource={dataSource}
        columns={columns}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        paginate={true}
        pagination={false}
        paginateStyle={`paginate-custom-style mb-24`}
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
    </Modal>
  );
}

SelectRecruiterModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  selectRecruiter: PropTypes.func,
  getAgencyRecruiters: PropTypes.func,
  getRecruiterListLoading: PropTypes.bool,
  getRecruiterListError: PropTypes.object,
  recruiterListResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  getRecruiterListLoading: makeSelectGetRecruiterListLoading(),
  getRecruiterListError: makeSelectGetRecruiterListError(),
  recruiterListResponse: makeSelectRecruiterListResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAgencyRecruiters: (agencyId, data) =>
      dispatch(getRecruiterList(agencyId, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SelectRecruiterModal);
