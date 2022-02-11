/**
 *
 * AdminAgencyInfoPage
 *
 */

import React, { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import messages from './messages';

import getAgencyInfoAction, {
  clearCompanyBackgroundAction,
  clearCompanyLogoAction,
  clearAgencyInfoAction,
  getCompanyBackground,
  getCompanyLogo,
} from '../common_provider/get_agency_info/actions';

import {
  makeSelectGetAgencyInfoLoading,
  makeSelectGetAgencyInfoError,
  makeSelectAgencyInfo,
  makeSelectCompanyBackgroundSuccess,
  makeSelectCompanyLogoSuccess,
  makeSelectGetCompanyLogoError,
  makeSelectGetCompanyBackgroundError,
  makeSelectGetCompanyBackgroundLoading,
  makeSelectGetCompanyLogoLoading
} from '../common_provider/get_agency_info/selectors';

import updateAgencyInfo, {
  clearUpdateAgencyAction,
} from '../common_provider/update_agency/actions';
import {
  makeSelectUpdateAgencyError,
  makeSelectUpdateAgencyResponse,
} from '../common_provider/update_agency/selectors';

import { openNotification } from 'utils/notification';
import { tokenDecoded } from 'utils/authHelper';

import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import CompanyInfoForm from 'components/CompanyInfoForm';
import SpinnerLoading from 'components/SpinnerLoading';

import './styles.less';

export function AdminAgencyInfoPage(props) {
  useInjectReducer({ key: 'adminAgencyInfoPage', reducer });

  const {
    history,
    loadingAgency,
    errorAgency,
    getAgencyInfo,
    agencyInfoResponse,
    getCompanyLogoAction,
    getCompanyBackgroundAction,
    companyLogo,
    companyBackground,
    loadingLogo,
    loadingBackground,
    errorLogo,
    errorBackground,
    onUpdateAgency,
    updateAgencyError,
    updateAgencyResponse,
    clearUpdateAgency,
    clearCompanyLogo,
    clearCompanyBackground,
    clearAgencyInfo
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAgency = data => {
    if (!infoAuth?.agency_id) return;
    const { logo, background, agencyInfo } = data;
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('background', background);
    agencyInfo.id = infoAuth?.agency_id;
    formData.append('agencyInfo', JSON.stringify(agencyInfo));
    onUpdateAgency(formData);
  };

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  useEffect(() => {
    return () => {
      clearUpdateAgency();
      clearCompanyLogo();
      clearCompanyBackground();
      clearAgencyInfo();
    }
  }, []);

  useEffect(() => {
    const agencyId = infoAuth?.agency_id;
    if (agencyId) {
      getAgencyInfo(agencyId);
    }
  }, [infoAuth]);

  const agencyInfo = useMemo(() => {
    if (agencyInfoResponse) {
      return {
        agency_name: agencyInfoResponse?.agency_name || '',
        agency_size: agencyInfoResponse?.company_info?.agency_size,
        button_color: agencyInfoResponse?.company_info?.button_color || '',
        font_color: agencyInfoResponse?.company_info?.font_color || '',
        link_color: agencyInfoResponse?.company_info?.link_color || '',
        industry: agencyInfoResponse?.company_info?.industry || '',
        background_image: agencyInfoResponse.company_info?.background_image || '',
        logo: agencyInfoResponse?.company_info?.logo || '',
        country_code: agencyInfoResponse?.country_code || '',
      };
    }
    return null;
  }, [agencyInfoResponse]);

  useEffect(() => {
    if (agencyInfoResponse?.company_info?.logo) {
      getCompanyLogoAction(
        agencyInfoResponse.id,
        agencyInfoResponse.company_info.logo,
        'logo',
      );
    }
  }, [agencyInfoResponse?.company_info?.logo]);

  useEffect(() => {
    if (agencyInfoResponse?.company_info?.logo) {
      getCompanyLogoAction(
        agencyInfoResponse.id,
        agencyInfoResponse.company_info.logo,
        'logo',
      );
    }
  }, [agencyInfoResponse?.company_info?.logo]);

  useEffect(() => {
    if (agencyInfoResponse?.company_info?.background_image) {
      getCompanyBackgroundAction(
        agencyInfoResponse.id,
        agencyInfoResponse.company_info.background_image,
        'background',
      );
    }
  }, [agencyInfoResponse?.company_info?.background_image]);

  useEffect(() => {
    if (updateAgencyResponse) {
      openNotification('success', 'Agency details successfully updated');
    }
  }, [updateAgencyResponse]);

  useEffect(() => {
    const error = updateAgencyError || errorLogo || errorBackground || errorAgency;
    if (error) {
      openNotification('error', error.message);
    }
  }, [updateAgencyError, errorLogo, errorBackground, errorAgency]);

  useEffect(() => {
    let isLoading = loadingAgency || loadingBackground || loadingLogo;
    setIsLoading(isLoading);
  }, [loadingAgency, loadingBackground, loadingLogo]);

  return (
    <div>
      <Helmet>
        <title>Agency Settings</title>
        <meta
          name="description"
          content="Description of Admin Agency Info Page"
        />
      </Helmet>

      <MainLayout mainLayoutStyles={{ backgroundColor: '#ffffff' }}>
        <ButtonBack history={history} />
        <div className="agency-info-container">
          <h2 className="agency-info-title">Update Agency Details</h2>
          {isLoading && <SpinnerLoading loading={isLoading} />}
          {!isLoading && agencyInfo && (
            <CompanyInfoForm
              editMode={true}
              agencyInfo={agencyInfo}
              logo={companyLogo}
              background={companyBackground}
              onSubmit={handleUpdateAgency}
            />
          )}
        </div>

      </MainLayout>
    </div>
  );
}

AdminAgencyInfoPage.propTypes = {
  agencyInfoResponse: PropTypes.object,
  errorAgency: PropTypes.object,
  loadingAgency: PropTypes.bool,
  loadingLogo: PropTypes.bool,
  loadingBackground: PropTypes.bool,
  companyLogo: PropTypes.object,
  companyBackground: PropTypes.object,
  errorLogo: PropTypes.object,
  errorBackground: PropTypes.object,
  updateAgencyError: PropTypes.object,
  updateAgencyResponse: PropTypes.object,
  getAgencyInfo: PropTypes.func,
  getCompanyLogoAction: PropTypes.func,
  getCompanyBackgroundAction: PropTypes.func,
  onUpdateAgency: PropTypes.func,
  clearUpdateAgency: PropTypes.func,
  clearAgencyInfo: PropTypes.func,
  clearConpanyBackground: PropTypes.func,
  clearConpanyLogo: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agencyInfoResponse: makeSelectAgencyInfo(),
  errorAgency: makeSelectGetAgencyInfoError(),
  loadingAgency: makeSelectGetAgencyInfoLoading(),
  loadingLogo: makeSelectGetCompanyLogoLoading(),
  loadingBackground: makeSelectGetCompanyBackgroundLoading(),
  companyLogo: makeSelectCompanyLogoSuccess(),
  companyBackground: makeSelectCompanyBackgroundSuccess(),
  errorLogo: makeSelectGetCompanyLogoError(),
  errorBackground: makeSelectGetCompanyBackgroundError(),
  updateAgencyError: makeSelectUpdateAgencyError(),
  updateAgencyResponse: makeSelectUpdateAgencyResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAgencyInfo: agencyId => dispatch(getAgencyInfoAction(agencyId)),
    getCompanyLogoAction: (agencyId, fileId, type) => {
      dispatch(getCompanyLogo(agencyId, fileId, type));
    },
    getCompanyBackgroundAction: (agencyId, fileId, type) =>
      dispatch(getCompanyBackground(agencyId, fileId, type)),
    onUpdateAgency: data => dispatch(updateAgencyInfo(data)),
    clearUpdateAgency: () => dispatch(clearUpdateAgencyAction()),
    clearAgencyInfo: () => dispatch(clearAgencyInfoAction()),
    clearCompanyLogo: () => dispatch(clearCompanyLogoAction()),
    clearCompanyBackground: () => dispatch(clearCompanyBackgroundAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminAgencyInfoPage);
