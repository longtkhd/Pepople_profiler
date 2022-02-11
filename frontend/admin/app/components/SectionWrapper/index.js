/**
 *
 * SectionWrapper
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Heading from 'components/Heading';


function SectionWrapper({ children, heading, className,classHeading }) {
  return (
    <section className={`section ${className}`}>
      <Heading className={`heading-2 section-title ${classHeading}`}>{heading}</Heading>
      <div className={`section-body`}>
        {children}
      </div>
    </section>
  );
}

SectionWrapper.propTypes = {};

export default memo(SectionWrapper);
