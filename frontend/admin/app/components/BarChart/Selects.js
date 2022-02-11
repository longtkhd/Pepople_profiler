import React, { useState } from 'react';
import {
  Select
} from 'antd';

import SelectCustom from 'components/SelectCustom'
import FormInfoDetail from 'components/FormInfoDetail'


const { Option } = Select;
import styled from 'styled-components'

const provinceData = ['All', '10'];

const cityData = {
  All: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};



const Selects = (props) => {

  const { data } = props;
  // const a

  // const [state, setState] = useState({
  //   cities: cityData[provinceData[0]],
  //   secondCity: cityData[provinceData[0]][0],
  // });

  // const handleProvinceChange = value => {
  //   setState({
  //     cities: cityData[value],
  //     secondCity: cityData[value][0],
  //   });
  // };


  return (

    <FormInfoDetail
      // title={<FormattedMessage {...messages.updateProject} />}

      case="use-form"
      // initialValues={
      //   initialAssessment
      // }
      enableReinitialize
    // validationSchema={projectAssessmentSchema}
    // onSubmit={(values) => {
    //   handleUpdate(values)

    // }}

    >
      <>
        <SelectCustom styleformgroup={`mb-20`}
          starIcon={true}
          label="Industry Name"
          id="industry"
          name="industry"
        // options={IndustryNameOptions}
        // defaultValue={1}
        >
        </SelectCustom>
      </>

    </FormInfoDetail>

  )
}

export default Selects
