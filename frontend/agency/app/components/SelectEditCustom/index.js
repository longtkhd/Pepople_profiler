/**
 *
 * InputEdit
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { useField } from 'formik';
import { InputAntCustom } from 'components/InputCustom';
import { Field } from 'formik';
import './styles.less';

function SelectEditCustom({ label, starIcon, toggleedit, ...props }) {
  const [field, meta] = useField(props);

  const options = [
    {
      value: 'software developement',
      label: 'Software Development',
    },
    {
      value: 'downing street',
      label: 'Downing Street',
    },
    {
      value: 'wall street',
      label: 'Wall Street',
    },
  ];
  const styleModule = {
    padding: '0 11px',
    height: '40px',
    width: '200px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #f4f6f9',
    background: '#f4f6f9'
  }

  return (
    <div className="form-ant-group">
      <label className="form-ant-label" htmlFor={props.id || props.name}>
        {label}{' '}
        <span className={starIcon ? 'form-ant-required' : 'd-none'}>*</span>
      </label>
      {toggleedit ? (
        <>
          <Field
            as="select"
            className={`form-field-edit form-input-toggle`}
            {...field}
            {...props}
            style={styleModule}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Field>
          {/* {meta.touched && meta.error ? (
            <div className="form-error">{meta.error}</div>
          ) : null} */}
        </>
      ) : (
        <div {...props} className={`infoEdit`}>
          {props.info}
        </div>
      )}
    </div>
  );
}

SelectEditCustom.propTypes = {};

export default memo(SelectEditCustom);

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
