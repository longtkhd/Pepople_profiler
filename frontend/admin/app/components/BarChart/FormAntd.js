import React, { memo, useMemo, useState, useEffect } from 'react';
import { Row, Col, Form } from 'antd';
import Selects from './Selects';
import Button from 'components/atoms/Button';
import SelectCustom from 'components/SelectCustom';
import FormInfoDetail from 'components/FormInfoDetail';
import { getArgencyList } from 'containers/common_provider/agency_list/actions';
import { makeSelectArgencyInfo } from 'containers/common_provider/agency_list/selectors';
import moment from 'moment';
import {
  getCountParsingDefault,
  getCountAssessmentDefault,
} from 'containers/dashboard_page/actions';
import {
  makeSelectParsingPageResponse,
  makeSelectAssessmentResponse,
} from 'containers/dashboard_page/selectors';

// import Button from 'components/atoms/Buttons'

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
const FormAntd = props => {
  const handleSettime = selected => {
    setTimeSelected(selected);
  };

  const {
    data,
    onGetParsing,
    // parsingData,
    name,
    onGetAssessment,
  } = props;

  const [agencySelected, setAgencySelected] = useState();
  const [timeSelected, setTimeSelected] = useState(1);
  const [fromDay, setFromDay] = useState(null);
  const [toDay, setToDay] = useState(null);
  const handleRefresh = () => {
    setTimeSelected(1);
    setAgencySelected(null);
  };

  useEffect(() => {
    if (name) {
      // console.log('name', name)
      if (name === 'Cvparsing') {
        onGetParsing({
          params: {
            agency_id: agencySelected,
            from_date: fromDay,
            to_date: toDay,
          },
        });
      } else {
        onGetAssessment({
          params: {
            agency_id: agencySelected,
            from_date: fromDay,
            to_date: toDay,
          },
        });
      }
    }
  }, [agencySelected, fromDay, toDay, timeSelected]);

  const handleGetFromDate = useMemo(() => {
    if (timeSelected && timeSelected === 1) {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);
      setFromDay(moment(firstDay, 'YYYY-MM-DD', true).format('YYYY-MM-DD'));
      setToDay(moment(lastDay, 'YYYY-MM-DD', true).format('YYYY-MM-DD'));
    } else {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      var firstDay = new Date(y, 0, 1);
      // console.log('first day of year', moment(firstDay, 'YYYY-MM-DD', true).format("YYYY-MM-DD"))
      var lastDay = new Date(date.getFullYear(), 11, 31);
      setFromDay(moment(firstDay, 'YYYY-MM-DD', true).format('YYYY-MM-DD'));
      setToDay(moment(lastDay, 'YYYY-MM-DD', true).format('YYYY-MM-DD'));
    }
  }, [timeSelected]);

  const AgecyOptions = useMemo(() => {
    let options = [];
    data &&
      data.map(({ id, agency_name }) => {
        options.push({
          value: id,
          label: agency_name,
        });
      });
    return options;
  }, [data]);

  const sortOptions = [
    {
      label: 'All',
      value: 1,
    },
  ];

  const timeOptions = [
    {
      label: 'This Month',
      value: 1,
    },
    {
      label: 'This Year',
      value: 2,
    },
  ];

  const initialAgency = {
    // agency: data ? data[0]?.id : '',
    agency: '',
    sort: 1,
    time: 1,
  };

  return (
    <FormInfoDetail
      case="use-form"
      initialValues={initialAgency}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        handleRefresh(values);
        resetForm({
          agency: '',
          sort: 1,
          time: 1,
        });
      }}
    >
      <Row
        justify="start"
        align="left"
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <Col xs={24} sm={12} md={12} lg={6}>
          <SelectCustom
            styleformgroup={`mb-20`}
            label="Sort"
            id="sort"
            name="sort"
            options={sortOptions}
            defaultValue={1}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <SelectCustom
            styleformgroup={`mb-20`}
            label="Select Agency"
            id="agency"
            name="agency"
            options={AgecyOptions}
            onSelect={selected => setAgencySelected(selected)}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} offset={3}>
          <Row justify="center" align="middle">
            <Col lg={18}>
              <SelectCustom
                styleformgroup={`mb-20`}
                label="Select time"
                id="time"
                name="time"
                options={timeOptions}
                onSelect={selected => handleSettime(selected)}
              />
            </Col>

            <Col lg={5} offset={1}>
              <Button className="btn-primary-gradient " type="submit">
                Refresh
                {/* <EditOutlined className="icon-btn" /> */}
                {/* <FormattedMessage {...messages.update} /> */}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </FormInfoDetail>
  );
};

const mapStateToProps = createStructuredSelector({
  // parsingData: makeSelectParsingPageResponse()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetParsing: params => dispatch(getCountParsingDefault(params)),
    onGetAssessment: params => dispatch(getCountAssessmentDefault(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FormAntd);
