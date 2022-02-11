/**
 *
 * InputEdit
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Input } from 'antd';
import { useField } from 'formik';
import { InputAntCustom } from 'components/InputCustom';
import NumberFormat from 'react-number-format';
import './styles.less';

export const NumberInput = props => {
  // console.log(props.numberInput);
  return (
    <NumberFormat
      className={`form-ant-input form-input-toggle custom__number`}
      placeholder=""
      prefix="AUD $"
      thousandSeparator={true}
      // isNumericString={true}
      // displayType={text}
      {...props}
    />
  );
};
function InputEditCustom({ label, starIcon, toggleedit, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-ant-group">
      <label
        className={`form-ant-label ${props.className}`}
        htmlFor={props.id || props.name}
      >
        {label}{' '}
        <span className={starIcon ? 'form-ant-required' : 'd-none'}>*</span>
      </label>
      {toggleedit && !props?.numberinput ? (
        <>
          <Input
            className={`form-ant-input form-input-toggle`}
            {...field}
            {...props}
          />
        </>
      ) : props.numberinput && toggleedit ? null : ( //hide info of number input
        (props.numberinput) ?
          (<NumberInput
            displayType={'text'}
            className={`infoEdit ${props.infostyles ? props.infostyles : null}`}
            {...field}
            {...props}
          />) :
          <div
            {...props}
            className={`infoEdit ${props.infostyles ? props.infostyles : null}`}
          >
            {props.info}
          </div>
      )}
      {toggleedit && props?.numberinput && (
        <NumberInput
          className={`form-ant-input form-input-toggle `}
          {...field}
          {...props}
        />
      )}
    </div>
  );
}

InputEditCustom.propTypes = {};

export default memo(InputEditCustom);

export const InputEditAntCustom = ({
  label,
  starIcon,
  toggleedit,
  ...props
}) => {
  return (
    <div className="form-ant-group">
      <label className="form-ant-label" htmlFor={props.id || props.name}>
        {label}{' '}
        <span className={starIcon ? 'form-ant-required' : 'd-none'}>*</span>
      </label>
      {toggleedit ? (
        <>
          <InputAntCustom {...props} />
        </>
      ) : (
          <div {...props}>{props.info}</div>
        )}
    </div>
  );
};
