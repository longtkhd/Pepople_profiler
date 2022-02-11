/**
 *
 * FormInfoDetail
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import SectionWrapper from 'components/SectionWrapper';
import Heading from 'components/Heading';
import { Formik, Form } from 'formik';
import './styles.less';

function FormInfoNoTitle(props) {
    return (
        <SectionWrapper>
            {props.case === 'use-form' ? (
                <Formik {...props}>
                    <Form className="form" style={{ paddingTop: '25px' }}>
                        <div className="head noTitle">
                            <div className="head-left">
                                <div className="body">{props.children}</div>
                                {props.options}
                            </div>
                            <div className="head-right">{props.actions}</div>
                        </div>

                    </Form>
                </Formik>
            ) : (
                    <>
                        <div className="">
                            <div className="head-left">
                                <div className="body">{props.children}</div>
                                {props.options}
                            </div>
                            <div className="head-right">{props.actions}</div>
                        </div>

                    </>
                )}
        </SectionWrapper>
    );
}

FormInfoNoTitle.propTypes = {};

export default memo(FormInfoNoTitle);
