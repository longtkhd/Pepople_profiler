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
import FormInfoDetail from 'components/FormInfoDetail';
import FormInfoNoTitle from 'components/FormInfoDetail/FormInfoNoTitle'
import { Row, Col } from 'antd'
import ButtonCustom from 'components/atoms/Button';
import { EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import InputEditCustom from 'components/InputEditCustom';
import './styles.less'



function AgencyAdminDetails(props) {
  const {
    history,
    data,
    agencyId
  } = props;

  const agencyName = data?.agency_name;
  const industry = data?.company_info?.industry;
  const country = data?.country_code;
  const agencySize = data?.company_info?.agency_size;
  const recruiterCount = data?.recruiter_count;
  const [agencySizeName, setAgencySizeName] = useState()


  useEffect(() => {
    setAgencySizeName(agencySize)
    return () => { }
  })



  return (
    <FormInfoNoTitle
      // title={<FormattedMessage {...messages.title} />}
      actions={
        <Row className="action-group" gutter={[8, 8]}>
          <Col>
            <ButtonCustom
              case="static"
              className="btn-primary"
              onClick={() => history.push(`/recruiter-list`)}
            >
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
          <Col >
            <InputEditCustom
              // starIcon={editToggle}
              label={'Agency Name:'}
              name="businessName"
              type="text"
              info={agencyName ? agencyName : '-'}
              infostyles='info-bold'

            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Industry:'}
              name="industry"
              type="text"
              info={industry ? industry : '-'}
              infostyles='info-bold'


            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Country:'}
              name="country"
              type="text"
              info={country ? country : '-'}
              infostyles='info-bold'


            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Agency Size:'}
              name="agencySize"
              type="text"
              info={agencySizeName}
              infostyles='info-bold'


            />
          </Col>
          <Col>
            <InputEditCustom
              // starIcon={editToggle}
              label={'Current No. of Recruiters:'}
              name="industry"
              type="number"
              info={recruiterCount ? recruiterCount : '-'}
              infostyles='info-bold'


            />
          </Col>
        </Row>
        {/* <CheckEventForm /> */}
      </div>
    </FormInfoNoTitle>
  );
}

AgencyAdminDetails.propTypes = {};

export default memo(AgencyAdminDetails);
