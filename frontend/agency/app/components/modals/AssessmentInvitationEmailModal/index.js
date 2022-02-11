/**
 *
 * AssessmentInvitationEmailModal
 *
 */

import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import { Button, Form, Input, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './styles.less';

function AssessmentInvitationEmailModal(props) {
  const { title, onSubmit, onCancel, typeName, candidateName } = props;
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
						'underline'
      ]
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    }
  }
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  let assessmentTemplateInviteContent =
    '<p><strong>Hi {candidate_name},</strong><br> \
    As discussed, can you please complete this {assessment_type} assessment by clicking the link below.&nbsp;<br>\
    It should only take you 10 mins to complete.</p><p><br>\
    <a href="#">{assessment_type}</a><br><br><br>\
    Completing this assessment at your earliest convenience will assist us in progressing your application.</p>\
    <p>Please call me on +61 4 000 000 if you have any questions.</p>\
    <p>Regards,</p><p><br>Cameron Dunlop<br>Troocoo</p>';

  const mappedDataBody = useCallback(() => {
    const replaceCandidate = assessmentTemplateInviteContent.replaceAll(
      '{candidate_name}',
      candidateName || '{candidate_name}',
    );
    const result = replaceCandidate.replaceAll(
      '{assessment_type}',
      typeName || '{assessment_type}',
    );
    return result;
  }, [candidateName, typeName]);

  const onFinish = values => {
    if (!onSubmit) return;
    onSubmit(values);
  };

  return (
    <div>
      <Modal
        className="modal-assessment-invite"
        centered
        visible={true}
        onCancel={handleCancel}
        title={`Send [${title}]`}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={form.submit}
        okText={'Send'}
      >
        <Form
          layout="vertical"
          form={form}
          preserve={false}
          onFinish={onFinish}
        >
          <Form.Item
            name="subject"
            label="Type"
            initialValue={typeName || ''}
            rules={[
              {
                required: true,
                message: 'Type is required.',
              },
            ]}
          >
            <Input name="subject" />
          </Form.Item>

          <Form.Item
            name="body"
            label="Invite Content"
            rules={[
              {
                required: true,
                message: 'Invite Content is required.',
              },
            ]}
          >
            <CKEditor
              key={`body`}
              editor={ClassicEditor}
              config={ckConfig} 
              onReady={editor => {
                editor.setData(mappedDataBody());
              }}
              config={{
                toolbar: [],
              }}
              onChange={(event, editor) => {
                form.setFieldsValue({
                  body: editor.getData(),
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

AssessmentInvitationEmailModal.propTypes = {
  typeName: PropTypes.string.isRequired,
  candidateName: PropTypes.string.isRequired,
};

export default memo(AssessmentInvitationEmailModal);
