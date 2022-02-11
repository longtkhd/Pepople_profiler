import React from 'react';
import ClientList from 'containers/table_reuse/ClientList';
import ShortlistedCandidates from 'containers/table_reuse/ShortlistedCandidates';
import RecruitmentActivity from 'containers/table_reuse/RecruitmentActivity';

const WrapperDashboard = props => {
  return (
    <main>
      <div className="mb-50">{props.children}</div>
      <RecruitmentActivity {...props} />
      <ShortlistedCandidates {...props} />
      <ClientList {...props} />
    </main>
  );
};

export default WrapperDashboard;
