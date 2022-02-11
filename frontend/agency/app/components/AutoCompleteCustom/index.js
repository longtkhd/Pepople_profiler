/**
 *
 * AutoCompleteCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { AutoComplete } from 'formik-antd';
import { useFormikContext, useField } from 'formik';
import './styles.less';

function AutoCompleteCustom({ label, starIcon, options, ...props }) {
  // const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props?.name);

  // const handleOptionChange = selected => {
  //   setFieldValue(props.name, selected);
  // };

  // const updateBlur = () => {
  //   console.log('>>changeblur',props.name);
  //   setFieldTouched(props.name, true);
  // };

  // console.log('meta', meta);

  return (
    <div
      className={`form-ant-group ${
        props.styleformgroup ? props.styleformgroup : ''
      }`}
    >
      <label className="form-ant-label" htmlFor={props.id || props.name}>
        {label} <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
      </label>
      <AutoComplete
        className={`form-ant-autocomplete ${props.bgwhite ? 'theme-white' : null}`}
        {...field}
        {...props}
        // {...meta}
        // onBlur={updateBlur}
        // onChange={handleOptionChange}
        options={options}
        // onSelect={(value, option) => {
          // console.log(`Value>>`, value);
          // setFieldValue(props.name, option.label);
          // console.log(`Option>>`, option);
        // }}
      />
      {/* {meta.touched && meta.error ? (
        <span className="form-ant-error">{meta.error}</span>
      ) : null} */}
    </div>
  );
}

AutoCompleteCustom.propTypes = {};

export default memo(AutoCompleteCustom);
