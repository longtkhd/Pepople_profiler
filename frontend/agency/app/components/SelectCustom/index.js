/**
 *
 * SelectCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { useFormikContext, useField } from 'formik';
import ReactSelect from 'react-select';
import { Select } from 'formik-antd';
import './styles.less';
function SelectCustom({ label, starIcon, options, ...props }) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);

  const handleOptionChange = selected => {
    setFieldValue(props.name, selected);

  };

  const updateBlur = () => {
    setFieldTouched(props.name, true);
  };

  return (
    <div
      className={`form-ant-group ${props.styleformgroup ? props.styleformgroup : ''
        }`}
    >
      <label className={`form-ant-label`} htmlFor={props.id || props.name}>
        {label} <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
      </label>
      <>
        <Select
          className={`form-ant-select`}
          options={options}
          {...field}
          // {...meta}
          // touched={meta?.touched ? 'true' : 'false'}
          onBlur={updateBlur}
          // {...meta?.initialValue}
          // initialerror={meta?.initialError && meta?.initialError}
          onChange={handleOptionChange}
        />
        {/* {meta.touched && meta.error ? (
            <span className="form-ant-error">{meta.error}</span>
          ) : null} */}
      </>
    </div>
  );
}

SelectCustom.propTypes = {};

export default memo(SelectCustom);

export const SelectAntCustom = props => {
  return (
    <div
      className={`form-ant-group ${props.styleformgroup ? props.styleformgroup : null
        }`}
    >
      <label className="form-ant-label" htmlFor={props.id || props.name}>
        {props.label}{' '}
        <span className={props?.starIcon ? 'form-ant-required' : 'd-none'}>
          *
        </span>
      </label>
      <Select className={`form-ant-select`} {...props}>
        {props.children}
      </Select>
    </div>
  );
};

export const SelectEditCustom = ({ label, starIcon, options, ...props }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);

  const handleOptionChange = selected => {
    setFieldValue(props.name, selected);
  };

  const updateBlur = () => {
    setFieldTouched(props.name, true);
  };

  return (
    <div
      className={`form-ant-group ${props.styleformgroup ? props.styleformgroup : ''
        }`}
    >
      <label className={`form-ant-label ${props.className}`} htmlFor={props.id || props.name}>
        {label} <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
      </label>
      {props.toggleedit ? (
        <>
          <Select
            className={`form-ant-select`}
            options={options}
            {...field}
            // {...meta}
            // touched
            onBlur={updateBlur}
            onChange={handleOptionChange}
          />
          {meta.touched && meta.error ? (
            <span className="form-ant-error">{meta.error}</span>
          ) : null}
        </>
      ) : (
          <div className ={`infoEdit ${props.infostyles ? props.infostyles : null}`}>{props.info}</div>
        )}
    </div>
  );
};

export const SelectFormikAntCustom = props => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);
  // console.log('meta>>',meta);
  const handleOptionChange = selected => {
    // console.log('selected>>>',selected);
    setFieldValue(props.name, selected);
  };

  const updateBlur = () => {
    setFieldTouched(props.name, true);
  };
  return (
    <div
      className={`form-ant-group ${props.styleformgroup ? props.styleformgroup : null
        }`}
    >
      <label
        style={{ display: props.label ? 'block' : 'none' }}
        className="form-ant-label"
        htmlFor={props.id || props.name}
      >
        {props.label}{' '}
        <span className={props?.starIcon ? 'form-ant-required' : 'd-none'}>
          *
        </span>
      </label>
      <Select
        className={`form-ant-select`}
        // {...field}
        {...props}
        onBlur={updateBlur}
        onChange={handleOptionChange}
      >
        {props.options && props.options?.map((opt, index) => (
          <Select.Option value={opt?.value} key={opt?.key ? opt.key : index}>
            {opt?.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
