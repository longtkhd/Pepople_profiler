import React, { memo, useEffect, useMemo, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import FormInfoDetail from 'components/FormInfoDetail';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import { fetchContactListDetail } from 'containers/common_provider/client_state/actions';
import {
  deleteContactDetail,
  cleanUpDeleteContact,
} from 'containers/common_provider/client_state/delete_contact_list/actions';
import {
  editClientContact,
  cleanUpEditClientContact,
} from 'containers/common_provider/client_state/edit_contact_client/actions';
import {
  makeSelectEditClientContactLoad,
  makeSelectEditClientContactResult,
} from 'containers/common_provider/client_state/edit_contact_client/selectors';
import { Row, Col, Popconfirm, InputNumber, Form, Input } from 'antd';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectContactListDetail,
  makeSelectContactListDetailLoad,
  makeSelectDeleteContactDetailSuccess,
  makeSelectDeleteContactDetailLoading,
} from './selectors';
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import { pushNotify } from 'utils/notify';
import { PlusOutlined } from '@ant-design/icons';
import { push } from 'connected-react-router';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <Form.Item
        name={dataIndex}
        style={{
          margin: 0,
        }}
        rules={[
          {
            required: true,
            message: `Please Input ${title}!`,
          },
          // {
          //   pattern: /^[^\s]+(\s+[^\s]+)*$/,
          //   message: `Please remove whitespace`,
          // },
          {
            required: true,
            pattern: /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            message: `${title} is not valid`,
          },
        ]}
      >
        <Input className={`ant-custom-input theme-white`} />
      </Form.Item>
    ) : inputType === 'email' ? (
      <Form.Item
        name={dataIndex}
        style={{
          margin: 0,
        }}
        rules={[
          {
            required: true,
            message: `Please enter ${title}!`,
          },
          // {
          //   pattern: /^[^\s]+(\s+[^\s]+)*$/,
          //   message: `Please remove whitespace`,
          // },
          {
            pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: `Email is not valid`,
          },
        ]}
      >
        <Input className={`ant-custom-input theme-white`} />
      </Form.Item>
    ) : (
      <Form.Item
        name={dataIndex}
        style={{
          margin: 0,
        }}
        rules={[
          {
            required: true,
            message: `Please enter ${title}!`,
          },
          // {
          //   pattern: /^[^\s]+(\s+[^\s]+)*$/,
          //   message: `Please remove whitespace`,
          // },
        ]}
      >
        <Input className={`ant-custom-input theme-white`} />
      </Form.Item>
    );
  return <td {...restProps}>{editing ? inputNode : children}</td>;
};

const ContactList = props => {
  const {
    clientId,
    fetchContactListDetail,
    contactDetail,
    loadingContact,
    loadingDeleted,
    deleteContactDetail,
    deleteContactSuccess,
    editClientContact,
    contactEditLoad,
    contactEditResult,
    cleanUpDeleteContact,
    cleanUpEditClientContact,
    push,
  } = props;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [contactPopup, setContactPopup] = useState(false);
  const [contactId, setContactId] = useState(null);

  const showContactPopup = record => {
    setContactPopup(true);
    setContactId(record.id);
  };
  const hideContactPopup = () => setContactPopup(false);
  const okContactPopup = () => deleteContact(contactId);

  const contactDetaiList = useMemo(() => {
    return (
      contactDetail &&
      contactDetail
        .filter(({ is_deleted }) => is_deleted !== true)
        .map(contacts => ({
          key: contacts.id,
          ...contacts,
        }))
    );
  }, [contactDetail]);

  const deleteContact = contactId => deleteContactDetail(clientId, contactId);

  const PopupMsg = () => (
    <>
      {/* POPUP  DELETE CONTACT */}
      <CombinedCustom
        width={500}
        toggleModal={contactPopup}
        title={`Are you sure?`}
        content={`Are you sure you want to permanently delete this contact?`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                onClick={hideContactPopup}
                className={`btn-default-outline w-120`}
              >
                {`Cancel`}
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                onClick={okContactPopup}
                className={`btn-danger w-120`}
              >
                {`Delete`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
    </>
  );

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({
      first_name: '',
      last_name: '',
      contract_number: '',
      email: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = useCallback(
    async key => {
      const rowEdited = await form.validateFields();
      if (rowEdited) {
        const payload = {
          id: key,
          ...rowEdited,
        };
        editClientContact(clientId, payload);
      }
    },
    [clientId],
  );

  const columns = [
    {
      title: 'first name',
      dataIndex: 'first_name',
      key: 'first_name',
      editable: true,
    },
    {
      title: 'last name',
      dataIndex: 'last_name',
      key: 'last_name',
      editable: true,
    },
    {
      title: 'contact number',
      dataIndex: 'contract_number',
      key: 'contract_number',
      editable: true,
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      editable: true,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Row justify="end" gutter={[16, 0]} align="middle">
            <Col>
              <ActionType
                type="delete"
                onClick={() => showContactPopup(record)}
              />
            </Col>
            <Col>
              {editable ? (
                <div>
                  <a
                    href="javascript:;"
                    onClick={() => save(record.key)}
                    style={{
                      marginRight: 8,
                      fontSize: '12px',
                    }}
                  >
                    Save
                  </a>
                  <Popconfirm overlayClassName={`custom-popconfirm`} title="Sure to cancel?" onConfirm={cancel}>
                    <a style={{ fontSize: '12px' }}>Cancel</a>
                  </Popconfirm>
                </div>
              ) : (
                <ActionType
                  type="edit"
                  disabled={editingKey !== ''}
                  onClick={() => edit(record)}
                />
              )}
            </Col>
          </Row>
        );
      },
      align: 'right',
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'contract_number' ? 'number' : 'text',
        inputType: col.dataIndex === 'email' && 'email',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    if (contactEditResult?.success) {
      setEditingKey('');
      pushNotify({
        type: 'success',
        message: `Edit contact success`,
      });
      cleanUpEditClientContact();
    }
  }, [contactEditResult]);

  useEffect(() => {
    if (deleteContactSuccess) {
      pushNotify({
        type: 'success',
        message: `Delete contact success`,
      });
      hideContactPopup();
      cleanUpDeleteContact();
    }
  }, [deleteContactSuccess]);

  useEffect(() => {
    fetchContactListDetail(clientId);
  }, [clientId, deleteContactSuccess, loadingDeleted, contactEditResult]);

  useEffect(() => {
    return () => {
      cleanUpDeleteContact();
      cleanUpEditClientContact();
    };
  }, []);

  return (
    <FormInfoDetail title={<FormattedMessage {...messages.contact} />}
      actions={
        <Row>
          <Col>
          <ButtonCustom className={`btn-primary-gradient`} onClick={() => push(`/client-create-contact/${clientId}`)}>
            <PlusOutlined className={`btn-icon`}/>
            {`Add Contacts`}
          </ButtonCustom>
          </Col>
        </Row>
      }
    >
      {PopupMsg()}
      <Form form={form} component={false}>
        <TableCustom
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          scroll={{x: 1024 }}
          loading={loadingContact}
          rowKey={record => record.key}
          dataSource={contactDetaiList}
          pagination={false}
          rowClassName="editable-row"
          columns={mergedColumns}
        />
      </Form>
    </FormInfoDetail>
  );
};

const mapStateToProps = createStructuredSelector({
  contactDetail: makeSelectContactListDetail(),
  loadingContact: makeSelectContactListDetailLoad(),
  deleteContactSuccess: makeSelectDeleteContactDetailSuccess(),
  loadingDeleted: makeSelectDeleteContactDetailLoading(),
  contactEditLoad: makeSelectEditClientContactLoad(),
  contactEditResult: makeSelectEditClientContactResult(),
});

const mapDispatchToProps = {
  fetchContactListDetail,
  deleteContactDetail,
  editClientContact,
  cleanUpDeleteContact,
  cleanUpEditClientContact,
  push,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ContactList);
