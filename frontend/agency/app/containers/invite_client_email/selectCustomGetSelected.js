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
import { Select } from 'antd';
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

    const handleSelect = (selected) => {
        if (props.onSelect) {
            return props.onSelect(selected)
        } else {
            return () => { }
        }
    }

    return (
        <div
            className={`form-ant-group ${props.styleformgroup ? props.styleformgroup : ''
                }`}
        >
            <label className="form-ant-label" htmlFor={props.id || props.name}>
                {label} <span className={starIcon ? 'form-required' : 'd-none'}>*</span>
            </label>
            <div>
                <Select
                    className={`form-ant-select`}
                    options={options}
                    {...field}
                    // {...meta}
                    // touched={meta?.touched ? 'true' : 'false'}
                    onBlur={updateBlur}
                    // {...meta?.initialValue}
                    initialerror={meta?.initialError && meta?.initialError}
                    onChange={handleOptionChange}
                    onSelect={(selected) => handleSelect(selected)}

                />
                {meta.touched && meta.error ? (
                    <span className="form-ant-error">{meta.error}</span>
                ) : null}
            </div>
        </div>
    );
}

SelectCustom.propTypes = {};

export default memo(SelectCustom);

