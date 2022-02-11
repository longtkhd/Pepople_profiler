import React, { memo, useMemo, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TableCustom from 'components/TableCustom';
import Status from 'components/Status';
import { makeSelectAddExistingResult } from 'containers/common_provider/candidate_state/add_candidate_to_list/selectors';
import { makeSelectCandidateUploadResult } from 'containers/common_provider/candidate_state/upload_cv/selectors';
import MoreInfo from '../../components/MoreInfo'

const TableParsed = props => {
  const { addCandidatesResult, candidateUploadResult } = props;
  // console.log('candidateUploadResult', candidateUploadResult);

  // console.log('>>>addCandidatesResult Payload>>', addCandidatesResult);
  // console.log('>>>candidateUploadResult Payload>>', candidateUploadResult);

  // const addCandidateResult = useMemo(() => {
  //   return (
  //     addCandidatesResult?.data &&
  //     addCandidatesResult?.data.map(candidate => ({
  //       id: candidate?.id,
  //       key: candidate?.id,
  //       name: candidate?.candidate_name,
  //       position: candidate?.current_position,
  //       employer: candidate.current_employer,
  //     }))
  //   );
  // }, [addCandidatesResult]);

  // console.log('>>hardcode reuslt',addCandidatesResult)

  const uploadCandidateResult = useMemo(() => {
    return (
      candidateUploadResult &&
      candidateUploadResult.map(candidate => ({
        id: candidate?.id,
        key: candidate?.id,
        name: candidate?.candidate_name,
        position: candidate?.current_position,
        employer: candidate.current_employer,
      }))
    );
  }, [candidateUploadResult]);

  const showMoreInfo = useMemo(() => {
    return candidateUploadResult && candidateUploadResult.some(c => !c?.current_employer || !c?.current_position || !c?.candidate_name)
  }, [candidateUploadResult])

  // console.log('uploadCandidateResult>>', uploadCandidateResult);

  const candidateUploadColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: name =>
        name ? (
          <div>{name}</div>
        ) : (
          <div>
            <FontAwesomeIcon className={`color-red`} icon={faTimesCircle} />
          </div>
        ),
      align: 'left',
    },
    {
      title: 'Current position',
      dataIndex: 'position',
      key: 'position',
      render: position =>
        position ? (
          <div>{position}</div>
        ) : (
          <div>
            <FontAwesomeIcon className={`color-red`} icon={faTimesCircle} />
          </div>
        ),
      align: 'left',
    },
    {
      title: 'Current employer',
      dataIndex: 'employer',
      key: 'employer',
      render: employer =>
        employer ? (
          <div>{employer}</div>
        ) : (
          <div>
            <FontAwesomeIcon className={`color-red`} icon={faTimesCircle} />
          </div>
        ),
      align: 'left',
    },
    {
      title: 'result',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (!record?.position && !record?.employer) {
          return <Status type={'missing2'} />;
        } else if (!record?.position || !record?.employer) {
          return <Status type={'missing'} />;
        } else {
          return <Status type={'successful'} />;
        }
      },
      align: 'left',
    },
  ];

  return (
    <div className={`wrapper-table-parsed`}>
      {showMoreInfo && (
        <div className={`more-info-wrapper`}>
          <MoreInfo content={<FormattedMessage {...messages.missingContent} />}/>
        </div>
      )}
      <TableCustom
        scroll={{ x: 576, y: 250 }}
        {...props}
        columns={candidateUploadColumns}
        dataSource={uploadCandidateResult}
        pagination={false}
        key={c => c.key}
      />
    </div>
  );

  // if (
  //   addCandidateResult &&
  //   addCandidateResult.length !== 0 &&
  //   (uploadCandidateResult && uploadCandidateResult.length !== 0)
  // ) {
  //   return (
  //     <div className={`wrapper-table-parsed`}>
  //       <TableCustom
  //         scroll={{ x: 576, y: 250 }}
  //         {...props}
  //         columns={candidateUploadColumns}
  //         dataSource={[...addCandidateResult, ...uploadCandidateResult]}
  //         pagination={false}
  //         key={c => c.key}
  //       />
  //     </div>
  //   );
  // } else if (addCandidateResult && addCandidateResult.length !== 0) {
  //   return (
  //     <div className={`wrapper-table-parsed`}>
  //       <TableCustom
  //         scroll={{ x: 576, y: 250 }}
  //         {...props}
  //         columns={candidateUploadColumns}
  //         dataSource={addCandidateResult}
  //         pagination={false}
  //         key={c => c.key}
  //       />
  //     </div>
  //   );
  // } else if (uploadCandidateResult && uploadCandidateResult.length !== 0) {
  //   return (
  //     <div className={`wrapper-table-parsed`}>
  //       <TableCustom
  //         scroll={{ x: 576, y: 250 }}
  //         {...props}
  //         columns={candidateUploadColumns}
  //         dataSource={uploadCandidateResult}
  //         pagination={false}
  //         key={c => c.key}
  //       />
  //     </div>
  //   );
  // } else {
  //   return;
  // }
};

const mapStateToProps = createStructuredSelector({
  addCandidatesResult: makeSelectAddExistingResult(),
  candidateUploadResult: makeSelectCandidateUploadResult(),
});

const mapDispatchToProp = {};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProp,
  ),
  memo,
)(TableParsed);
