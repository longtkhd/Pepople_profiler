import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Row, Col } from 'antd';
import Title from 'components/atoms/Title';
import IconDetailActive from 'images/icons/fill-26@3x-green.png';
// import IconDetail from 'images/icons/fill-26@3x.png';
import IconArrowNext from 'images/icons/group-7@3x.png';
import IconArrowNextActive from 'images/icons/group-7-2@3x.png';
import IconPassword from 'images/icons/group-24-2@3x.png';
import IconPassWordActive from 'images/icons/group-24@3x.png';
import './layoutFormStyles.less';

const LayoutForm = ({ children, step }) => {
  // console.log(step);
  return (
    <div className="wrapper-in-body">
      <div className="join-body__top">
        <div className="join-body__top-step">
          <Row justify="space-between" align="bottom">
            <Col>
              <div className="block-label">
                <div className="block-label__icon">
                  <img
                    src={IconDetailActive}
                    alt={'Icon'}
                    className="cover-image icon-label"
                  />
                </div>
                <div className="block-label__title">
                  <p className={`default-color active mesage`}>
                    <FormattedMessage {...messages.one} />
                  </p>
                </div>
              </div>
            </Col>
            <Col className="arrow-next-wrapper">
              {
                step === 2 ? (
                  <img src={IconArrowNextActive} alt={'Icon'} className="icon-label icon-arrow-custom" />
                ) : (
                    <img src={IconArrowNext} alt={'Icon'} className="icon-label icon-arrow-custom" />
                  )
              }
            </Col>
            <Col>
              <div className="block-label">
                <div className="block-label__icon">
                  {step === 2 ? (
                    <img
                      src={IconPassWordActive}
                      alt={'Icon'}
                      className="icon-password-custom"
                    />
                  ) : (
                      <img
                        src={IconPassword}
                        alt={'Icon'}
                        className="icon-password-custom"
                      />
                    )}
                </div>
                <div className="block-label__title">
                  <p className={`default-color mesage${step === 2 ? 'active' : ''}`}>
                    <FormattedMessage {...messages.two} />
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="join-body__bottom">
        <div className="heading-2 text-center heading-form ">
          <Title className="heading-2 text-center heading-form">
            {step == 2 ? (
              <FormattedMessage {...messages.heading2} />
            ) : (
              <FormattedMessage {...messages.heading} />
            )}
          </Title>
        </div>
        {children}
        {/* <JoinForm /> */}
      </div>
    </div>
  );
};

export default memo(LayoutForm);
