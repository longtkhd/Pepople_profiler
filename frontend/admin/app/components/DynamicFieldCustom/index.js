/**
 *
 * DynamicFieldCustom
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Input, Row, Col } from 'antd';
import './styles.less';

function DynamicFieldCustom(props) {
  const [fields, setFields] = useState([
    {
      contactName: '',
      contactNumber: '',
      email: '',
    },
  ]);

  const onChangeInput = (index, { target }) => {
    const values = [...fields];
    values[index][target.name] = target.value;
    setFields(values);
  };

  const onAdd = () => {
    setFields([
      ...fields,
      {
        contactName: '',
        contactNumber: '',
        email: '',
      },
    ]);
  };
  const onRemove = index => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
  };

  return (
    <div className="dynamic-field">
      {fields.map((field, i) => (
        <div key={i}>
          <Row justify="space-between">
            <Col>
              <Input
                styleformgroup={`mb-20`}
                id="contactName"
                name="contactName"
                type="text"
                value={field.contactName}
                onChange={event => onChangeInput(i, event)}
              />
            </Col>
            <Col>
              <Input
                styleformgroup={`mb-20`}
                id="contactNumber"
                name="contactNumber"
                type="text"
                value={field.contactNumber}
                onChange={event => onChangeInput(i, event)}
              />
            </Col>
            <Col>
              <Input
                styleformgroup={`mb-20`}
                id="email"
                name="email"
                type="text"
                value={field.email}
                onChange={event => onChangeInput(i, event)}
              />
            </Col>
            <Col>
              <Row gutter={[8, 0]}>
                <Col onClick={onAdd}>Addd</Col>
                <Col onClick={() => onRemove(i)}>Delete</Col>
              </Row>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
}

DynamicFieldCustom.propTypes = {};

export default memo(DynamicFieldCustom);
