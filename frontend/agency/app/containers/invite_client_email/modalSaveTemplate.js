import React, { memo, useEffect, useState, useMemo } from 'react';
import FormInfoDetail from 'components/FormInfoDetail'
import ButtonCustom from 'components/atoms/button'
import { Input, Row, Col, Descriptions, Button, Title } from 'antd';
import messages from './messages';
import { InputOldCustom } from 'components/InputCustom';
import SelectCustom from './selectCustomGetSelected';
import ModalCustom from 'components/ModalCustom'
import HeadingMedium from 'components/HeadingMedium'
import CloseButton from 'components/CloseButton'
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { Form } from 'formik-antd';







const ModalSaveTemplate = (props) => {
    const [toggleModal, setToggleModal] = useState(false);
     const options = [
    {
      value: 1,
      label: 'Client Invite',
    },
    {
      value: 2,
      label: 'Candidate Invite',
    },
    ];
    
     const initialModalValues = {
    templateSave: '',
    typeSave:''
    }
    
     const showModal = () => {
    setToggleModal(true);
   };
  
  const handleCancel = e => {
    setToggleModal(false);
    }
   

    return (
  
        
                 <Formik
                    enableReinitialize={true}
                    initialValues={initialModalValues}
                    //   onSubmit={handleSendMail}
          
            >
                {({ valuesModal, setFieldValue }) => (
                    <Form>
      
                   
                        <Row>
                          <Col xs={24} md={24} lg={24} xl={24}>
                            <InputOldCustom
                              styleformgroup={`mb-20`}
                              label="Template Name"
                              name="templateSave"
                              type="text"
                            />
                            </Col>                           
                          </Row>
                          
                          <Row>
                          <Col xs={24} md={24} lg={24} xl={24}>
                            <SelectCustom
                            // fast={true}
                              label="Type"
                              name="typeSave"
                              type="text"
                              options={options}
                          // onSelect={(selected) => setSelectedMail(selected)}
                      />
                            </Col>
                            
                            
                        </Row>
                        </Form>
                )}
                    
                        <ButtonCustom
                            className="btn-primary-gradient button-submit-inside"   
                          onClick = {() => console.log('valuesModal')}
                        >
                          <FormattedMessage {...messages.saveTitle} />
                </ButtonCustom>
                </Formik>
          
        
  
     
            

    );
}

export default ModalSaveTemplate;
