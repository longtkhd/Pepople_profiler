/**
 *
 * UploadFiles
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUploadFiles from './selectors';
import reducer from './reducer';
import messages from './messages';

export function UploadFiles() {
  useInjectReducer({ key: 'uploadFiles', reducer });

  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

UploadFiles.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  uploadFiles: makeSelectUploadFiles(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(UploadFiles);
