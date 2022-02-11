/**
 *
 * RecruiterEmailSettings
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectRecruiterEmailSettings,
  makeSelectRecruiterMailTemplateResponse,
  makeSelectDeleteMailTemplate,
  makeSelectDeleteMailTemplateError
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack'
import TableCustom from 'components/TableCustom'
import ActionType from 'components/TableCustom/ActionType'
import Title from 'components/atoms/Title'
import { Row, Col } from 'antd'
import Container from 'components/Container'
import './styles.less'

import getMailTemplateDefault from './actions'
import { deleteMailTemplateDefault } from './actions'
import { openNotification } from 'utils/notification';





export function RecruiterEmailSettings(props) {
  const {
    history,
    onGetMailTemplate,
    mailTemplate,
    onDeleteTemplate,
    deleteSuccess,
    deleteError
  } = props;
  const [mailTemplateData, setMailTemplateData] = useState(null)
  useInjectReducer({ key: 'recruiterEmailSettings', reducer });

  useEffect(() => {
    onGetMailTemplate()
  }, [])
  useEffect(() => {
    if (mailTemplate) {
      setMailTemplateData(mailTemplate)
    }

  }, [mailTemplate])

  const handleDelete = (id) => {
    onDeleteTemplate(id)
  }

  useEffect(() => {
    if (deleteSuccess) {
      openNotification('success', 'Delete email template success')
      onGetMailTemplate()
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (deleteError) {
      openNotification('error', 'Delete email template error')

    }
  }, [deleteError])
  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'Type',
      render: (text) => text == 1 ? ('Client Invite') : ('Candidate Invite')

    },
    {
      title: 'Actions',
      key: 'action',
      render: (record) => (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType onClick={() => history.push(`edit-email-template/${record.id}`)} type="edit" />
          </Col>
          <Col>
            <ActionType type="delete" onClick={() => handleDelete(record.id)} />
          </Col>
        </Row>
      ),

    },
  ];


  return (
    <div>
      <Helmet>
        <title>RecruiterEmailSettings</title>
        <meta
          name="description"
          content="Description of RecruiterEmailSettings"
        />
      </Helmet>

      <div className="template">
        <MainLayout >
          <ButtonBack history={history} />
          <div className='w-800'>

            <Title className="title-template">My Saved Templates</Title>

            <TableCustom
              dataSource={mailTemplateData}
              pagination={false}
              columns={columns}
              rowKey={record => record.id}
            />
          </div>
        </MainLayout>
      </div>
    </div >
  );
}

RecruiterEmailSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruiterEmailSettings: makeSelectRecruiterEmailSettings(),
  mailTemplate: makeSelectRecruiterMailTemplateResponse(),
  deleteSuccess: makeSelectDeleteMailTemplate(),
  deleteError: makeSelectDeleteMailTemplateError()

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetMailTemplate: () => dispatch(getMailTemplateDefault()),
    onDeleteTemplate: (id) => dispatch(deleteMailTemplateDefault(id))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruiterEmailSettings);
