/**
 *
 * EditEmailTemplate
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectEditEmailTemplate,
  makeSelectEditMailTemplateResponse,
  makeSelectEditMailTemplateError,
  makeSelectGetMailTemplateById,
} from './selectors';
import { editMailTemplateDefault, getMailTemplateByIdDefault } from './actions';
import reducer from './reducer';
import { Row, Col, Input } from 'antd';

import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import InputCustom from 'components/InputCustom';
import SelectCustom from 'components/SelectCustom';
import Button from 'components/atoms/Button';
import { openNotification } from 'utils/notification';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import './styles.less';
import { Form,  } from 'formik-antd';
import { Formik } from 'formik';
import Modal from 'antd/lib/modal/Modal';
import { ContentModal } from '../../components/modals/ContentModal';

export function EditEmailTemplate(props) {
  const {
    history,
    onGetMailTemplateInfo,
    mailTemplateInfo,
    onEditMailTemplate,
    editSuccess,
    editError,
  } = props;
  const templateId = props.match.params.id;
  const ckConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'horizontalLine',
        'blockQuote',
        'insertTable',
        'undo',
        'redo',
        'fontColor',
        'fontSize',
        'pageBreak',
        'underline',
      ],
    },
    language: 'en',
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  };
  const initialValues = {
    name: '',
    subject: '',
    type: '',
    content: '',
  };

  useInjectReducer({ key: 'editEmailTemplate', reducer });

  useEffect(() => {
    onGetMailTemplateInfo(templateId);
  }, []);

  useEffect(() => {
    if (editSuccess) {
      openNotification('success', 'Update email template success');
    }
    return () => {};
  }, [editSuccess]);

  useEffect(() => {
    if (editError) {
      openNotification('error', 'Update email template error');
    }
    return () => {};
  }, [editError]);

  const handleOk = values => {
    onEditMailTemplate(templateId, values);
  };

  const handleCancel = () => {
    Modal.confirm({
      centered: true,
      title: false,
      icon: false,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={'Are you sure?'}
          message={'All your changes will be canceled?'}
        />
      ),
      okText: 'Ok',
      onOk: function() {
        history.push('/recruiter-email-settings');
      },
    });
  }

  const options = [
    {
      value: 1,
      label: 'Client Invite',
    },
    {
      value: 2,
      label: 'Candidate Invite',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>EditEmailTemplate</title>
        <meta name="description" content="Description of EditEmailTemplate" />
      </Helmet>
      <div className="edit-email-template">
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>

        <MainLayout>
          <div className="pt-30">
            <Formik
              initialValues={mailTemplateInfo || initialValues}
              enableReinitialize
              onSubmit={values => handleOk(values)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form>
                    <Row
                      gutter={[
                        { xs: 16, sm: 16, md: 24, lg: 32 },
                        { xs: 16, sm: 16, md: 24, lg: 32 },
                      ]}
                    >
                      <Col xs={24} sm={12} md={12} lg={6}>
                        <InputCustom
                          styleformgroup={`mb- 20`}
                          label="Template Name"
                          name="name"
                          type="text"
                        />
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={4}>
                        <SelectCustom
                          styleformgroup={`mb-20`}
                          label="Type"
                          id="type"
                          name="type"
                          options={options}
                          defaultValue={1}
                        />
                      </Col>

                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={10}
                        xl={24}
                        className={`action-button`}
                      >
                        <Row
                          justify="space-between"
                          align="middle"
                          className={'action'}
                        >
                          <Col lg={8} sm={10} md={10} xl={10} xs={10}>
                            <Button
                              className="btn-hotpink-outline w-150 "
                              type="button"
                              onClick={handleCancel}
                            >
                              {' '}
                              Cancel
                            </Button>
                          </Col>
                          <Col lg={8} sm={10} md={10} xl={10} xs={10}>
                            <Button
                              className="btn-primary-gradient w-150"
                              type="submit"
                            >
                              {' '}
                              Save
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      justify="start"
                      gutter={[
                        { xs: 8, sm: 16, md: 24, lg: 32 },
                        { xs: 8, sm: 16, md: 24, lg: 32 },
                      ]}
                    >
                      <Col xs={24} sm={12} md={12} lg={24}>
                        <InputCustom
                          styleformgroup={`mb- 20`}
                          label="Subject"
                          name="subject"
                          type="text"
                        />
                      </Col>
                    </Row>
                    <Row
                      justify="start"
                      gutter={[
                        { xs: 8, sm: 16, md: 24, lg: 32 },
                        { xs: 8, sm: 16, md: 24, lg: 32 },
                      ]}
                    >
                      <Col className="form-ant-group" lg={24}>
                        <label class="form-ant-label" for="content">
                          Content
                        </label>
                        <div className="myaccount-editor">
                          <CKEditor
                            key={`resume_linked`}
                            editor={ClassicEditor}
                            config={ckConfig}
                            label="Content"
                            name="content"
                            type="text"
                            onReady={editor => {
                              if (editor) {
                                const data = editor?.getData();
                                setFieldValue('content', data);
                              }
                            }}
                            data={mailTemplateInfo?.content || {}}
                            onChange={(event, editor) => {
                              const data = editor?.getData();
                              setFieldValue('content', data);
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row />
                  </Form>
                );
              }}
            </Formik>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}

EditEmailTemplate.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editEmailTemplate: makeSelectEditEmailTemplate(),
  mailTemplateInfo: makeSelectGetMailTemplateById(),
  editSuccess: makeSelectEditMailTemplateResponse(),
  editError: makeSelectEditMailTemplateError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetMailTemplateInfo: id => dispatch(getMailTemplateByIdDefault(id)),
    onEditMailTemplate: (id, data) =>
      dispatch(editMailTemplateDefault(id, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(EditEmailTemplate);
