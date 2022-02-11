import React, { memo, useState, useMemo, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { tokenDecoded } from 'utils/authHelper';
import {
  uploadCV,
  deleteCandidatePreview,
  deleteCandidateExistsPreview,
} from 'containers/common_provider/candidate_state/upload_cv/actions';
import { createStructuredSelector } from 'reselect';
import { makeSelectListCandidateAdded } from 'containers/common_provider/candidate_state/add_candidate_to_list/selectors';
import {
  makeSelectCandidatePreview,
  makeSelectCandidateExistsPreview,
} from 'containers/common_provider/candidate_state/upload_cv/selectors';
import UploadFileCV from 'components/UploadFileCV';
import PreviewFileUpload from './PreviewFileUpload';
import TableDeleteResume from './TableDeleteResume';
import TableCustom from 'components/TableCustom';
import './styles.less';

const StepOne = props => {
  // console.log('step 1>>',props);
  // const { errors, touched } = formikProps;
  const {
    deleteCandidatePreview,
    deleteCandidateExistsPreview,
    previewCandidateCV,
    previewCandidateExists,
  } = props;

  const columns = [
    {
      title: 'resume name',
      dataIndex: 'name',
      key: 'name',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Actions',
      key: 'action',
      render: text => <p>{text}</p>,
    },
  ];
  return (
    <div>
      <UploadFileCV />
      <div className={`wrapper-table-head`}>
        <TableCustom pagination={false} columns={columns} dataSource={[]} />
      </div>
      <div className={`wrapper-table-body`}>
        {previewCandidateCV && previewCandidateCV.length !== 0 && (
          <PreviewFileUpload
            deleteCandidatePreview={deleteCandidatePreview}
            data={previewCandidateCV}
            pagination={false}
            // scroll={{ x: 576 }}
          />
        )}
        {previewCandidateExists && previewCandidateExists.length !== 0 && (
          <TableDeleteResume
            deleteResume={deleteCandidateExistsPreview}
            data={previewCandidateExists}
            pagination={false}
            // scroll={{ x: 576 }}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  listAdded: makeSelectListCandidateAdded(),
  previewCandidateCV: makeSelectCandidatePreview(),
  previewCandidateExists: makeSelectCandidateExistsPreview(),
});

const mapDispatchToProp = {
  uploadCV,
  deleteCandidateExistsPreview,
  deleteCandidatePreview,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProp,
  ),
  memo,
)(StepOne);
