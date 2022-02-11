/**
 *
 * ShortlistedCandidates
 *
 */

import React, { memo } from 'react';
import Title from 'components/atoms/Title';

import { Descriptions, Badge } from 'antd';
import './styles.less';

function ShortlistedCandidates({ data }) {

  return (
   
    <div className="short-list-client">
      <Title level={3}>
        <p style={{ fontWeight: '800'}}>
          {data?.first_name || ''}, {`here are your shortlisted candidates
          for the`} {data?.job_title || ''} {`position at`} {data?.business_name + '.' || ''}
        </p>
      </Title>

      <Descriptions.Item label="Negotiated Amount">
       
        We are pleased to present our list of shortlisted candidates to you.
        {data?.application_count &&
        ` These candidates have been selected from a total pool of
        ${data?.application_count} applicants. `
        }
        Following a comprehensive recruitment campaign, we are confident each
        shortlisted candidate will meet or exceed the requirements of the role.
        <br /><br />
        {`After you've reviewed each candidate, please select either:`} <br />{' '}
        <br />
       {` 1. I'm Interested: we'll schedule an interview, on your behalf, at a
        mutually convenient time.`} <br />
        {`2. Let's Discuss: not ideal and need to understand more about the
        shortlisted candidate.`} <br /> <br />
        {`If you have any queries, please contact me on ${data?.phone_number}. Otherwise, I look
        forward to meeting you on to discuss.`} <br />
        <br />
        {`Kind regards,`}
        <br />
        <br /> <br />
        <span style={{fontWeight: 'bold'}}> {data?.person_in_charge}</span>
        <br />
        <span className="secondary-text" style={{ fontWeight: 'bold' }}> {data?.agency_name}</span>
        <br />
        <span style={{fontWeight: 'bold'}}>{data?.phone_number}</span>
        <br /> <br />
      </Descriptions.Item>
    </div>
  );
}

ShortlistedCandidates.propTypes = {};

export default memo(ShortlistedCandidates);
