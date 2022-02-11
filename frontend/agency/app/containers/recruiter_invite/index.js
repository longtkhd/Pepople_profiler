/**
 *
 * RecruiterInvite
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectChargesInviteError,
  makeSelectChargesInviteLoading,
  makeSelectChargesInviteSuccess,
  makeSelectRecruiterInviteList,
  makeSelectRecruiterInviteLoad,
  makeSelectRecruiterInviteMessage,
  makeSelectRecruiterInviteError,
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonBack from 'components/ButtonBack';
import TitleField from './TitleField';
import { Row, Col } from 'antd';
import InputCustom from 'components/InputCustom';
import { Formik, FieldArray } from 'formik';
import { Form } from 'formik-antd';
import ActionType from 'components/TableCustom/ActionType';
import ButtonCustom from 'components/atoms/Button';
import {
  inviteRecruiter,
  cleanUpData,
  onChargesInviteAtion,
  cleanChargesInviteAction,
} from './actions';
import SpinnerLoading from 'components/SpinnerLoading';
import { tokenDecoded } from 'utils/authHelper';
import CombinedCustom from 'components/CombinedCustom';
import * as Yup from 'yup';
import './styles.less';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
  recruiterList: Yup.array().of(
    Yup.object().shape({
      first_name: Yup.string()
        .min(2, 'Too short')
        .required('Please enter First Name'),
      last_name: Yup.string()
        .min(2, 'Too short')
        .required('Please enter Last Name'),
      phone_number: Yup.string()
        .matches(phoneRegExp, 'Phone Number is not valid')
        .min(2, 'Too short')
        .required('Please enter Phone Number'),
      job_title: Yup.string()
        .min(2, 'Too short')
        .required('Please enter Job Title'),
      email: Yup.string()
        .email('Email is not valid')
        .required('Please enter Email'),
    }),
  ),
});

export function RecruiterInvite(props) {
  useInjectReducer({ key: 'recruiterInvite', reducer });
  const {
    inviteRecruiter,
    cleanUpData,
    recruiterInviteResult,
    recruiterInviteLoad,
    recruiterInvitedError,
    chargesInvited,
    chargesError,
    chargesLoading,
    onChargesInviteAtion,
    cleanChargesInviteAction,
    history,
  } = props;

  const initValue = {
    recruiterList: [
      {
        first_name: '',
        last_name: '',
        phone_number: '',
        job_title: '',
        email: '',
      },
    ],
  };

  const [toggleModal, setToggleModal] = useState(false);
  const [flagInviteMore, setFlagInviteMore] = useState(false);
  const [notifyContent, setNotifyContent] = useState({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowChargesConfirm, setIsShowChargesConfirm] = useState(false);
  const [infoCharges, setInfoCharges] = useState();
  const [isHideInviteMore, setIsHideInviteMore] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') || null;
  }, [tokenDecoded]);

  useEffect(() => {
    return () => {
      cleanUpData();
      cleanChargesInviteAction();
    };
  }, []);

  useEffect(() => {
    if (recruiterInviteResult && recruiterInviteResult?.success) {
      const isValid = recruiterInviteResult.data.some(u => {
        return u?.invite_result_code === 'existed_user'
      })
      if (isValid) {
        setNotifyContent({
          title: 'This email already has an active profile in our system!',
          content: `Please check the email address or resend the invite again`,
        });
        setToggleModal(true);
        setIsHideInviteMore(true);
      } else {
        setNotifyContent({
          title: 'Nice work! Invitations sent.',
          content: `The next step is for your employees
            to accept the invite and confirm their profile.
            As the agency administrator, you can manage users any
            time within the Employee List.
            `,
        });
        setToggleModal(true);
        setFlagInviteMore(false);
        setIsSuccess(true);
      }
    }
  }, [recruiterInviteResult]);

  useEffect(() => {
    if (chargesInvited) {
      setToggleModal(true);
      setNotifyContent({
        title: 'Notification',
        content:
          'Payment is successful, now you can invite more recruiters to the system.',
      });
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

  useEffect(() => {
    if (recruiterInvitedError) {
      if (recruiterInvitedError?.message) {
        if (recruiterInvitedError.message === 'max_recruiter_error') {
          setNotifyContent({
            title: 'User limit has been reached!',
            content:
              'The user limit in your selected subscription plan has been reached. Please upgrade your subscription to a higher plan to continue inviting new users.',
          });
          setToggleModal(true);
          setIsHideInviteMore(true);
        }
        if (recruiterInvitedError.message === 'subscription_not_found') {
          setNotifyContent({
            title: 'Subscription plan not found!',
            content:
              'You have not subscribed to the plan, please subscribe plan for inviting more people.',
          });
          setToggleModal(true);
        }
        if (recruiterInvitedError.message === 'subscription_not_payment') {
          setNotifyContent({
            title: 'Error',
            content:
              'Your subscription plan is not paid yet! Please pay before invite recruiter',
          });
          setToggleModal(true);
        }
        if (recruiterInvitedError.message === 'error_recruiter_need_charges') {
          setNotifyContent({
            title: 'Notification',
            content: `You have invited more than
                      ${recruiterInvitedError?.payload?.recruiters} accounts
                      in the
                      number of recruiters in your agency,
                      to register more you must pay a fee of
                      AUD $${recruiterInvitedError?.payload?.amountBeforeTax} + GTS. \n
                      Do you agree to this term ?`,
          });
          setInfoCharges(recruiterInvitedError?.payload);
          setIsShowChargesConfirm(true);
        }
      }
    }
  }, [recruiterInvitedError]);

  useEffect(() => {
    const loading = recruiterInviteLoad || chargesLoading;
    setIsLoading(loading);
  }, [chargesLoading, recruiterInviteLoad]);

  const onFinish = values => {
    const payload = {
      recruiter_list: values?.recruiterList,
    };
    inviteRecruiter(infoAuth?.agency_id, payload);
  };

  const inviteMore = () => {
    setToggleModal(false);
    setFlagInviteMore(true);
    setIsSuccess(false);
    cleanUpData();
  };

  const handleOpen = () => {
    setToggleModal(true);
  };

  const handleChargesInvite = () => {
    if (!infoCharges || !infoAuth?.agency_id) return;
    onChargesInviteAtion(infoAuth?.agency_id, infoCharges);
    setIsShowChargesConfirm(false);
  };

  const switchCaseAction = useCallback(
    (index, values, remove, push) => {
      if (!recruiterInviteResult?.success) {
        return (
          <Row>
            <Col 
             style={{ display: 'flex' }}
            >
              {!values?.recruiterList || values?.recruiterList.length === 1 ? (
                <ActionType
                  type="add"
                  onClick={() => {
                    push({
                      first_name: '',
                      last_name: '',
                      phone_number: '',
                      job_title: '',
                      email: '',
                    });
                  }}
                />
              ) : (<>
                <ActionType
                  type="add"
                  onClick={() => {
                    push({
                      first_name: '',
                      last_name: '',
                      phone_number: '',
                      job_title: '',
                      email: '',
                    });
                  }}
                />
                <ActionType onClick={() => remove(index)} type="delete" />
              </>

              )}
            </Col>
          </Row>
        );
      }
      if (recruiterInviteResult?.data[index]?.invite_result_code === 'ok') {
        if (recruiterInviteResult?.data[index]?.id) {
          return (
            <Row>
              <Col>
                <div className={`invited`}>{`Invited`}</div>
              </Col>
            </Row>
          )
        }
        return (
          <Row>
            <Col 
            style={{ display: 'flex' }}>
              {!values?.recruiterList || values?.recruiterList.length === 1 ? (
                
                <ActionType
                  type="add"
                  onClick={() => {
                    push({
                      first_name: '',
                      last_name: '',
                      phone_number: '',
                      job_title: '',
                      email: '',
                    });
                  }}
                />
              ) : (<>
                <ActionType
                  type="add"
                  onClick={() => {
                    push({
                      first_name: '',
                      last_name: '',
                      phone_number: '',
                      job_title: '',
                      email: '',
                    });
                  }}
                />
                <ActionType onClick={() => remove(index)} type="delete" />
              </>

              )}
            </Col>
          </Row>
        )
      }
      if (recruiterInviteResult?.data[index]?.invite_result_code === 'internal_server_error') {
        return (
          <Row>
            <Col>
              <div className={`invite-danger`}>{`Invite unsuccessfully`}</div>
            </Col>
          </Row>
        );
      }
      if (recruiterInviteResult?.data[index]?.invite_result_code === 'existed_user') {
        if (values?.recruiterList[index]?.email !== recruiterInviteResult?.data[index]?.email) {
          return (
            <Row>
              <Col  style={{ display: 'flex' }}
                                    >
                {!values?.recruiterList || values?.recruiterList.length === 1 ? (
                  <ActionType
                    type="add"
                    onClick={() => {
                      push({
                        first_name: '',
                        last_name: '',
                        phone_number: '',
                        job_title: '',
                        email: '',
                      });
                    }}
                  />
                ) : (<>
                  <ActionType
                    type="add"
                    onClick={() => {
                      push({
                        first_name: '',
                        last_name: '',
                        phone_number: '',
                        job_title: '',
                        email: '',
                      });
                    }}
                  />
                  <ActionType onClick={() => remove(index)} type="delete" />
                </>

                )}
              </Col>
            </Row>
          )
        } else {
          return (
            <Row>
              <Col>
                <div className={`invite-danger`}>{`Email already exists`}</div>
              </Col>
            </Row>
          )
        }
      }
    },
    [recruiterInviteResult, flagInviteMore],
  );

  return (
    <MainLayout>
      {isLoading && <SpinnerLoading loading={isLoading} />}
      <ButtonBack history={history} />

      <Formik
        initialValues={initValue}
        onSubmit={onFinish}
        validationSchema={schema}
      >
        {({ values, resetForm }) => (
          <>
            <Form>
              <FormInfoDetail
                title={<FormattedMessage {...messages.inviteRecruiter} />}
              >
                <div className="recruiter-wrapper">
                  <FieldArray name="recruiterList">
                    {({ push, remove }) => (
                      <>
                        <div className={`recruiter-wrapper-scroll`}>
                          <TitleField
                            fieldName={[
                              <FormattedMessage {...messages.firstName} />,
                              <FormattedMessage {...messages.lastName} />,
                              <FormattedMessage {...messages.contactNumber} />,
                              <FormattedMessage {...messages.jobTitle} />,
                              <FormattedMessage {...messages.email} />,
                              <FormattedMessage {...messages.action} />,
                            ]}
                          />

                          {values.recruiterList &&
                            values.recruiterList?.map((recruiter, index) => (
                              <div key={index} className={`recruiter-list`}>
                                <Row
                                  // key={index}
                                  gutter={[32, 0]}
                                  justify="space-between"
                                  align="center"
                                  className={`recruiter-row`}
                                >
                                  <Col xs={12} sm={4} md={4} xl={4} xxl={4}>
                                    <Form.Item
                                      hasFeedback={true}
                                      showValidateSuccess={true}
                                      name={`recruiterList[${index}].first_name`}
                                      className={`recruiter-item size-160`}
                                    >
                                      <InputCustom
                                        fast={true}
                                        bgwhite={`true`}
                                        name={`recruiterList[${index}].first_name`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={12} sm={4} md={4} xl={4} xxl={4}>
                                    <Form.Item
                                      hasFeedback={true}
                                      showValidateSuccess={true}
                                      name={`recruiterList[${index}].last_name`}
                                      className={`recruiter-item size-160`}
                                    >
                                      <InputCustom
                                        fast={true}
                                        bgwhite={`true`}
                                        name={`recruiterList[${index}].last_name`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={12} sm={4} md={4} xl={4} xxl={4}>
                                    <Form.Item
                                      hasFeedback={true}
                                      showValidateSuccess={true}
                                      name={`recruiterList[${index}].phone_number`}
                                      className={`recruiter-item size-160`}
                                    >
                                      <InputCustom
                                        fast={true}
                                        bgwhite={`true`}
                                        name={`recruiterList[${index}].phone_number`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={12} sm={4} md={4} xl={4} xxl={4}>
                                    <Form.Item
                                      hasFeedback={true}
                                      showValidateSuccess={true}
                                      name={`recruiterList[${index}].job_title`}
                                      className={`recruiter-item size-50`}
                                    >
                                      <InputCustom
                                        fast={true}
                                        bgwhite={`true`}
                                        name={`recruiterList[${index}].job_title`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={12} sm={5} md={5} xl={5} xxl={5}>
                                    <Form.Item
                                      hasFeedback={true}
                                      showValidateSuccess={true}
                                      name={`recruiterList[${index}].email`}
                                      className={`recruiter-item size-250`}
                                    >
                                      <InputCustom
                                        fast={true}
                                        bgwhite={`true`}
                                        name={`recruiterList[${index}].email`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    className={`wrapper-group-action`}
                                    xs={12}
                                    sm={4}
                                    md={4}
                                    xl={4}
                                    xxl={4}
                                  >
                                    {/* {isInvited} */}
                                    {switchCaseAction(
                                      index,
                                      values,
                                      remove,
                                      push,
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </FieldArray>
                </div>
              </FormInfoDetail>
              <Row justify="end" gutter={[16, 16]}>
                <Col>
                  <ButtonCustom
                    case="static"
                    onClick={() => history.goBack()}
                    className={`btn-default-outline w-180`}
                  >
                    <FormattedMessage {...messages.cancel} />
                  </ButtonCustom>
                </Col>
                <Col>
                  <ButtonCustom
                    className={`btn btn-primary-gradient w-180`}
                    type="submit"
                  >
                    <FormattedMessage {...messages.invite} />
                  </ButtonCustom>
                </Col>
              </Row>
              <CombinedCustom
                width={500}
                toggleModal={toggleModal}
                isSuccess={isSuccess}
                showModal={handleOpen}
                title={notifyContent?.title}
                content={notifyContent?.content}
                footer={[
                  <Row gutter={[8, 0]}>
                    <Col>
                      <ButtonCustom
                        onClick={() => {
                          setToggleModal(false);
                          setIsSuccess(false);
                        }}
                        className={`btn-primary-gradient w-120`}
                      >
                        {`OK`}
                      </ButtonCustom>
                    </Col>
                    <Col>
                      {!isHideInviteMore && (
                        <ButtonCustom
                          onClick={inviteMore}
                          className={`btn-default-outline w-120`}
                        >
                          {`Invite More`}
                        </ButtonCustom>
                      )}
                    </Col>
                  </Row>,
                ]}
              />
              {/* Modal confirm charges invite recruiter */}
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
                          resetForm();
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
            </Form>
          </>
        )}
      </Formik>
    </MainLayout>
  );
}

RecruiterInvite.propTypes = {
  inviteRecruiter: PropTypes.func.isRequired,
  cleanUpData: PropTypes.func.isRequired,
  chargesInvite: PropTypes.bool,
  chargesError: PropTypes.object,
  chargesLoading: PropTypes.bool,
  cleanChargesInviteAction: PropTypes.func,
  onChargesInviteAtion: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  message: makeSelectRecruiterInviteMessage(),
  recruiterInviteResult: makeSelectRecruiterInviteList(),
  recruiterInviteLoad: makeSelectRecruiterInviteLoad(),
  recruiterInvitedError: makeSelectRecruiterInviteError(),
  chargesLoading: makeSelectChargesInviteLoading(),
  chargesInvited: makeSelectChargesInviteSuccess(),
  chargesError: makeSelectChargesInviteError(),
});

const mapDispatchToProps = {
  inviteRecruiter,
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
)(RecruiterInvite);
