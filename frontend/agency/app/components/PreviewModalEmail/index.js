/**
 *
 * PreviewModalEmail
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonCustom from 'components/atoms/Button';
import { Input, Row, Col, Descriptions, Button, Title } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import messages from './messages';
import { InputOldCustom } from 'components/InputCustom';
import SelectCustom from 'containers/invite_client_email/selectCustomGetSelected';
import ModalCustom from 'components/ModalCustom';
import HeadingMedium from 'components/HeadingMedium';
import CloseButton from 'components/CloseButton';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { Form } from 'formik-antd';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import './styles.less';
import data from 'containers/invite_client_email/data.json';
import './styles.less';

// InlineEditor
//   .create(document.querySelector('#editor'), {
//   })
//   .then(editor => {
//     // console.log(editor)
//   })

//   .catch(error => {
//     // console.error(error);
//   });

const PreviewModal = props => {
  const {
    contentPreview,
    setFieldValue,
    handleSendMailPreviewCallBack,
    typeTemplate,
    name_template,
    lableContent,
  } = props;
  const [toggleModal, setToggleModal] = useState(false);
  const showModaltwo = () => {
    setToggleModal(true);
  };
  const handleCancel = e => {
    setToggleModal(false);
  };

  const options = useMemo(() => {
    let options = [];
    if (typeTemplate === 1) {
      options = [
        {
          value: 1,
          label: 'Client Invite',
        },
      ];
    } else {
      options = [
        {
          value: 2,
          label: 'Assessment Invite',
        },
      ];
    }
    return options;
  }, [typeTemplate]);

  const handleSendMailPreview = e => {
    handleSendMailPreviewCallBack();
    setToggleModal(false);
  };

  return (
    <ModalCustom
      className="custom-modal-request"
      style={{ borderRarius: '15px' }}
      width="800px"
      type="RequestModal"
      closable={true}
      closeIcon={<CloseButton />}
      title={<HeadingMedium>Preview {name_template} Template</HeadingMedium>}
      showModal={showModaltwo}
      toggleModal={toggleModal}
      handleCancel={handleCancel}
      // onSubmit={() => console.log('save')}
      footer={[
        <>
          <Row gutter={[8, 0]} justify="center">
            <Col />
          </Row>
        </>,
      ]}
      btnName={
        <>
          <Button
            icon={<EyeOutlined />}
            className="btn-default-outline button__save_template"
            type="button"
            style={{ width: '100%' }}
            onClick={() => console.log('a')}
          >
            <FormattedMessage {...messages.previewButtonIcon} />
          </Button>
        </>
      }
    >
      <Row>
        <Col xs={24} md={24} lg={24} xl={24}>
          <SelectCustom
            // fast={true}
            label="Type"
            name="typePreview"
            type="text"
            options={options}

            // onSelect={(selected) => setSelectedMail(selected)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={24} lg={24} xl={24}>
          <div className="content-editor" style={{ paddingTop: '30px' }}>
            {lableContent && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#888888',
                  marginBottom: '6px',
                }}
              >
                {lableContent}
              </div>
            )}

            <CKEditor
              // key={`resume_linked`}
              editor={ClassicEditor}
              label="Content"
              name="inviteContent"
              type="text"
              data={contentPreview || {}}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFieldValue('inviteContent', data);
              }}
            />
          </div>
        </Col>
      </Row>
      <ButtonCustom
        className="btn-primary-gradient button-submit-inside"
        type="button"
        onClick={handleSendMailPreview}
      >
        <FormattedMessage {...messages.previewButton} />
      </ButtonCustom>
      {/* </FormInfoDetail> */}
    </ModalCustom>
  );
};

export default memo(PreviewModal);
