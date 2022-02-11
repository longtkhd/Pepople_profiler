/**
 *
 *CandidateReport Layout
 *
 */

import React, { memo } from 'react';
import CandidateHeader from 'components/layout/CandidateHeader';
import CandidateFooter from 'components/layout/CandidateFooter';
import './styles.less';

function CandidateReportLayout(props) {
  const { children, history} = props;
  return (
    <div className="cadidate-layout">
      <header className="layout-header">
        <CandidateHeader history={history} userInfo={props.userInfo} logo={props.logo} color={props?.color}/>
      </header>
      <main className="content">{children}</main>
      <footer className="layout-footer" style={{ background: props?.color}}>
        <CandidateFooter />
      </footer>
    </div>
  );
}

CandidateReportLayout.propTypes = {};

export default memo(CandidateReportLayout);
