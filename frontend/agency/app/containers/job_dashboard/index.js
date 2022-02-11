/**
 *
 * JobDashBoard
 *
 */

import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectJobDashBoard, {
  makeSelectJobDetail,
  makeSelectJobDetailLoading,
} from './selectors';
import reducer from './reducer';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import JobInfo from './JobInfo';
import CreateNewJob from 'containers/create_new_job';
import './styles.less';
import WrapperDashboard from './WrapperDashboard';
import { tokenDecoded } from 'utils/authHelper';
import {
  getJobDetail,
  cleanUpJobDetail,
} from 'containers/common_provider/create_job_state/get_job_detail/actions';
import { makeSelectEditJobResult } from 'containers/common_provider/create_job_state/edit_job/selectors';
import { makeSelectChangeStatusJobResult } from 'containers/common_provider/create_job_state/change_status_job/selectors';
import { cleanChangeStatusJob } from 'containers/common_provider/create_job_state/change_status_job/actions';
import { makeSelectDeleteJobResult } from 'containers/common_provider/create_job_state/delete_job/selectors';
import { cleanDeleteJob } from 'containers/common_provider/create_job_state/delete_job/actions';

import { pushNotify } from 'utils/notify';

export function JobDashBoard(props) {
  useInjectReducer({ key: 'jobDashBoard', reducer });

  const {
    history,
    match,
    editResult,
    changeStatusJobResult,
    getJobDetail,
    cleanUpJobDetail,
    cleanChangeStatusJob,
    deleteJobResult,
    cleanDeleteJob,
    jobDetail,
  } = props;

  const [toggleEdit, setToggleEdit] = useState(false);

  const jobId = useMemo(() => {
    return match?.params?.jobId;
  }, [match?.params?.jobId]);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, []);

  const onToggleEdit = e => {
    setToggleEdit(prev => !prev);
  };

  useEffect(() => {
    return () => {
      cleanUpJobDetail();
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    getJobDetail(infoAuth?.agency_id, jobId);
  }, [infoAuth, editResult, changeStatusJobResult, deleteJobResult]);

  useEffect(() => {
    if (changeStatusJobResult?.success) {
      pushNotify({
        type: 'success',
        message: 'Change job status success!',
      });
      cleanChangeStatusJob();
    }
  }, [changeStatusJobResult]);

  useEffect(() => {
    if (editResult?.success) {
      onToggleEdit();
    }
  }, [editResult]);

  useEffect(() => {
    if (deleteJobResult?.success) {
      pushNotify({
        type: 'success',
        message: 'Delete job success!',
      });
      cleanDeleteJob();
      history.push('/job-list');
    }
  }, [deleteJobResult]);

  return (
    <div>
      <Helmet>
        <title>Job Dashboard</title>
        <meta name="description" content="Description of JobDashBoard" />
      </Helmet>
      <MainLayout>
        <ButtonBack onClick={() => history.push('/job-list')}/>
        <WrapperDashboard {...props}>
          {toggleEdit ? (
            <CreateNewJob
              toggleEdit={toggleEdit}
              onToggleEdit={onToggleEdit}
              {...props}
            />
          ) : (
            <JobInfo
              infoAuth={infoAuth}
              toggleEdit={toggleEdit}
              onToggleEdit={onToggleEdit}
              {...props}
            />
          )}
        </WrapperDashboard>
      </MainLayout>
    </div>
  );
}

JobDashBoard.propTypes = {
  getJobDetail: PropTypes.func.isRequired,
  cleanUpJobDetail: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  jobDashBoard: makeSelectJobDashBoard(),
  jobDetail: makeSelectJobDetail(),
  jobDetailLoad: makeSelectJobDetailLoading(),
  editResult: makeSelectEditJobResult(),
  changeStatusJobResult: makeSelectChangeStatusJobResult(),
  deleteJobResult: makeSelectDeleteJobResult(),
});

const mapDispatchToProps = {
  getJobDetail,
  cleanUpJobDetail,
  cleanChangeStatusJob,
  cleanDeleteJob,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(JobDashBoard);
