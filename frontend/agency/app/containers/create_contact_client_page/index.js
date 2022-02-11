/**
 *
 * CreateContactClientPage
 *
 */

import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  addContactToClient,
  cleanCreateContact,
} from 'containers/common_provider/client_state/create_contact_client/actions';
import {
  getClientDetailInfo,
  cleanClientDetail,
} from 'containers/common_provider/client_state/client_detail_info/actions';
import {
  makeSelectCreateContactClientLoad,
  makeSelectCreateContactClientResult,
} from 'containers/common_provider/client_state/create_contact_client/selectors';
import {
  makeSelectClientDetailInfoLoad,
  makeSelectClientDetailInfoResult,
} from 'containers/common_provider/client_state/client_detail_info/selectors';

import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonBack from 'components/ButtonBack';
import InputCustom from 'components/InputCustom';
import ButtonCustom from 'components/atoms/Button';
import ActionType from 'components/TableCustom/ActionType';
import CombinedCustom from 'components/CombinedCustom';

import { Row, Col, Button } from 'antd';
import { Formik, FieldArray } from 'formik';
import { Form } from 'formik-antd';
import * as Yup from 'yup';
import SelectIndustry from 'containers/reuse_component/SelectIndustry';
import CheckEventForm from './CheckEventForm';

import './styles.less';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
  contactList: Yup.array().of(
    Yup.object().shape({
      first_name: Yup.string()
        // .trim('Please remove whitespace')
        // .strict(true)
        .min(2, 'Too short')
        .required('Please enter First Name'),
      last_name: Yup.string()
        // .trim('Please remove whitespace')
        // .strict(true)
        .min(2, 'Too short')
        .required('Please enter Last Name'),
      contact_number: Yup.string()
        // .trim('Please remove whitespace')
        // .strict(true)
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(2, 'Too short')
        .required('Please enter Contact Number'),
      email: Yup.string()
        // .trim('Please remove whitespace')
        // .strict(true)
        .email('Email is not valid')
        .required('Please enter Email'),
    }),
  ),
});

const initValues = {
  contactList: [
    {
      first_name: '',
      last_name: '',
      contact_number: '',
      email: '',
    },
  ],
};

export function CreateContactClientPage(props) {
  const {
    history,
    match,
    createContactLoad,
    createContactResult,
    addContactToClient,
    cleanCreateContact,
    clientDetailLoad,
    clientDetailResult,
    getClientDetailInfo,
    cleanClientDetail,
  } = props;

  const [isCreate, setIsCreate] = useState(false);

  const clientId = useMemo(() => {
    return match?.params?.clientId;
  }, [match]);

  const onFinish = values => {
    const { contactList } = values;
    const payload = {
      contact_list: contactList,
    };
    addContactToClient(clientId, payload);
  }

  useEffect(() => {
    clientId && getClientDetailInfo(clientId);
  }, [clientId]);

  useEffect(() => {
    if (createContactResult?.success) {
      setIsCreate(true);
      cleanCreateContact();
    }
  }, [createContactResult]);

  useEffect(() => {
    return () => {
      cleanClientDetail();
      cleanCreateContact();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>CreateContactClientPage</title>
        <meta
          name="description"
          content="Description of CreateContactClientPage"
        />
      </Helmet>
      <CombinedCustom
        width={500}
        toggleModal={isCreate}
        title={`Add contact successfully`}
        isSuccess={true}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                onClick={() => {
                  setIsCreate(false);
                  history.goBack();
                }}
                className={`btn-primary-gradient w-120`}
              >
                {`OK`}
              </ButtonCustom>
            </Col>

            <Col>
              <ButtonCustom
                onClick={() => {
                  setIsCreate(false);
                }}
                className={`btn-default-outline w-120`}
              >
                {`Add More`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <MainLayout>
        <ButtonBack history={history} />
        <Formik
          initialValues={initValues}
          validationSchema={schema}
          onSubmit={onFinish}
        >
          {({ values }) => {
            return (
              <Form>
                <FormInfoDetail title={`Client Information`}>
                  <Row className={`wrapper-client-info`} gutter={[16, 8]}>
                    <Col>
                      <InputCustom
                        fast={true}
                        label={
                          <span
                            className={`text-group text-gray-2`}
                          >{`Business Name`}</span>
                        }
                        name="businessName"
                      />
                      <h3
                        className={`text-group text-black-1 text-w-800 text-size-18`}
                      >
                        {clientDetailResult?.data?.business_name}
                      </h3>
                    </Col>
                    <Col>
                      <SelectIndustry
                        fast={true}
                        label={
                          <span
                            className={`text-group text-gray-2`}
                          >{`Industry`}</span>
                        }
                        name="industry"
                        placeholder={`Please select an industry`}
                      />
                      <h3
                        className={`text-group text-black-1 text-w-800 text-size-18`}
                      >
                        {clientDetailResult?.data?.industry}
                      </h3>
                    </Col>
                  </Row>
                </FormInfoDetail>
                <FormInfoDetail title={`Contacts`}>
                  <div className="client-wrapper">
                    <FieldArray name="contactList">
                      {({ push, remove }) => (
                        <>
                          <div className={`scroll-auto`}>
                            <div>
                              <Row
                                className={`client-wrapper-title`}
                                gutter={32}
                                justify="space-between"
                              >
                                <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                  <div>{`First Name`}</div>
                                </Col>
                                <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                  <div>{`Last Name`}</div>
                                </Col>
                                <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                  <div>{`Contact Number`}</div>
                                </Col>
                                <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                  <div>{`Email`}</div>
                                </Col>
                                <Col xs={12} sm={12} md={4} xl={4} xxl={4}>
                                  <div>{`Actions`}</div>
                                </Col>
                              </Row>
                            </div>
                            {values?.contactList &&
                              values?.contactList?.map((client, index) => (
                                <div key={index}>
                                  <Row
                                    style={{alignItems:'flex-start'}}
                                    gutter={32}
                                    justify="space-between"
                                    align="middle"
                                    className={`client-wrapper-list`}
                                  >
                                    <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                      <Form.Item
                                        hasFeedback={true}
                                        showValidateSuccess={true}
                                        name={`contactList[${index}].first_name`}
                                        className={`client-item `}
                                      >
                                        <InputCustom
                                          fast={true}
                                          bgwhite={`true`}
                                          name={`contactList[${index}].first_name`}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                      <Form.Item
                                        hasFeedback={true}
                                        showValidateSuccess={true}
                                        name={`contactList[${index}].last_name`}
                                        className={`client-item `}
                                      >
                                        <InputCustom
                                          fast={true}
                                          bgwhite={`true`}
                                          name={`contactList[${index}].last_name`}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                      <Form.Item
                                        hasFeedback={true}
                                        showValidateSuccess={true}
                                        name={`contactList[${index}].contact_number`}
                                        className={`client-item `}
                                      >
                                        <InputCustom
                                          fast={true}
                                          bgwhite={`true`}
                                          name={`contactList[${index}].contact_number`}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12} sm={12} md={5} xl={5} xxl={5}>
                                      <Form.Item
                                        hasFeedback={true}
                                        showValidateSuccess={true}
                                        name={`contactList[${index}].email`}
                                        className={`client-item `}
                                      >
                                        <InputCustom
                                          fast={true}
                                          bgwhite={`true`}
                                          name={`contactList[${index}].email`}
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col
                                      className={`wrapper-group-action`}
                                      style={{ display: 'flex' }}
                                      xs={12}
                                      sm={12}
                                      md={4}
                                      xl={4}
                                      xxl={4}
                                    >                                    
                                       {!values?.contactList || values?.contactList.length === 1 ? (
                                        <ActionType
                                          type="add"
                                          onClick={() => {
                                            push({
                                              first_name: '',
                                              last_name: '',
                                              contact_number: '',
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
                                              contact_number: '',
                                              email: '',
                                            });
                                          }}
                                        />
                                        <ActionType
                                          onClick={() => remove(index)}
                                          type="delete"
                                        />
                                      </>
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
                    {/* <Form.Item> */}
                    {/* <ButtonCustom className={`btn btn-outline-primary w-180`}> */}
                    <ButtonCustom
                      className={`btn-default-outline w-180`}
                      case="static"
                      onClick={() => history.goBack()}
                    >
                      {`Cancel`}
                    </ButtonCustom>
                    {/* </ButtonCustom> */}
                    {/* </Form.Item> */}
                  </Col>
                  <Col>
                    {/* <Form.Item> */}
                    <ButtonCustom
                      className={`btn btn-primary-gradient w-180`}
                      type="submit"
                    >
                      {`Create`}
                    </ButtonCustom>
                    {/* </Form.Item> */}
                  </Col>
                </Row>
                <CheckEventForm createContat={createContactResult} />
              </Form>
            );
          }}
        </Formik>
      </MainLayout>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  createContactLoad: makeSelectCreateContactClientLoad(),
  createContactResult: makeSelectCreateContactClientResult(),
  clientDetailLoad: makeSelectClientDetailInfoLoad(),
  clientDetailResult: makeSelectClientDetailInfoResult(),
});
const mapDispatchToProps = {
  addContactToClient,
  cleanCreateContact,
  getClientDetailInfo,
  cleanClientDetail,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateContactClientPage);
