import React, { memo, useState, useMemo, useEffect } from 'react';
import { Progress, Table, Space, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import {
  makeSelectListCandidateAdded,
  makeSelectPercentAddCandidate,
  makeSelectAddExistingResult,
} from 'containers/common_provider/candidate_state/add_candidate_to_list/selectors';
import {
  makeSelectPercentUploadCandidate,
  makeSelectCandidateUploadResult,
  makeSelectCandidatePreview,
  makeSelectCandidateExistsPreview,
} from 'containers/common_provider/candidate_state/upload_cv/selectors';

const TableUploadResume = props => {
  const {
    listCandidateAdded,
    percent,
    percentUploadCV,
    previewCandidate,
    candidateAddExistResult,
    candidateUploadCVResult,
    previewCandidateCV,
    previewCandidateExists,
  } = props;

  // const candidateNames = useMemo(() => {
  //   return listAdded && listAdded.map( ({ name }) => name );
  // },[listAdded]);

  // const totalPayload = [previewCandidateExists, previewCandidateCV];
  // console.log('totalPayload>>', totalPayload);

  // const newArr = totalPayload.filter( files => files ).reduce((accumulator, currentValue) => accumulator.concat(currentValue),[]);
  // console.log(`newArr>>`,newArr);
  const listUploadCV = useMemo(() => {
    const totalPayload = [previewCandidateExists, previewCandidateCV];

    // return totalPayload;

    return (
      totalPayload &&
      totalPayload
        .filter(files => files)
        .reduce(
          (accumulator, currentValue) => accumulator.concat(currentValue),
          [],
        )
        .map(file => ({
          key: file?.uid,
          name: file?.name,
        }))
    );
  }, [previewCandidateExists, previewCandidateCV]);

  // console.log('listUploadCV>>>', listUploadCV);

  const resumeColumns = [
    {
      title: 'Resume Name',
      dataIndex: 'name',
      // render: text => <div>{text}</div>,
    },
    {
      title: 'Upload',
      render: (text, record) => (
        <div className="wrapper-progress">
          {listUploadCV && (
            <Row justify="center" align="middle" gutter={[8, 8]}>
              <Col xs={24} sm={4} md={4} xxl={4}>
                {percentUploadCV !== 100 &&
                  !candidateUploadCVResult?.success && <LoadingOutlined />}
              </Col>
              <Col xs={24} sm={20} md={20} xxl={20}>
              <Progress percent={percentUploadCV > 0 && percentUploadCV } strokeColor="#3abcca" />
              </Col>
            </Row>
          )}
        </div>
      ),
    },
  ];

  // const candidateColumns = [
  //   {
  //     title: 'Candidate Name',
  //     dataIndex: 'name',
  //     render: text => <div>{text}</div>,
  //   },
  //   {
  //     title: 'Upload',
  //     render: (text, record) => (
  //       <div className="wrapper-progress">
  //         {listCandidateAdded && (
  //           <Row align="middle" justify="center" gutter={[8, 8]}>
  //             <Col xs={24} sm={4} md={4} xxl={4}>
  //               {percent === 100 && !candidateAddExistResult?.success && (
  //                 <LoadingOutlined />
  //               )}
  //             </Col>
  //             <Col xs={24} sm={20} md={20} xxl={20}>
  //               <Progress percent={percent} strokeColor="#3abcca" />
  //             </Col>
  //           </Row>
  //         )}
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <>
      <div className="table-simple-ui">
        {listUploadCV && (
          <Table
            {...props}
            columns={resumeColumns}
            dataSource={listUploadCV}
            pagination={false}
            key={c => c.key}
          />
        )}
      </div>
      {/* <div className="table-simple-ui">
        {listCandidateAdded && listCandidateAdded !== null && (
          <Table
            {...props}
            columns={candidateColumns}
            dataSource={listCandidateAdded}
            pagination={false}
            key={c => c.key}
          />
        )}
      </div> */}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  listCandidateAdded: makeSelectListCandidateAdded(),
  percent: makeSelectPercentAddCandidate(),
  percentUploadCV: makeSelectPercentUploadCandidate(),
  candidateUploadCVResult: makeSelectCandidateUploadResult(),
  candidateAddExistResult: makeSelectAddExistingResult(),
  previewCandidateCV: makeSelectCandidatePreview(),
  previewCandidateExists: makeSelectCandidateExistsPreview(),
});

const mapDispatchToProp = {};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProp,
  ),
  memo,
)(TableUploadResume);
