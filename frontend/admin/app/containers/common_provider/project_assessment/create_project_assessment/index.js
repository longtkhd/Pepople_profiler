// /**
//  *
//  * CreateProjectAssessment
//  *
//  */

// import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
// import { createStructuredSelector } from 'reselect';
// import { compose } from 'redux';

// import { useInjectReducer } from 'utils/injectReducer';
// import makeSelectCreateProjectAssessment from './selectors';
// import reducer from './reducer';
// import messages from './messages';
// import MainLayout from 'components/layout/MainLayout'
// import ButtonBack from 'components/ButtonBack'
// import FormInfoDetail from 'components/FormInfoDetail'
// import { Row, Col } from 'antd'
// import Button from 'components/atoms/Button'
// import InputCustom from 'components/InputCustom';
// export function CreateProjectAssessment(props) {
//   const { history } = props;
//   useInjectReducer({ key: 'createProjectAssessment', reducer });
//   const initialAssessment = {
//     name: '',
//     project_access_key: '',
//     insdustry: '',
//     type: ''
//   }
//   return (
//     <div>
//       <Helmet>
//         <title>CreateProjectAssessment</title>
//         <meta
//           name="description"
//           content="Description of CreateProjectAssessment"
//         />
//       </Helmet>
//       <MainLayout>
//         <div className="btn-back">
//           <ButtonBack history={history} />

//           <div className="project-assessment-form">
//             <FormInfoDetail
//               title={<FormattedMessage {...messages.addProject} />}
//               actions={
//                 <Row className="action-group" gutter={[8, 0]}>
//                   <Col>
//                     <Button className="btn-default-outline ">
//                       {/* <EditOutlined className="icon-btn" /> */}
//                       <FormattedMessage {...messages.addNew} />
//                     </Button>
//                   </Col>

//                 </Row>
//               }
//               case="use-form"
//               initialValues={
//                 initialAssessment
//               }
//             // validationSchema={createSchema}
//             // onSubmit={(values, { resetForm }) => {
//             //   handleSubmit(values)
//             //   resetForm({ values: '' })
//             // }}

//             >

//               <Row
//                 justify="start"
//                 align="left"
//                 gutter={[
//                   { xs: 8, sm: 16, md: 24, lg: 32 },
//                   { xs: 8, sm: 16, md: 24, lg: 32 },
//                 ]}
//               >
//                 <Col xs={24} sm={12} md={12} lg={6}>
//                   <InputCustom
//                     starIcon={true}
//                     styleformgroup={`mb- 20`}
//                     label="name"
//                     name="name"
//                     type="text"
//                   />
//                 </Col>
//                 <Col xs={24} sm={12} md={12} lg={6}>
//                   <InputCustom
//                     starIcon={true}
//                     styleformgroup={`mb- 20`}
//                     label="Industry"
//                     name="industry"
//                     type="text"
//                   />
//                 </Col>
//                 <Col xs={24} sm={12} md={12} lg={6}>
//                   <InputCustom
//                     starIcon={true}
//                     styleformgroup={`mb- 20`}
//                     label="Type"
//                     name="type"
//                     type="text"
//                   />
//                 </Col>
//                 <Col xs={24} sm={12} md={12} lg={6}>
//                   <InputCustom
//                     starIcon={true}
//                     styleformgroup={`mb- 20`}
//                     label="Project Access Key"
//                     name="name"
//                     type="text"
//                   />
//                 </Col>


//               </Row>

//             </FormInfoDetail>
//           </div>

//         </div>
//       </MainLayout>
//     </div>
//   );
// }

// CreateProjectAssessment.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

// const mapStateToProps = createStructuredSelector({
//   createProjectAssessment: makeSelectCreateProjectAssessment(),
// });

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }

// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// );

// export default compose(
//   withConnect,
//   memo,
// )(CreateProjectAssessment);
