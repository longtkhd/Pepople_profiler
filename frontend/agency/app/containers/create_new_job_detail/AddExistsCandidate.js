import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'antd';
import ButtonCustom from 'components/atoms/Button';
import messages from './messages';
import { PlusOutlined } from '@ant-design/icons';
import ModalCustom from 'components/ModalCustom';
import TableCustom from 'components/TableCustom';
import HeadingMedium from 'components/HeadingMedium';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getCandidates,
  cleanUpCandidates,
} from 'containers/common_provider/candidate_state/get_candidates/actions';
import { addCandidateToList } from 'containers/common_provider/candidate_state/add_candidate_to_list/actions';
import {
  makeSelectCandidateExistingLoading,
  makeSelectCandidateExistingResult,
} from 'containers/common_provider/candidate_state/get_candidates/selectors';
import {
  getShortlistedCandidate,
  cleanUpShortlistedCandidate,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/actions';
import {
  makeSelectShortlistedCandidateJobResult,
  makeSelectShortlistedCandidateJobLoading,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/selectors';
import { previewListCandidateExists } from 'containers/common_provider/candidate_state/upload_cv/actions';
import { makeSelectCandidateExistsPreview } from 'containers/common_provider/candidate_state/upload_cv/selectors';
import CombinedCustom from 'components/CombinedCustom';
import { tokenDecoded } from 'utils/authHelper';
import './styles.less';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <p>{text}</p>,
  },
  {
    title: 'Current position',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: 'Current employer',
    dataIndex: 'employer',
    key: 'employer',
  },
];

const AddExistsCandidate = props => {
  // console.log('>>propscandi',props);
  const {
    jobId,
    getCandidates,
    candidateExistResult,
    candidateExistLoad,
    cleanUpCandidates,
    step,
    getShortlistedCandidate,
    cleanUpShortlistedCandidate,
    candidateShortlistedExisting,
    candidateShortlistedLoad,
    previewListCandidateExists,
    candidatePreviewExists,
  } = props;

  const [toggleModal, setToggleModal] = useState(false);
  const [listChecked, setlistChecked] = useState(candidatePreviewExists);
  const [missingSelect, setMissingSelect] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState([]);

  // console.log('candidateShortlistedExisting>>',candidateShortlistedExisting);
  // console.log('candidatePreviewExists>>', candidatePreviewExists);

  const candidateExistsHardcoded = useMemo(() => {
    return (
      candidateExistResult &&
      candidateExistResult.map(candidate => ({
        id: candidate?.id,
        key: candidate?.id,
        uid: candidate?.id,
        name: candidate?.candidate_name,
        position: candidate?.current_position,
        employer: candidate?.current_employer,
      }))
    );
  }, [candidateExistResult]);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  const onSelectChange = useCallback(
    (selectedRowKeys, selectedRows) => {
      // console.log('selectedRows>>>>', selectedRows);
      // const [row] = selectedRows;
      // console.log(`rowObject>>`, row);
      // console.log('selectedRowKey>>>>', selectedRowKeys);
      setlistChecked(selectedRows);
      setSelectedRowKey(selectedRowKeys);
    },
    [selectedRowKey],
  );
  // console.log('>>',listChecked);
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKey,
    hideSelectAll: true,
    onChange: onSelectChange,
    getCheckboxProps: record => {
      const rowIndex = candidateShortlistedExisting?.findIndex(
        item => item.id === record.key,
      );
      // const rowSelected = candidatePreviewExists?.findIndex(
      //   item => item.uid === record.key,
      // );
      // console.log('rowSelected>>', rowSelected);
      return {
        disabled: rowIndex !== -1,
      };
    },
  };

  useEffect(() => {
    return () => {
      cleanUpCandidates();
      cleanUpShortlistedCandidate();
    };
  }, []);

  useEffect(() => {
    if (candidatePreviewExists && candidatePreviewExists.length === 0) {
      setSelectedRowKey([]);
    } else {
      const selectKeys = candidatePreviewExists.map(
        selectedKey => selectedKey.key,
      );
      setSelectedRowKey(selectKeys);
    }
  }, [candidatePreviewExists]);

  useEffect(() => {
    if (toggleModal) {
      getCandidates(infoAuth?.agency_id, {
        params: {
          paginate: true,
          page: 1,
          size: 1000,
        },
      });
      getShortlistedCandidate(jobId, {
        params: {
          paginate: false,
        },
      });
    }
    if (!toggleModal) {
      setlistChecked([]);
    }
    // getAsyncCandidates();
  }, [toggleModal, jobId]);

  const showModal = () => {
    setToggleModal(true);
  };
  // console.log('listChecked,',listChecked);

  const handleOk = useCallback(
    e => {
      if (listChecked && listChecked.length > 0) {
        // console.log(`List checked>>`, listChecked);
        previewListCandidateExists(listChecked);
        // addCandidateToList(listChecked);
        cleanUpCandidates();
        setToggleModal(false);
        // setSelectedRowKey([]);
      } else {
        setMissingSelect(true);
      }
      // alert(checkListExist);
    },
    [listChecked, toggleModal],
  );

  const handleCancel = useCallback(
    e => {
      setToggleModal(false);
      cleanUpCandidates();
      // setSelectedRowKey([]);
    },
    [toggleModal],
  );

  return (
    <>
      <CombinedCustom
        width={600}
        toggleModal={missingSelect}
        title={`Whoops, select a candidate`}
        content={`Please select one or more candidates before proceeding to the next step.`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                type="primary"
                className="btn-primary-gradient btn-77-40"
                onClick={() => {
                  setMissingSelect(false);
                }}
              >
                {`OK`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      {/* <ModalCustom
        width={1000}
        title={
          <HeadingMedium>
            <FormattedMessage {...messages.addCandidates} />
          </HeadingMedium>
        }
        showModal={showModal}
        toggleModal={toggleModal}
        handleOk={handleOk}
        handleCancel={handleCancel}
        wrapClassName={'vertical-center-modal'}
        footer={[
          <Row
            className={`footer-wrapper`}
            gutter={[8, 0]}
            justify="center"
            key="modal_existing_candidates"
          >
            <Col>
              <ButtonCustom
                case="static"
                className="btn-danger btn-77-40"
                onClick={handleCancel}
              >
                <FormattedMessage {...messages.cancel} />
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                className="btn-primary-gradient btn-77-40"
                onClick={handleOk}
              >
                <FormattedMessage {...messages.add} />
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
        btnName={
          <>
            <ButtonCustom
              className={`text-group text-w-800 text-size-14 ${
                step === 2 ? 'btn-secondary' : 'btn-default-outline'
              }`}
            >
              <PlusOutlined className="icon-btn" />
              <FormattedMessage {...messages.addCandidate} />
            </ButtonCustom>
          </>
        }
      >
        <TableCustom
          // getValues={setlistChecked}
          // isClosed={toggleModal}
          scroll={{ x: 768, y: 300 }}
          loading={candidateExistLoad}
          columns={columns}
          dataSource={candidateExistsHardcoded}
          className="table-checkbox-custom"
          pagination={false}
          rowKey={record => record.key}
          rowSelection={rowSelection}
        />
      </ModalCustom> */}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  candidateExistResult: makeSelectCandidateExistingResult(),
  candidateExistLoad: makeSelectCandidateExistingLoading(),
  candidateShortlistedExisting: makeSelectShortlistedCandidateJobResult(),
  candidateShortlistedLoad: makeSelectShortlistedCandidateJobLoading(),
  candidatePreviewExists: makeSelectCandidateExistsPreview(),
});

const mapDispatchToProps = {
  getCandidates,
  cleanUpCandidates,
  addCandidateToList,
  getShortlistedCandidate,
  cleanUpShortlistedCandidate,
  previewListCandidateExists,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withConnect,
  memo,
)(AddExistsCandidate);
