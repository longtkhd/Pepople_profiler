/**
 *
 * InputEdit
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { useField } from 'formik';
import './styles.less';

function InputEditCustom({ label, starIcon, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.id || props.name}>
        {label} <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
      </label>
      { props.toggleedit ? (
        <>
          <input className={`form-control form-input-toggle`} {...field} {...props} />
          {meta.touched && meta.error ? (
            <div className="form-error">{meta.error}</div>
          ) : null}
        </>
      ) : (
          <div className={`${props.infoStyles ? props.infoStyles : null}`}>{props.info}</div>
        )}
    </div>
  );
}

InputEditCustom.propTypes = {};

export default memo(InputEditCustom);
