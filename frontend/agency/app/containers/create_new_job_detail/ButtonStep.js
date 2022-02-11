import React, { memo, useMemo, useCallback, useEffect, useState } from 'react';
import { Col, Row, Modal } from 'antd';
import ButtonCustom from 'components/atoms/Button';
import { push } from 'connected-react-router';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import AddExistsCandidate from './AddExistsCandidate';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { cleanStepCreateJob } from './actions';
import { openNotification } from 'utils/notification';
import {
  addExistCandidate,
  percentAddCandidate,
  cleanUpAddExistCandidate,
} from 'containers/common_provider/candidate_state/add_candidate_to_list/actions';
import {
  uploadCV,
  cleanUploadCandidate,
  percentUploadCandidate,
  cleanUploadCVCandidate,
} from 'containers/common_provider/candidate_state/upload_cv/actions';
import {
  makeSelectListCandidateAdded,
  makeSelectAddExistingResult,
  makeSelectAddExistingLoading,
  makeSelectPercentAddCandidate,
} from 'containers/common_provider/candidate_state/add_candidate_to_list/selectors';
import {
  makeSelectCandidatePreview,
  makeSelectCandidateExistsPreview,
  makeSelectPercentUploadCandidate,
  makeSelectCandidateUploadSuccess,
  makeSelectCancellingUpload,
} from 'containers/common_provider/candidate_state/upload_cv/selectors';
import axios from 'axios';
import { makeSelectStatusParseCv } from '../common_provider/candidate_state/upload_cv/selectors';
import CombinedCustom from 'components/CombinedCustom';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const ButtonStep = props => {
  // console.log(props);
  const {
    stepCreateJob,
    listAdded,
    addExistCandidate,
    cleanUpAddExistCandidate,
    percentAddCandidate,
    addExistingResult,
    cleanStepCreateJob,
    push,
    percent,
    jobId,
    previewCandidate,
    percentUploadCv,
    uploadCV,
    cleanUploadCandidate,
    uploadCandidateCvSuccess,
    percentUploadCandidate,
    cleanUploadCVCandidate,
    isCancelled,
    statusParseCv,
  } = props;

  const [tryAgain, setTryAgain] = useState(false);

  // console.log('List Added>>', listAdded);

  useEffect(() => {
    if (uploadCandidateCvSuccess?.success) {
      percentUploadCandidate(100);
      setTimeout(() => {
        stepCreateJob(2);
        percentUploadCandidate(0);
      }, 1000);
    }
  }, [uploadCandidateCvSuccess]);

  // useEffect(() => {
  //   if (percent) {
  //     let percentFake = 0;
  //     const interval = setInterval(() => {
  //       percentFake += 10;
  //       percentUploadCandidate(percentFake);

  //       if (percent === 100)  {
  //         clearInterval(interval);
  //         percentUploadCandidate(0);
  //       }
  //     }, 2000);
  //   }
  // },[])

  // useEffect(() => {
  //   if (percent === 100 && addExistingResult?.success) {
  //     stepCreateJob(2);
  //   }
  // }, [percent, addExistingResult]);

  // const addCandidateExisting = () => {
  //   stepCreateJob(1);
  //   addExistCandidate(jobId, getIdList, {
  //     onUploadProgress: e => {
  //       percentAddCandidate(Math.round((100 * e.loaded) / e.total));
  //     },
  //     cancelToken: source.token,
  //   });
  // };

  const uploadCandidateCV = () => {
    // stepCreateJob(1);
    // alert('OK upload');
    let formData = new FormData();
    if (
      previewCandidate &&
      previewCandidate.length > 0 &&
      listAdded &&
      listAdded.length > 0
    ) {
      const totalCandidate = [...previewCandidate, ...listAdded];
      // console.log('>>>totalcandidate>>');
      for (let i = 0; i < totalCandidate.length; i++) {
        if (totalCandidate[i]?.key) {
          formData.append(`candidate_id_list[]`, totalCandidate[i].id);
        }
        if (totalCandidate[i].originFileObj) {
          formData.append(`cv`, totalCandidate[i].originFileObj);
        }
      }
      uploadCV(jobId, formData, {
        onUploadProgress: e => {
          // percentUploadCandidate(Math.round((100 * e.loaded) / e.total));
          const percent = Math.round((100 * e.loaded) / e.total);
          console.log(`e.loaded 1>>>>>`, percent);
          if (percent < 100) {
            percentUploadCandidate(percent);
          }
          // console.log('uploadV>>percent',Math.round((100 * e.loaded) / e.total))
        },
        cancelToken: source.token,
      });
      // let percent = 0;
      stepCreateJob(1);
    } else if (previewCandidate && previewCandidate.length > 0) {
      // console.log('>>>upload candidate>>');
      for (let i = 0; i < previewCandidate.length; i++) {
        if (previewCandidate[i].originFileObj) {
          formData.append(`cv`, previewCandidate[i].originFileObj);
        }
      }
      uploadCV(jobId, formData, {
        onUploadProgress: e => {
          const percent = Math.round((100 * e.loaded) / e.total);
          console.log(`e.loaded2>>>>>`, percent);
          if (percent < 100) {
            percentUploadCandidate(percent);
          }
        },
        cancelToken: source.token,
      });
      stepCreateJob(1);
    } else if (listAdded && listAdded.length > 0) {
      // console.log('>>>add existing candidate>>');
      for (let i = 0; i < listAdded.length; i++) {
        if (listAdded[i]?.key) {
          formData.append(`candidate_id_list[]`, listAdded[i].id);
        }
      }
      uploadCV(jobId, formData, {
        onUploadProgress: e => {
          const percent = Math.round((100 * e.loaded) / e.total);
          console.log(`e.loaded3 >>>>>`, percent);
          if (percent < 100) {
            percentUploadCandidate(percent);
          }
        },
        cancelToken: source.token,
      });
      stepCreateJob(1);
    } else {
      return;
    }

    // for (var pair of formData.entries()) {
    //   console.log(pair);
    // }
  };
  // console.log('cv>>', previewCandidate);

  const handleCancel = useCallback(() => {
    cleanUpAddExistCandidate();
    cleanStepCreateJob();
    cleanUploadCVCandidate();
    source.cancel();
  }, []);

  // console.log('>>percent',percent);

  const checkListButton = () => {
    if (
      (previewCandidate && previewCandidate.length !== 0) ||
      (listAdded && listAdded.length !== 0)
    ) {
      return (
        <ButtonCustom
          onClick={() => {
            uploadCandidateCV();
            // listAdded && listAdded.length !== 0 && addCandidateExisting();
          }}
          className="btn-primary-gradient"
          disabled={props.locked}
        >
          <FormattedMessage {...messages.letGo} />
        </ButtonCustom>
      );
    } else {
      return <div />;
    }
  };

  // const switchCandidateExisting = step => {
  //   return previewCandidate && previewCandidate.length !== 0 ? (
  //     <div />
  //   ) : (
  //     <AddExistsCandidate {...props} step={step} />
  //   );
  // };

  switch (props.step) {
    case 1:
      return (
        <>
          <Row
            gutter={[8, 8]}
            width="100%"
            justify="space-between"
            align="middle"
          >
            <Col>
              {/* {switchCandidateExisting()} */}
              <AddExistsCandidate {...props} />
            </Col>
            <Col>{checkListButton()}</Col>
          </Row>
        </>
      );
    case 2:
      return (
        <>
          <Row gutter={[8, 8]} justify="end" align="middle">
            <Col />
            <Col>
              <ButtonCustom
                onClick={() => handleCancel()}
                className="btn-danger"
                disabled={props.locked}
              >
                <FormattedMessage {...messages.cancel} />
              </ButtonCustom>
            </Col>
          </Row>
        </>
      );
    case 3:
      return (
        <>
          <Col />
          <Col>
            <Row gutter={[8, 8]} justify="end" align="middle">
              <Col>
                <ButtonCustom
                  onClick={() => setTryAgain(true)}
                  className="btn-default-outline btn-table-parsed"
                  disabled={props.locked}
                >
                  <FormattedMessage {...messages.tryAgain} />
                </ButtonCustom>
              </Col>
              <Col>
                <ButtonCustom
                  // disabled={statusParseCv}
                  onClick={() => {
                    push(`/job-dashboard/${jobId}`);
                    cleanStepCreateJob();
                  }}
                  className="btn-primary-gradient btn-table-parsed"
                >
                  <FormattedMessage {...messages.next} />
                </ButtonCustom>
              </Col>
            </Row>
          </Col>
          <CombinedCustom
            width={600}
            toggleModal={tryAgain}
            title={`Are you sure?`}
            content={`Trying again will remove the parsed resumes below. Please be mindful of your CV parsing credits. Or you can simply edit these fields on the next screen.`}
            footer={[
              <Row gutter={[8, 8]} justify="center" align="middle">
                <Col>
                  <ButtonCustom
                    className="btn-default-outline btn-120-40"
                    onClick={() => {
                      setTryAgain(false);
                    }}
                  >
                    {`Cancel`}
                  </ButtonCustom>
                </Col>
                <Col>
                  <ButtonCustom
                    className="btn-primary-gradient btn-120-40"
                    onClick={() => {
                      setTryAgain(false);
                      handleCancel();
                    }}
                  >
                    {`Try Again`}
                  </ButtonCustom>
                </Col>
              </Row>,
            ]}
          />
        </>
      );
    default:
      return <></>;
  }
};

const mapStateToProps = createStructuredSelector({
  listAdded: makeSelectCandidateExistsPreview(),
  addExistingResult: makeSelectAddExistingResult(),
  addExistingLoad: makeSelectAddExistingLoading(),
  percent: makeSelectPercentAddCandidate(),
  previewCandidate: makeSelectCandidatePreview(),
  percentUploadCv: makeSelectPercentUploadCandidate(),
  uploadCandidateCvSuccess: makeSelectCandidateUploadSuccess(),
  isCancelled: makeSelectCancellingUpload(),
  statusParseCv: makeSelectStatusParseCv(),
});

const mapDispatchToProps = {
  addExistCandidate,
  percentAddCandidate,
  cleanUpAddExistCandidate,
  cleanStepCreateJob,
  push,
  uploadCV,
  cleanUploadCandidate,
  percentUploadCandidate,
  cleanUploadCVCandidate,
};

const withRouter = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withRouter,
  memo,
)(ButtonStep);
