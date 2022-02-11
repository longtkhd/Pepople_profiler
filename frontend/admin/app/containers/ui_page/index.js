/**
 *
 * UIpage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUIpage from './selectors';
import reducer from './reducer';
import messages from './messages';
import Container from 'components/Container';
import ButtonComponent from './ButtonComponent';
import StatusComponent from './StatusComponent';
import TableComponent from './TableComponent';
import './styles.less';

export function UIpage() {
  useInjectReducer({ key: 'uIpage', reducer });

  return (
    <div>
      <Helmet>
        <title>UIpage</title>
        <meta name="description" content="Description of UIpage" />
      </Helmet>
      <Container>
        <h2 className="text-center">{`Recuiter Component`}</h2>
        <ButtonComponent title={'Button'} />
        <StatusComponent title={'Status'} />
        <TableComponent title={'Table'} />
      </Container>
    </div>
  );
}

UIpage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  uIpage: makeSelectUIpage(),
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
)(UIpage);
