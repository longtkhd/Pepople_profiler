/**
 *
 * AdminAssessmentType
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import messages from './messages';

import MainLayout from 'components/layout/MainLayout'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import ButtonBack from 'components/ButtonBack'
import Button from 'components/atoms/Button'
import getAssessmentTypeDefault from 'containers/common_provider/get_assessment_type/actions'
import { makeSelectGetAssessmentType } from 'containers/common_provider/get_assessment_type/selectors'
import TableCustom from 'components/TableCustom'
// import { Table, Tag, Space } from 'antd';
import ActionType from 'components/TableCustom/ActionType'
import deleteAssessmentTypeDefault from './actions';
import { makeSelectAdminAssessmentType, makeSelectAdminAssessmentTypeSuccess, makeSelectAdminAssessmentTypeError } from './selectors'
import { openNotification } from 'utils/notification';



export function AdminAssessmentType(props) {
  const {
    history,
    onGetAssessmentType,
    assessmentType,
    onDeleteAssessmentType,
    deleteSuccess,
    deleteError

  } = props;



  const handleDelete = (id) => {
    onDeleteAssessmentType(id)
  }


  const [typeData, setTypeData] = useState(null)
  useInjectReducer({ key: 'adminAssessmentType', reducer });


  const ClientColumns = [
    {
      title: ' NAME',
      dataIndex: 'name',
      key: '1',
      // render: text => <p>{text}</p>,
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: 'action',
      render: (text, record) => (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType onClick={() => history.push(`edit-assessment-type/${record.id}`)} type="edit" />
          </Col>
          <Col>
            <ActionType type="delete" onClick={() => handleDelete(record.id)} />
          </Col>


        </Row>
      ),
      align: 'right'


    },

  ];
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  useEffect(() => {

    onGetAssessmentType()

    return () => { }
  }, []);

  useEffect(() => {
    if (assessmentType) {
      setTypeData(assessmentType)
      // console.log(assessmentType)
    }
    return () => { }
  }, [assessmentType])
  useEffect(() => {
    if (deleteSuccess) {
      openNotification('success', 'Delete Assessment Type success ');
      onGetAssessmentType()

    }
  }, [deleteSuccess])
  return (
    <div>
      <Helmet>
        <title>AdminAssessmentType</title>
        <meta name="description" content="Description of AdminAssessmentType" />
      </Helmet>


      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history}></ButtonBack>
        </div>
        <div className="admin-assessment-type">
          <FormInfoDetail
            title={<FormattedMessage {...messages.title} />}
            case='use-form'
            actions={
              <Row className="action-group" gutter={[8, 0]}>
                <Col>
                  <Button
                    className="btn-default-outline "
                    onClick={() => history.push('/new-assessment-type')}
                  >
                    {/* <EditOutlined className="icon-btn" /> */}
                    <FormattedMessage {...messages.add} />
                  </Button>
                </Col>
              </Row>
            }

          >

            <TableCustom dataSource={typeData} columns={ClientColumns} rowKey={record => record.id} />


          </FormInfoDetail>
        </div>

      </MainLayout>
    </div>
  );
}

AdminAssessmentType.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminAssessmentType: makeSelectAdminAssessmentType(),
  assessmentType: makeSelectGetAssessmentType(),
  deleteSuccess: makeSelectAdminAssessmentTypeSuccess(),
  deleteError: makeSelectAdminAssessmentTypeError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAssessmentType: () => dispatch(getAssessmentTypeDefault()),
    onDeleteAssessmentType: (id) => dispatch(deleteAssessmentTypeDefault(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminAssessmentType);
