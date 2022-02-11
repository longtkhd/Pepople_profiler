/**
 *
 * InputReadOnlyGroup
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Row, Col } from 'antd';
import InputCustom from 'components/InputCustom';
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import IconCustom from 'components/IconCustom';
import TextAreaCustom from 'components/TextAreaCustom';
import { Form } from 'formik-antd';
import { DeleteOutlined } from '@ant-design/icons';
import './styles.less';

function InputReadOnlyGroup(props) {
  // console.log(`props?>>`, props);
  const [removeGenderField, setRemoveGenderField] = useState(false);
  const [toggleRemoveField, setToggleRemoveField] = useState(false);

  const [removeNormalField, setRemoveNormalField] = useState(false);
  const [toggleNormalField, setToggleNormalField] = useState(false);

  useEffect(() => {
    if (removeGenderField) {
      props?.remove(props.namevaluemale, '');
      props?.remove(props.namevaluefemale, '');
    }
  }, [removeGenderField]);

  useEffect(() => {
    if (removeNormalField) {
      props?.remove(props.namevalue, '');
    }
  }, [removeNormalField]);

  switch (props.case) {
    case 'gender':
      return (
        <div className={`input-read-group input-gender `}>
          <CombinedCustom
            width={600}
            toggleModal={toggleRemoveField}
            title={`Are you sure?`}
            content={`Are you sure you want to delete this field in the recruitment activity table?`}
            footer={[
              <Row gutter={[8, 8]} justify="center" align="middle">
                <Col>
                  <ButtonCustom
                    className="btn-default-outline"
                    onClick={() => {
                      setToggleRemoveField(false);
                      setRemoveGenderField(false);
                    }}
                  >
                    {`Cancel`}
                  </ButtonCustom>
                </Col>
                <Col>
                  <ButtonCustom
                    className="btn-primary-gradient"
                    onClick={() => {
                      setToggleRemoveField(false);
                      setRemoveGenderField(true);
                    }}
                  >
                    {`Remove`}
                  </ButtonCustom>
                </Col>
              </Row>,
            ]}
          />
          <Row align="middle" gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 16]}>
            <Col>
              <div className={`input-icon`}>
                <IconCustom type={props.icontype} />
              </div>
            </Col>
            <Col>
              <Row
                align="middle"
                gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 4]}
              >
                <Col>
                  <InputCustom
                    fast={true}
                    className="ant-custom-input read-only-bg w-150"
                    placeholder={
                      props?.placeholdervalue && props.placeholdervalue
                    }
                    name={props?.namevaluemale && props.namevaluemale}
                    // {...props}
                  />
                </Col>
                <Col>
                  <InputCustom
                    disabled={true}
                    fast={true}
                    disabled
                    className="ant-custom-input read-only-bg w-220"
                    name={props?.namekeymale && props.namekeymale}
                    placeholder={
                      props?.placeholdermale && props.placeholdermale
                    }
                    // {...props}
                  />
                </Col>
              </Row>
              <Row
                align="middle"
                gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}
              >
                <Col>
                  <InputCustom
                    fast={true}
                    className="ant-custom-input read-only-bg w-150"
                    placeholder={
                      props?.placeholdervalue && props.placeholdervalue
                    }
                    name={props?.namevaluefemale && props.namevaluefemale}
                    // {...props}
                  />
                </Col>
                <Col>
                  <InputCustom
                    disabled
                    fast={true}
                    className="ant-custom-input read-only-bg w-220"
                    name={props?.namekeyfemale && props.namekeyfemale}
                    // {...props}
                    placeholder={
                      props?.placeholderfemale && props.placeholderfemale
                    }
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <div
                className={`input-icon delete`}
                onClick={() => {
                  setToggleRemoveField(true);
                  // props?.remove(props.namekeymale, '');
                  // props?.remove(props.namevaluemale, '');
                  // // props?.remove(props.namekeyfemale, '');
                  // props?.remove(props.namevaluefemale, '');
                }}
              >
                <i className="action-icon far fa-trash-alt" />
              </div>
            </Col>
          </Row>
        </div>
      );
    case 'textarea':
      return (
        <div className={`input-read-group `}>
          <Row align="" gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}>
            <Col>
              <div className={`input-icon`}>
                <IconCustom type={props.icontype} />
              </div>
            </Col>
            <Col>
              <Form.Item
                // hasFeedback={true}
                // showValidateSuccess={true}
                name={props?.namevalue && props.namevalue}
              >
                <TextAreaCustom
                  className="ant-custom-input textarea-custom read-only-bg "
                  name={props?.namevalue && props.namevalue}
                  // {...props}
                  placeholder={
                    props?.placeholdertextarea && props.placeholdertextarea
                  }
                />
              </Form.Item>
            </Col>
            <Col />
          </Row>
        </div>
      );
    default:
      return (
        <div className={`input-read-group `}>
          <CombinedCustom
            width={600}
            toggleModal={toggleNormalField}
            title={`Are you sure?`}
            content={`Are you sure you want to delete this field in the recruitment activity table?`}
            footer={[
              <Row gutter={[8, 8]} justify="center" align="middle">
                <Col>
                  <ButtonCustom
                    className="btn-default-outline"
                    onClick={() => {
                      setToggleNormalField(false);
                      setRemoveNormalField(false);
                    }}
                  >
                    {`Cancel`}
                  </ButtonCustom>
                </Col>
                <Col>
                  <ButtonCustom
                    className="btn-primary-gradient"
                    onClick={() => {
                      setRemoveNormalField(true);
                      setToggleNormalField(false);
                    }}
                  >
                    {`Remove`}
                  </ButtonCustom>
                </Col>
              </Row>,
            ]}
          />
          <Row align="" gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}>
            <Col>
              <div className={`input-icon`}>
                {/* {console.log(`>>>iconType>>`,props.icontype)} */}
                <IconCustom type={props.icontype} />
              </div>
            </Col>
            <Col>
              <Form.Item
                // hasFeedback={true}
                // showValidateSuccess={true}
                name={props?.namevalue && props.namevalue}
              >
                <InputCustom
                  fast={true}
                  placeholder={
                    props?.placeholdervalue && props.placeholdervalue
                  }
                  className="ant-custom-input read-only-bg w-150"
                  name={props?.namevalue && props.namevalue}
                  // value={props.quantityvalue ? props.quantityvalue : null}
                  // {...props}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                // hasFeedback={true}
                // showValidateSuccess={true}
                name={props?.namekey && props.namekey}
              >
                <InputCustom
                  disabled
                  fast={true}
                  placeholder={
                    props?.placeholdertitle && props.placeholdertitle
                  }
                  className="ant-custom-input read-only-bg w-220"
                  name={props?.namekey && props.namekey}
                  // value={props.issuevalue ? props.issuevalue : null}
                  // {...props}
                />
              </Form.Item>
            </Col>
            <Col>
              {/* {console.log(`>>>props>>`,props?.indexfield)} */}
              <div className={`input-icon delete`}>
                <i
                  className="action-icon far fa-trash-alt"
                  onClick={() => {
                    setToggleNormalField(true)
                    // props?.remove(props.namekey, '');
                    // props?.remove(props.namevalue, '');
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      );
  }
}

InputReadOnlyGroup.propTypes = {};

export default memo(InputReadOnlyGroup);
