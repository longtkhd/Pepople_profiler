/**
 *
 * DeleteRecruiterModal
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import removeRecruiter from 'containers/common_provider/remove_recruiter/actions';

import { Modal } from 'antd';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';

function DeleteRecruiterModal(props) {
  const {
    deleteRecruiter,
    goToRecruiterList,
    recruiterId
  } = props;

  Modal.confirm({
    centered: true,
    closable: true,
    title: <FormattedMessage {...messages.title} />,
    content: (
      <div>
        <p><FormattedMessage {...messages.content} /></p>
      </div>
    ),
    okText: <FormattedMessage {...globalMessages.delete} />,
    okType: 'danger',
    cancelText: <FormattedMessage {...globalMessages.cancel} />,
    onOk() {
      deleteRecruiter(recruiterId);
      goToRecruiterList();
    },
    onCancel() {},
  })

  useEffect(() => {
    effect
    return () => {
      cleanup
    }
  }, [])
}

DeleteRecruiterModal.propTypes = {
  deleteRecruiter: PropTypes.func,
  recruiterId: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    deleteRecruiter: (recruiterId) => dispatch(removeRecruiter(recruiterId)),
    goToRecruiterList: () => dispatch(push('/recruiter-list')),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DeleteRecruiterModal);
