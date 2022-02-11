/**
 *
 * ProjectAssessment
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
import {
  makeSelectProjectAssessment,
  makeSelectDeleteProjectAssessmentSuccess,
  makeSelectDeleteProjectAssessmentError
} from './selectors';
import deleteProjectAssessmentDefault from './actions'
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail'
import ActionType from 'components/TableCustom/ActionType'
import { Row, Col } from 'antd'
import TableCustom from 'components/TableCustom'
import Button from 'components/atoms/Button';
import getProjectAssessmentDefault from 'containers/common_provider/project_assessment/actions'
import { makeSelectGetProjectAssessmentInfo } from 'containers/common_provider/project_assessment/selectors'
import { openNotification } from 'utils/notification';



export function ProjectAssessment(props) {
  const {
    history,
    onGetProjectAssessment,
    projectAssessmentInfo,
    onDeleteProject,
    deleteSuccess,
    deleteError
  } = props;
  useInjectReducer({ key: 'projectAssessment', reducer });


  const [projectAssessment, setProjectAssessment] = useState(null)

  useEffect(() => {
    onGetProjectAssessment();
    return () => { }
  }, [])

  useEffect(() => {
    console.log(projectAssessment)
    if (projectAssessmentInfo) {
      setProjectAssessment(projectAssessmentInfo)
    }
    return () => { }
  }, [projectAssessmentInfo])

  const handleDelete = (id) => {
    onDeleteProject(id)
  }

  useEffect(() => {
    if (deleteSuccess) {
      openNotification('success', 'Delete Project Assessment success ');
      onGetProjectAssessment()
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (deleteError) {
      openNotification('error', 'Delete Project Assessment success ');
      onGetProjectAssessment()
    }
  }, [deleteError])





  const ClientColumns = [
    {
      title: ' NAME',
      dataIndex: 'name',
      key: '1',
      width: '20%'
      // render: text => <p>{text}</p>,
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: '2',
      width: '20%',
      render: industry => <p>{industry.name}</p>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: '3',
      // width: '30%'
      render: type => <p>{type.name}</p>,
    },
    {
      title: 'Project Accesst Key',
      dataIndex: 'project_access_key',
      key: '4',
      // render: text => <p>{text}</p>,
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: 'action',
      render: (text, record) => (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType onClick={() => history.push(`edit-project-assessment/${record.id}`)} type="edit" />
          </Col>
          <Col>
            <ActionType type="delete" onClick={() => handleDelete(record.id)} />
          </Col>
        </Row>
      ),
      align: 'right'
    },

  ];
  return (
    <div>
      <Helmet>
        <title>ProjectAssessment</title>
        <meta name="description" content="Description of ProjectAssessment" />
      </Helmet>

      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />



        </div>
        <div className="project-assessment">
          <FormInfoDetail
            title={<FormattedMessage {...messages.title} />}
            case="use-form"
            actions={
              <Row className="action-group" gutter={[8, 0]}>
                <Col>
                  <Button
                    className="btn-default-outline "
                    onClick={() => history.push('/new-project-assessment')}
                  >
                    {/* <EditOutlined className="icon-btn" /> */}
                    <FormattedMessage {...messages.add} />
                  </Button>
                </Col>
              </Row>
            }
          >
            <TableCustom dataSource={projectAssessment} columns={ClientColumns} rowKey={record => record.id} />
          </FormInfoDetail>
        </div>


      </MainLayout>
    </div>
  );
}

ProjectAssessment.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  projectAssessment: makeSelectProjectAssessment(),
  projectAssessmentInfo: makeSelectGetProjectAssessmentInfo(),
  deleteSuccess: makeSelectDeleteProjectAssessmentSuccess(),
  deleteError: makeSelectDeleteProjectAssessmentError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetProjectAssessment: () => dispatch(getProjectAssessmentDefault()),
    onDeleteProject: (id) => dispatch(deleteProjectAssessmentDefault(id))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ProjectAssessment);
