/**
 *
 * RecruiterInviteCsv
 *
 */

import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectRecruiterInviteCsv,
  makeSelectRecruiterInviteCsvError,
  makeSelectChargesInviteError,
  makeSelectChargesInviteLoading,
  makeSelectChargesInviteSuccess,
  makeSelectInviteSuccess,
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonBack from 'components/ButtonBack';
import ButtonCustom from 'components/atoms/Button';
import { Row, Col } from 'antd';
import { CSVReader } from 'react-papaparse';
import TableCustom from 'components/TableCustom';
import { tokenDecoded } from 'utils/authHelper';
import {
  inviteCSV,
  cleanUpData,
  cleanChargesInviteAction,
  onChargesInviteAtion,
} from './actions';
import SpinnerLoading from 'components/SpinnerLoading';
import { pushNotify } from 'utils/notify';
import CombinedCustom from 'components/CombinedCustom';
import './styles.less';

export function RecruiterInviteCsv(props) {
  useInjectReducer({ key: 'recruiterInviteCsv', reducer });
  const {
    inviteCSV,
    errorInvite,
    cleanUpData,
    chargesInvited,
    chargesError,
    chargesLoading,
    onChargesInviteAtion,
    cleanChargesInviteAction,
    recruiterInviteCsv: { recruiterList, inviteLoading },
    history,
  } = props;
  const [listRecruiter, setRecruiterList] = useState(null);
  const [fileCSV, setFileCSV] = useState(null);
  const [flagReset, setFlagReset] = useState(false);

  const [toggleModal, setToggleModal] = useState(false);
  const [notifyContent, setNotifyContent] = useState({});
  const [isShowChargesConfirm, setIsShowChargesConfirm] = useState(false);
  const [infoCharges, setInfoCharges] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') || null;
  }, [tokenDecoded]);

  const handleValidResult = (data) => {
    for(let i = 0; i < data?.length; i++){
      data[i]['status'] = 'Ready to invite'
      if(data[i]?.invite_result_code === 'existed_user'){
        data[i]['status'] = 'Email already exists'
      }
      if(data[i]?.invite_result_code === 'ok' && data[i]?.id){
        data[i]['status'] = 'Invited'
      }
      if(data[i]?.invite_result_code === 'internal_server_error'){
        data[i]['status'] = 'Invite unsuccessfully'
      }
    }
    setRecruiterList(data)
  }

  useEffect(() => {
    return () => cleanUpData();
  }, []);

  const onInviteCSV = () => {
    if (!fileCSV) {
      pushNotify({
        type: 'warning',
        message: `Please add a file csv.`,
      });
      return;
    }
    let formData = new FormData();
    formData.append('file', fileCSV);
    inviteCSV(infoAuth?.agency_id, formData);
  };

  useEffect(() => {
    if (recruiterList?.success === false) {
      setNotifyContent({
        title: `Oops, that won't work.`,
        content: `CSV File Invalid.`,
      });
      setToggleModal(true);
    }
    if (recruiterList?.success) {
      const isValid = recruiterList.data.some(u => {
        return u?.invite_result_code === 'existed_user'
      })
      if(isValid){
        setNotifyContent({
          title: 'This email already has an active profile in our system!',
          content: `Please check the email address or resend the invite again`,
        });
        setToggleModal(true);
        handleValidResult(recruiterList?.data)
      }else{
        setNotifyContent({
          title: 'Nice work! Invitations sent.',
          content: `The next step is for your employees
          to accept the invite and confirm their profile.
          As the agency administrator, you can manage users any
          time within the Employee List.
          `,
        });
        setToggleModal(true);
        handleValidResult(recruiterList?.data)
        setIsSuccess(true);
      }
    }
  }, [recruiterList]);

  useEffect(() => {
    if (errorInvite) {
      if (errorInvite?.message) {
        if (errorInvite.message === 'max_recruiter_error') {
          setNotifyContent({
            title: 'Max recruiter error!',
            content:
              'You subscription plan reached to max recruiter, please upgrade your subscription plan for inviting more people.',
          });
          setToggleModal(true);
        }
        if (errorInvite.message === 'subscription_not_found') {
          setNotifyContent({
            title: 'Subscription plan not found!',
            content:
              'You have not subscribed to the plan, please subscribe plan for inviting more people.',
          });
          setToggleModal(true);
        }
        if (errorInvite.message === 'subscription_not_payment') {
          setNotifyContent({
            title: 'Error',
            content:
              'Your subscription plan is not paid yet! Please pay before invite recruiter',
          });
          setToggleModal(true);
        }
        if (errorInvite.message === 'error_recruiter_need_charges') {
          setNotifyContent({
            title: 'Notification',
            content: `You have invited more than
                      ${errorInvite?.payload?.recruiters} accounts
                      in the
                      number of recruiters in your agency,
                      to register more you must pay a fee of
                      AUD $${errorInvite?.payload?.amount}. \n
                      Do you agree to this term ?`,
          });
          setInfoCharges(errorInvite?.payload);
          setIsShowChargesConfirm(true);
        }
      }
    }
  }, [errorInvite]);

  const handleChargesInvite = () => {
    if (!infoCharges || !infoAuth?.agency_id) return;
    onChargesInviteAtion(infoAuth?.agency_id, infoCharges);
    setIsShowChargesConfirm(false);
  };

  useEffect(() => {
    if (chargesInvited) {
      setNotifyContent({
        title: 'Notification',
        content:
          'Payment is successful, now you can invite more recruiters to the system.',
      });
      setIsShowChargesConfirm(true);
    }
  }, [chargesInvited]);

  useEffect(() => {
    if (chargesError) {
      setIsShowChargesConfirm(true);
      setNotifyContent({
        title: 'Notification',
        content: 'Payment has failed, please check your payment information.',
      });
    }
  }, [chargesError]);

  const columns = [
    {
      title: () => <FormattedMessage {...messages.firstName} />,
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: () => <FormattedMessage {...messages.lastName} />,
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: () => <FormattedMessage {...messages.email} />,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: () => <FormattedMessage {...messages.jobTitle} />,
      dataIndex: 'job_title',
      key: 'job_title',
    },
    {
      title: () => <FormattedMessage {...messages.contactNumber} />,
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'status',
      render: (_, record) => {
        return (
          <p>{record?.status}</p>
        )
      }
    },
  ];

  const handleOnDrop = (data, file) => {
    let convertList = [];
    if (
      file &&
      file.name &&
      file.name
        .split('.')
        .pop()
        .toLowerCase() !== 'csv'
    ) {
      pushNotify({
        type: 'warning',
        message: `CSV File Invalid`,
      });
      return;
    }
    setFileCSV(file);

    for (let i = 1; i < data.length - 1; i++) {
      const [first_name, last_name, email, job_title, phone_number] = data[
        i
      ].data;

      convertList.push({
        key: i,
        first_name,
        last_name,
        email,
        job_title,
        phone_number,
        status: 'Ready to invite'
      });
    }
    setRecruiterList(convertList);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data, file) => {
    setRecruiterList(data);
  };

  return (
    <MainLayout>
      {inviteLoading || chargesLoading && <SpinnerLoading loading={inviteLoading} />}
      <ButtonBack history={history} />
      <FormInfoDetail
        title={<FormattedMessage {...messages.inviteRecruiterCSV} />}
      >
        <CombinedCustom
          width={500}
          isSuccess={isSuccess}
          toggleModal={toggleModal}
          title={notifyContent?.title}
          content={notifyContent?.content}
          footer={[
            <Row gutter={[8, 0]}>
              <Col>
                <ButtonCustom
                  onClick={() => {
                    setToggleModal(false);
                    setIsSuccess(false);
                    // history.push('/recruiter-list');
                  }}
                  className={`btn-primary-gradient w-120`}
                >
                  {`OK`}
                </ButtonCustom>
              </Col>
            </Row>,
          ]}
        />
        {/*Modal confirm charges invite recruiter */}
        <CombinedCustom
          width={500}
          toggleModal={isShowChargesConfirm}
          showModal={() => setIsShowChargesConfirm(true)}
          title={notifyContent?.title}
          content={notifyContent?.content}
          footer={[
            <Row gutter={[8, 0]}>
              <Col>
                {chargesInvited || chargesError ? null : (
                  <ButtonCustom
                    onClick={handleChargesInvite}
                    className={`btn-primary-gradient w-120`}
                  >
                    {`Yes`}
                  </ButtonCustom>
                )}
              </Col>
              <Col>
                <ButtonCustom
                  onClick={() => {
                    setIsShowChargesConfirm(false);
                    cleanChargesInviteAction();
                  }}
                  className={
                    chargesInvited || chargesError
                      ? `btn-primary-gradient w-120`
                      : `btn-default-outline w-120`
                  }
                >
                  {chargesInvited || chargesError ? `OK` : `Cancel`}
                </ButtonCustom>
              </Col>
            </Row>,
          ]}
        />
        <CSVReader
          style={{
            dropFile: {
              width: 200,
            },
          }}
          onDrop={handleOnDrop}
          onError={handleOnError}
          addRemoveButton
          noProgressBar
          noDrag
          isReset={flagReset}
          removeButtonColor="#659cef"
          onRemoveFile={handleOnRemoveFile}
        >
          <span>{`Click to upload file .csv`}</span>
        </CSVReader>

        <div className={`data-wrapper`}>
          <TableCustom
            columns={columns}
            dataSource={listRecruiter}
            pagination={false}
            // rowKey={ row => row.email}
          />
        </div>
      </FormInfoDetail>
      <Row justify="end" gutter={[16, 16]}>
        <Col>
          <div>
            <ButtonCustom
              onClick={() => history.goBack()}
              className={`btn-default-outline w-180`}
            >
              <FormattedMessage {...messages.cancel} />
            </ButtonCustom>
          </div>
        </Col>
        <Col>
          <div>
            <ButtonCustom
              className={`btn btn-primary-gradient w-180`}
              onClick={onInviteCSV}
              type="button"
            >
              <FormattedMessage {...messages.invite} />
            </ButtonCustom>
          </div>
        </Col>
      </Row>
    </MainLayout>
  );
}

RecruiterInviteCsv.propTypes = {
  inviteCSV: PropTypes.func.isRequired,
  cleanUpData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruiterInviteCsv: makeSelectRecruiterInviteCsv(),
  errorInvite: makeSelectRecruiterInviteCsvError(),
  chargesLoading: makeSelectChargesInviteLoading(),
  chargesError: makeSelectChargesInviteError(),
  chargesInvited: makeSelectChargesInviteSuccess(),
  inviteSuccess: makeSelectInviteSuccess(),
});

const mapDispatchToProps = {
  inviteCSV,
  cleanUpData,
  onChargesInviteAtion,
  cleanChargesInviteAction,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruiterInviteCsv);
