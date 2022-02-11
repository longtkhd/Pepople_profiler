/**
 *
 * InputCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Input } from 'antd';
import { useField } from 'formik';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './styles.less';

function InputCustom({ label, starIcon, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
    <div
      className={`form-ant-group ${
        props.styleformgroup ? props.styleformgroup : null
      }`}
    >
      {label ? (
        <label className="form-ant-label" htmlFor={props.id || props.name}>
          {label}{' '}
          <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
        </label>
      ) : null}
      <Input className={`form-ant-input ${props.bgwhite ? 'theme-white' : null}`} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={`form-ant-error`}>{meta.error}</div>
      ) : null}
    </div>
    </>
  );
}

InputCustom.propTypes = {};

export default memo(InputCustom);

export const InputAntCustom = ({ label, starIcon, ...props }) => {
  return (
    <div
      className={`form-ant-group ${
        props.styleformgroup ? props.styleformgroup : null
      }`}
    >
      {label ? (
        <label className="form-ant-label" htmlFor={props.id || props.name}>
          {label}{' '}
          <span className={starIcon ? 'form-ant-required' : 'd-none'}>*</span>
        </label>
      ) : null}
      <Input className={`form-ant-input ${props.bgwhite ? 'theme-white' : null}`} {...props} />
      {/* {meta.touched && meta.error ? (
          <div className="form-error">{meta.error}</div>
        ) : null} */}
    </div>
  );
};

export const InputPasswordAntCustom = ({ label, starIcon, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div
      className={`form-ant-group ${
        props.styleformgroup ? props.styleformgroup : null
      }`}
    >
      {label ? (
        <label className="form-ant-label" htmlFor={props.id || props.name}>
          {label}{' '}
          <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
        </label>
      ) : null}
      <Input.Password
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        className={`form-ant-input ${props.bgwhite ? 'theme-white' : null}`} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={`form-ant-error`}>{meta.error}</div>
      ) : null}
    </div>
  );
}
