/**
 *
 * CompanyInfo
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Title from 'components/atoms/Title';
import HighlightText from 'components/atoms/HighlightText';
import CompanyInfoForm from 'components/CompanyInfoForm';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function CompanyInfo(props) {
  const { onSetupAgencyBrading } = props;
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
        <CompanyInfoForm onSubmit={onSetupAgencyBrading} />
      </div>
    </div>
  );
}

CompanyInfo.propTypes = {
  onSetupAgencyBrading: PropTypes.func.isRequired,
};

export default memo(CompanyInfo);
