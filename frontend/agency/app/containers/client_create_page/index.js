/**
 *
 * ClientCreatePage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectClientCreatePage, {
  makeSelectClientCreatedResult,
  makeSelectCreateSuccess,
} from './selectors';
import reducer from './reducer';
import { createClient, cleanUp } from './actions';

import messages from './messages';
import { Row, Col } from 'antd';
import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonBack from 'components/ButtonBack';
import InputCustom from 'components/InputCustom';
import ButtonCustom from 'components/atoms/Button';
import ActionType from 'components/TableCustom/ActionType';
import { pushNotify } from 'utils/notify';
import { Formik, FieldArray } from 'formik';
import { Form } from 'formik-antd';
import * as Yup from 'yup';
import SelectIndustry from 'containers/reuse_component/SelectIndustry';
import './styles.less';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
  businessName: Yup.string()
    // .trim('Please remove whitespace')
    // .strict(true)
    .min(2, 'Too short')
    .required('Please enter Business Name'),
  industry: Yup.string()
    // .trim('Please remove whitespace')
    // .strict(true)
    .required('Please enter Industry'),
  contactList: Yup.array().of(
    Yup.object().shape({
      first_name: Yup.string()
        // .trim('Please remove whitespace')
        // .strict(true)
        .min(2, 'Too short')
        .required('Please enter first name'),
      last_name: Yup.string()
        // .trim('Please remove whitespace')
        // .strict(true)
        .min(2, 'Too short')
        .required('Please enter last name'),
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
  businessName: '',
  industry: '',
  contactList: [
    {
      first_name: '',
      last_name: '',
      contact_number: '',
      email: '',
    },
  ],
};

export function ClientCreatePage(props) {
  useInjectReducer({ key: 'clientCreatePage', reducer });
  const {
    history,
    createClient,
    createSuccess,
    cleanUp,
    clientCreatedResult,
  } = props;

  const onFinish = (values, { resetForm }) => {
    const { businessName, industry, contactList } = values;
    const payload = {
      business_name: businessName,
      industry,
      contact_list: contactList,
    };
    createClient(payload);
    resetForm();
  };

  useEffect(() => {
    if (clientCreatedResult?.success) {
      history.push(`/client-detail/${clientCreatedResult?.data?.id}`);
      pushNotify({
        type: 'success',
        message: <FormattedMessage  {...messages.createClientSuccess} />,
      });
    }
  }, [clientCreatedResult?.success]);

  useEffect(() => {
    return () => cleanUp();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Create New Client</title>
        <meta name="description" content="Description of ClientCreatePage" />
      </Helmet>
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
                <FormInfoDetail
                  title={<FormattedMessage {...messages.clientInfo} />}
                >
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <Form.Item
                        className={`wrapper-group-input-ant`}
                        name="businessName"
                        hasFeedback={true}
                        showValidateSuccess={true}
                      >
                        <InputCustom
                          fast={true}
                          label={<FormattedMessage {...messages.username} />}
                          name="businessName"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <Form.Item
                        className={`wrapper-group-input-ant`}
                        name="industry"
                        hasFeedback={true}
                        showValidateSuccess={true}
                      >
                        <SelectIndustry
                          fast={true}
                          label={<FormattedMessage {...messages.industry} />}
                          name="industry"
                          placeholder={`Please select an industry`}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </FormInfoDetail>
                <FormInfoDetail
                  title={<FormattedMessage {...messages.contacts} />}
                >
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
                                      md={2}
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
                    <ButtonCustom
                      className={`btn-default-outline w-180`}
                      case="static"
                      onClick={() => history.goBack()}
                    >
                      <FormattedMessage {...messages.cancel} />
                    </ButtonCustom>
                  </Col>
                  <Col>
                    <ButtonCustom
                      className={`btn btn-primary-gradient w-180`}
                      type="submit"
                    >
                      <FormattedMessage {...messages.create} />
                    </ButtonCustom>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </MainLayout>
    </div>
  );
}

ClientCreatePage.propTypes = {
  createClient: PropTypes.func.isRequired,
  cleanUp: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  clientCreatePage: makeSelectClientCreatePage(),
  createSuccess: makeSelectCreateSuccess(),
  clientCreatedResult: makeSelectClientCreatedResult(),
});

const mapDispatchToProps = {
  createClient,
  cleanUp,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClientCreatePage);
