/**
 *
 * InputReadOnlyGroup
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Row, Col } from 'antd';
import InputCustom from 'components/InputCustom';
import IconCustom from 'components/IconCustom';
import TextAreaCustom from 'components/TextAreaCustom';
import { DeleteOutlined } from '@ant-design/icons';
import './styles.less';

function InputReadOnlyGroup(props) {
  switch (props.case) {
    case 'gender':
      return (
        <div className={`input-read-group mb-20`}>
          <Row align="middle" gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}>
            <Col>
              <div className={`input-icon`}>
                <IconCustom type={`icon-invalid-${props.icontype}`} />
              </div>
            </Col>
            <Col>
              <Row
                align="middle"
                gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 8]}
              >
                <Col>
                  <InputCustom
                    className="form-control read-only-bg w-150"
                    value={props.gender?.male ? props.gender?.male : null}
                    {...props}
                  />
                </Col>
                <Col>
                  <InputCustom
                    className="form-control read-only-bg w-220"
                    value={
                      props.gender?.maleIssue ? props.gender?.maleIssue : null
                    }
                    {...props}
                  />
                </Col>
                <Col>
                  <div className={`input-icon delete`}>
                    <DeleteOutlined />
                  </div>
                </Col>
              </Row>
              <Row
                align="middle"
                gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}
              >
                <Col>
                  <InputCustom
                    className="form-control read-only-bg w-150"
                    value={props.gender?.female ? props.gender?.female : null}
                    {...props}
                  />
                </Col>
                <Col>
                  <InputCustom
                    className="form-control read-only-bg w-220"
                    value={
                      props.gender?.femaleIssue
                        ? props.gender?.femaleIssue
                        : null
                    }
                    {...props}
                  />
                </Col>
                <Col>
                  <div className={`input-icon delete`}>
                    <DeleteOutlined />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      );
    case 'textarea' :
      return  (
        <div className={`input-read-group mb-20`}>
          <Row align="middle" gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}>
            <Col>
              <div className={`input-icon`}>
                <IconCustom type={`icon-invalid-${props.icontype}`} />
              </div>
            </Col>
            <Col>
              <TextAreaCustom
                className="form-control read-only-bg "
                value={props.issuevalue ? props.issuevalue : null}
                {...props}
              />
            </Col>
          </Row>
        </div>
      );
    default:
      return (
        <div className={`input-read-group mb-20`}>
          <Row align="middle" gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}>
            <Col>
              <div className={`input-icon`}>
                <IconCustom type={`icon-invalid-${props.icontype}`} />
              </div>
            </Col>
            <Col>
              <InputCustom
                className="form-control read-only-bg w-150"
                value={props.quantityvalue ? props.quantityvalue : null}
                {...props}
              />
            </Col>
            <Col>
              <InputCustom
                className="form-control read-only-bg w-220"
                value={props.issuevalue ? props.issuevalue : null}
                {...props}
              />
            </Col>
            <Col>
              <div className={`input-icon delete`}>
                <DeleteOutlined />
              </div>
            </Col>
          </Row>
        </div>
      );
  }
}

InputReadOnlyGroup.propTypes = {};

export default memo(InputReadOnlyGroup);
