/**
 *
 * CompanyInfo
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import getAgencyInfoSetup from 'containers/common_provider/get_agency_info_setup/actions';
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info_setup/selectors';

import Title from 'components/atoms/Title';
import HighlightText from 'components/atoms/HighlightText';
import CompanyInfoFormSetup from 'components/CompanyInfoFormSetup';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function CompanyInfo(props) {
  const { 
    onSetupAgencyBrading,
    user,
    setupToken,
    onGetAgencyInfo,
    agencyInfo,
  } = props;

  useEffect(() => {
    if (user && setupToken) {
      onGetAgencyInfo(setupToken.accessToken, user.agency_id);
    }
  }, []);

  return (
    <div className="company-info-container">
      <div className="text-center">
        <Title>
          <HighlightText>
            <FormattedMessage {...messages.descriptionLine1} />
          </HighlightText>
          <div>
            <FormattedMessage {...messages.descriptionLine2} />
          </div>
        </Title>
        <div className="notice">
          <FormattedMessage {...messages.notice} />
        </div>
      </div>
      <div className="company-info-form-container">
        {agencyInfo && 
          <CompanyInfoFormSetup 
            onSubmit={onSetupAgencyBrading} 
            user={user}
            setupToken={setupToken}
            agencyInfo={agencyInfo}
          />
        }
      </div>
    </div>
  );
}

CompanyInfo.propTypes = {
  onSetupAgencyBrading: PropTypes.func.isRequired,
  user: PropTypes.object,
  setupToken: PropTypes.object,
  onGetAgencyInfo: PropTypes.func,
  agencyInfo: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  agencyInfo: makeSelectAgencyInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetAgencyInfo: (accessToken, agencyId) => dispatch(getAgencyInfoSetup(accessToken, agencyId)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CompanyInfo);
