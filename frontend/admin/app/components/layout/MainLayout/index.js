/**
 *
 * MainLayout
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import './styles.less';

function MainLayout(props) {
  const { children, mainLayoutStyles } = props;
  return (
    <div className="main-layout" style={{...mainLayoutStyles}}>
      <header className="layout-header">
        <Header />
      </header>
      <main className="content">
        {children}
      </main>
      <footer className="layout-footer">
        <Footer />
      </footer>
    </div>
  );
}

MainLayout.propTypes = {};

export default memo(MainLayout);
