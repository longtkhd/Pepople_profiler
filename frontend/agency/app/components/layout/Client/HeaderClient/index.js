/**
 *
 * HeaderClient
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import './styles.less';
import { imageEncode } from 'utils/companyImageHelper';
import ButtonClose from '../../../ButtonClose'

const WrapperHeader = styled.header`
  box-shadow: 0 1px 0 0 #e5e5e5;
  background-color: ${props => props.color || "#1e1e2d"}
`;
const Rectangle = styled.div`
  height: 5px;
  background: #b7b9c1;
  width: 100%
`
const RectangleChild = styled.span`
  height: 5px;
  background: red;
  width: 5px;
  float: right;
  margin-right: 5%;
`
function HeaderClient({ jobType, logo, history, inviteToken, fontColor }) {
  const image = imageEncode(logo);

  return (
    <>
      <WrapperHeader className="header-client" color={fontColor}>
        <div className="header-item">
          {logo && (
            <div className="text-welcome">
              <Link to="#" className="logo-link">
                <img src={image} style={{ height: '50px' }} />
              </Link>
            </div>
          )}
          {inviteToken && (
            <div className="header-item close-icon">
              <ButtonClose onClick={() => {
                history.push(`/client-job-dashboard/${inviteToken}`)
              }} />
            </div>
          )}
        </div>

      </WrapperHeader>
      {jobType === "Contract" ?
        <Rectangle>
          <RectangleChild />
        </Rectangle>
        : null
      }
    </>
  );
}

HeaderClient.propTypes = {
  logo: PropTypes.object,
  history: PropTypes.object,
  showBack: PropTypes.bool,
  fontColor: PropTypes.string,
};

export default memo(HeaderClient);
