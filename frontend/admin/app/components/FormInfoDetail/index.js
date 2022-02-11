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

function FormInfoDetail(props) {
  return (
    <SectionWrapper>
      {props.case === 'use-form' ? (
        <Formik {...props}>
          <Form className="form">
            <div className="head">
              <div className="head-left">
                <Heading className={'head-title'}>{props.title}</Heading>
                {props.options}
              </div>
              <div className="head-right">{props.actions}</div>
            </div>
            <div className="body">{props.children}</div>
          </Form>
        </Formik>
      ) : (
        <>
          <div className="head">
            <div className="head-left">
              <Heading className={'head-title'}>{props.title}</Heading>
              {props.options}
            </div>
            <div className="head-right">{props.actions}</div>
          </div>
          <div className="body">{props.children}</div>
        </>
      )}
    </SectionWrapper>
  );
}

FormInfoDetail.propTypes = {};

export default memo(FormInfoDetail);
