/**
 *
 * MainLayout
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CandidateReportNavigate from 'containers/candidate_report_navigate';
import './styles.less';
import HeaderFinishAssessmentPage from 'components/layout/HeaderFinishAssessmentPage';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
function MainLayout(props) {
  const { loading, children, location, status } = props;
  // console.log('props into mainlayout>>',location?.pathname);
  const [ifCandidateReport, setIfCandidateReport] = useState(false);

  useEffect(() => {
    if (location?.pathname.match(/candidate-report/g)) {
      setIfCandidateReport(true);
    }
    return () => setIfCandidateReport(false);
  }, []);

  return (
    <div className="main-layout" style={{ ...props.mainLayoutStyles }}>
      <header className="layout-header">
        {status ? <HeaderFinishAssessmentPage /> : <Header />}
      </header>
      <main
        className={`content ${ifCandidateReport ? 'content-candidate-report' : ''} ${status ? 'finish-assessment' : ''}`}
        style={{ ...props.contentStyles }}
      >
        {loading ? (
          <div className="spin-layout centered-layout">
            <Spin indicator={antIcon} />
          </div>
        ) : (
            children
          )}
      </main>
      {ifCandidateReport ? null : (
        <footer className="layout-footer">
          <Footer />
        </footer>
      )}
    </div>
  );
}

MainLayout.propTypes = {
  loading: PropTypes.bool,
};

export default memo(MainLayout);
