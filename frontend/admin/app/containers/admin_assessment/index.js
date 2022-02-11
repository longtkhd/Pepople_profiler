/**
 *
 * AdminAssessment
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
import { makeSelectAdminAssessment } from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import TableCustom from 'components/TableCustom'
import Status from 'components/Status'
import ActionType from 'components/TableCustom/ActionType'
import { Row, Col } from 'antd'
import './styles.less'
import FormInfoDetail from 'components/FormInfoDetail'
import Button from 'components/atoms/Button';
import getAssessmentDefault from 'containers/common_provider/get_assessment/actions'
import { makeSelectGetAssessment } from 'containers/common_provider/get_assessment/selectors'
import deleteAssessmentDefault from './actions'
import { makeSelectAdminAssessmentSuccess, makeSelectAdminAssessmentError } from './selectors'
import { openNotification } from 'utils/notification';

export function AdminAssessment(props) {
  const {
    history,
    onGetAssIndustry,
    assessmentIndustry,
    onDeleteAssIndustry,
    deleteSuccess,
    deleteError
  } = props;
  useInjectReducer({ key: 'adminAssessment', reducer });

  const [IndustryData, setIndustryData] = useState(null)



  useEffect(() => {
    onGetAssIndustry()

    return () => { }
  }, []);

  useEffect(() => {
    if (assessmentIndustry) {
      setIndustryData(assessmentIndustry)
    }
    return () => { }
  }, [assessmentIndustry])

  useEffect(() => {
    if (deleteSuccess) {
      openNotification('success', 'Delete Assessment Industry success ');
      onGetAssIndustry()



    }
  }, [deleteSuccess])

  useEffect(() => {
    if (deleteError) {
      openNotification('error', 'Delete Assessment Industry success ');
      onGetAssIndustry()



    }
  }, [deleteError])

  const handleDelete = (id) => {
    onDeleteAssIndustry(id)
  }




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
            <ActionType onClick={() => history.push(`edit-assessment-industry/${record.id}`)} type="edit" />
          </Col>
          <Col>
            <ActionType type="delete" onClick={() => handleDelete(record.id)} />
          </Col>


        </Row>
      ),


    },

  ];

  return (
    <div>
      <Helmet>
        <title>AdminAssessment</title>
        <meta name="description" content="Description of AdminAssessment" />
      </Helmet>
      <div className="btn-back">
        <ButtonBack history={history}></ButtonBack>


      </div>
      <MainLayout>
        <div className="admin-assessment">
          <FormInfoDetail
            title={<FormattedMessage {...messages.title} />}
            case="use-form"
            actions={
              <Row className="action-group" gutter={[8, 0]}>
                <Col>
                  <Button
                    className="btn-default-outline "
                    onClick={() => history.push('/new-assessment-industry')}
                  >
                    {/* <EditOutlined className="icon-btn" /> */}
                    <FormattedMessage {...messages.add} />
                  </Button>
                </Col>
              </Row>
            }
          >
            <TableCustom dataSource={IndustryData} columns={ClientColumns} rowKey={record => record.id} />
          </FormInfoDetail>
        </div>

      </MainLayout>
    </div>
  );
}

AdminAssessment.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminAssessment: makeSelectAdminAssessment(),
  assessmentIndustry: makeSelectGetAssessment(),
  deleteSuccess: makeSelectAdminAssessmentSuccess(),
  deleteError: makeSelectAdminAssessmentError()

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAssIndustry: () => dispatch(getAssessmentDefault()),
    onDeleteAssIndustry: (id) => dispatch(deleteAssessmentDefault(id))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminAssessment);
