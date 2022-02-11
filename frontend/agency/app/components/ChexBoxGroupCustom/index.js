/**
 *
 * ChexBoxGroupCustom
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './styles.less'
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Checkbox, Row, Col } from 'antd';
import ButtonWrapper from 'components/atoms/Button'
import CheckboxCustom from 'components/CheckboxCustom'

const CheckboxGroup = Checkbox.Group;

function ChexBoxGroupCustom() {
  const plainOptions = ['Website Notification', 'Email Notification'];
  const defaultCheckedList = ['Website Notification'];
  const data = [
    {
      label: 'Email has been updated by admin',
      value: '1'
    },
    {
      label: 'Candidate has started the assessment'
    },
    {
      label: 'Candidate has completed the assessment'
    },
    {
      label: 'Client has viewed candidate reports'
    },
    {
      label: 'Client provided feedback on candidate reports'
    },
    {
      label: 'People Profiler product enhancement'
    },
    {
      label: 'Company annoncements'
    }
  ]

  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [checkedList, setCheckedList] = useState(defaultCheckedList)
  const onCheckAllChange = (e) => {
    setIndeterminate(false);
    setCheckAll(e.target.checked)
    setCheckedList(e.target.checked ? plainOptions : [])

  }
  // const onChange = (checkedList) => {
  //   setCheckedList(checkedList)
  //   setCheckAll(checkedList.length === plainOptions.length)
  //   setIndeterminate(!!checkedList.length && (checkedList.length < plainOptions.length))

  // }
  function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }


  return (
    <div>
      {/* <CheckboxCustom label='test'></CheckboxCustom> */}
      <div className="button-checkbox">

        <ButtonWrapper className="btn-default-outline  " style={{ margin: '0 5px' }} onClick={onCheckAllChange}>
          <FormattedMessage {...messages.enableAll} />
        </ButtonWrapper>
        <ButtonWrapper className="btn-default-outline  " style={{ margin: '0 5px' }}  >
          <FormattedMessage {...messages.disableAll} />
        </ButtonWrapper>

      </div>
      {
        data.map((x) => (
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Row justify="space-between" style={{ padding: '20px 0' }}>
              <Col>
                {/* <Checkbox
                  // indeterminate={indeterminate}
                  onChange={onChange}
                // checked={checkAll}
                > */}
                {x.label}
                {/* </Checkbox> */}
              </Col>
              <Col>

                <CheckboxGroup options={plainOptions} onChange={onChange} />
              </Col>
            </Row>
          </div>
        ))
      }
    </div>

    // <div>


    //   <div style={{ borderBottom: '1px solid #E9E9E9' }}>
    //     <Row justify="space-between">
    //       <Col>
    //         <Checkbox
    //           indeterminate={indeterminate}
    //           onChange={onCheckAllChange}
    //           checked={checkAll}
    //         >
    //           Client provided feedback on candidate reports
    //       </Checkbox>
    //       </Col>
    //       <Col>
    //         <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
    //       </Col>
    //     </Row>
    //   </div>







    // </div >

  );
}

ChexBoxGroupCustom.propTypes = {};

export default memo(ChexBoxGroupCustom);
