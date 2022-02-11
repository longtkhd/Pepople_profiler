/**
 *
 * TextAreaCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { useField } from 'formik';

function TextAreaCustom({ label, starIcon, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div
      className={`form-group ${
        props.styleformgroup ? props.styleformgroup : null
      }`}
    >
      {label ? (
        <label className="form-label" htmlFor={props.id || props.name}>
          {label}{' '}
          <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
        </label>
      ) : null}
      <textarea className="form-textarea" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="form-error">{meta.error}</div>
      ) : null}
    </div>
  );
}

TextAreaCustom.propTypes = {};

export default memo(TextAreaCustom);
