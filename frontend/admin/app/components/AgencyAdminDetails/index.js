/**
 *
 * AgencyAdminDetails
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { connect } from 'react-redux';
import { compose } from 'redux';
import FormInfoDetail from 'components/FormInfoDetail';
import FormInfoNoTitle from 'components/FormInfoDetail/FormInfoNoTitle';
import { Row, Col } from 'antd';
import ButtonCustom from 'components/atoms/Button';
import { EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import InputEditCustom from 'components/InputEditCustom';
import { createStructuredSelector } from 'reselect';
import {
  deleteAgencyDefault,
  deactiveAgencyDefault,
} from 'containers/common_provider/agency_list/actions';
import {
  makeSelectDeleteAgency,
  makeSelectDeactiveAgencySuccess,
  makeSelectDeleteAgencyError,
  makeSelectDeactiveAgencyError,
} from 'containers/common_provider/agency_list/selectors';
import { openNotification } from 'utils/notification';
import './styles.less';

function AgencyAdminDetails(props) {
  const {
    history,
    data,
    isVerify,
    isActive,
    agencyId,
    onDeleteAgency,
    deleteAgencyStatus,
    deleteAgencyError,
    onDeactiveAgency,
    deactiveAgencyStatus,
    deactiveAgencyError,
  } = props;

  const agencyName = data?.agency_name;
  const industry = data?.company_info?.industry;
  const country = data?.country_code;
  const agencySize = data?.company_info?.agency_size;
  const recruiterCount = data?.recruiter_count;
  // const isVerify = data?.created_by?.is_verify;
  const [agencySizeName, setAgencySizeName] = useState();

  useEffect(() => {
    setAgencySizeName(agencySize);
    return () => {};
  });
  const handleDeleteAgency = () => {
    onDeleteAgency(agencyId);
  };

  const handleDeactiveAgency = () => {
    onDeactiveAgency(agencyId);
  };

  useEffect(() => {
    if (deleteAgencyStatus == true) {
      openNotification(
        'success',
        <FormattedMessage {...messages.deleteSuccess} />,
      );
      history.push('/admin-agency-list');
    }
  }, [deleteAgencyStatus]);

  useEffect(() => {
    if (deleteAgencyError) {
      openNotification(
        'error',
        <FormattedMessage {...messages.Error} />,
        <FormattedMessage {...messages.deleteErrorContent} />,
      );
    }
  });

  useEffect(() => {
    if (deactiveAgencyStatus) {
      openNotification(
        'success',
        <FormattedMessage {...messages.deactiveSuccess} />,
      );
      history.push('/admin-agency-list');
    }
  }, [deactiveAgencyStatus]);

  useEffect(() => {
    if (deactiveAgencyError) {
      openNotification('error', <FormattedMessage {...messages.Error} />);
    }
  }, [deactiveAgencyError]);

  return (
    <FormInfoNoTitle
      // title={<FormattedMessage {...messages.title} />}
      actions={
        <Row className="action-group" gutter={[8, 8]}>
          <Col>
            <ButtonCustom
              case="static"
              className="btn-danger"
              onClick={handleDeleteAgency}
            >
              <DeleteOutlined className="icon-btn" />
              <FormattedMessage {...messages.delete} />
            </ButtonCustom>
          </Col>
          <Col>
            <ButtonCustom
              case="static"
              className="btn-secondary"
              onClick={handleDeactiveAgency}
            >
              <StopOutlined className="icon-btn" />
              <FormattedMessage {...messages.Deactivate} />
            </ButtonCustom>
          </Col>

          <Col>
            <ButtonCustom
              case="static"
              className="btn-primary"
              onClick={() => history.push(`/recruiter-list/${agencyId}`)}
            >
              {/* <DeleteOutlined className="icon-btn" /> */}
              <FormattedMessage {...messages.View} />
            </ButtonCustom>
          </Col>
        </Row>
      }
      case="use-form"
      initialValues={{ businessName: '', industry: '' }}
      // onSubmit={handleSaveEdit}
    >
      <div className="form-layout agency-admin-details">
        <Row gutter={[32, 16]}>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Agency Name:'}
              name="businessName"
              type="text"
              info={agencyName ? agencyName : '-'}
              infoStyles="info-bold"
            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Industry:'}
              name="industry"
              type="text"
              info={industry ? industry : '-'}
              infoStyles="info-bold"
            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Country:'}
              name="country"
              type="text"
              info={country ? country : '-'}
              infoStyles="info-bold"
            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Agency Size:'}
              name="agencySize"
              type="text"
              info={agencySizeName}
              infoStyles="info-bold"
            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Current No. of Recruiters:'}
              name="industry"
              type="number"
              info={recruiterCount ? recruiterCount : '-'}
              infoStyles="info-bold"
            />
          </Col>
        </Row>
        {/* <CheckEventForm /> */}
      </div>
    </FormInfoNoTitle>
  );
}

AgencyAdminDetails.propTypes = {};
const mapStateToProps = createStructuredSelector({
  deleteAgencyStatus: makeSelectDeleteAgency(),
  deleteAgencyError: makeSelectDeleteAgencyError(),
  deactiveAgencyStatus: makeSelectDeactiveAgencySuccess(),
  deactiveAgencyError: makeSelectDeactiveAgencyError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDeleteAgency: agencyId => dispatch(deleteAgencyDefault(agencyId)),
    onDeactiveAgency: agencyId => dispatch(deactiveAgencyDefault(agencyId)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AgencyAdminDetails);
