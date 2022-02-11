import React, { memo, useEffect, useMemo } from 'react';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchIndustry from 'containers/common_provider/get_industry/actions';
import {
  makeSelectGetIndustryLoading,
  makeSelectGetIndustryResponse,
} from 'containers/common_provider/get_industry/selectors';

import { SelectFormikAntCustom } from 'components/SelectCustom';
const SelectIndustry = props => {
  const { industryLoading, industryResult, fetchIndustry } = props;

  const options = useMemo(() => {
    return (
      industryResult &&
      industryResult.map(value => ({
        key: value?.id,
        label: value?.name,
        value: value?.name,
      }))
    );
  }, [industryResult]);

  useEffect(() => {
    if (props.name) fetchIndustry();
  }, [props.name]);



  return (
    <SelectFormikAntCustom
      label={props?.label}
      name={props?.name}
      placeholder={props?.placeholder}
      loading={industryLoading}
      options={options}

    />
  );
};

const mapStateToProps = createStructuredSelector({
  industryLoading: makeSelectGetIndustryLoading(),
  industryResult: makeSelectGetIndustryResponse(),
});

const mapDispatchToProps = {
  fetchIndustry,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SelectIndustry);
