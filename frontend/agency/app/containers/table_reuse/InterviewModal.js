import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Row, Col, Spin, Input, Radio, Table } from 'antd';
import ButtonCustom from 'components/atoms/Button';
import ModalCustom from 'components/ModalCustom';
import './styles/client-list.less';
import * as jobService from 'services/api/jobService';
import moment from 'moment';

const InterviewModal = props => {
  const {
    toggleInterviewModal,
    showInterviewModal,
    handleInterviewSubmit,
    handleInterviewCancel,
    shortlistedCandidateList,
    selectedContact,
  } = props;
  const [selectedInterviews, setSelectedInterviews] = useState({});
  const [candidateInterviewList, setCandidateInterviewList] = useState([]);
  const [initInterviewList, setInitInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [arrayCollapseCadidate, setArrayCollapseCadidate] = useState([]);


  useEffect(() => {
    if (toggleInterviewModal) {
      loadList();
      getTimeOfJob();
    }
  }, [toggleInterviewModal]);

  const collapseCadidate = (id) => {
    if (arrayCollapseCadidate.includes(id) ) {
        arrayCollapseCadidate.splice(arrayCollapseCadidate.indexOf(id), 1)
        setArrayCollapseCadidate([ ...arrayCollapseCadidate ]);

    } else {
      arrayCollapseCadidate.push(id)
      setArrayCollapseCadidate([ ...arrayCollapseCadidate ]);
    }
  }
  const interviewColumns = [
    {
      title: ' ',
      key: 'id',
      dataIndex: 'id',
      render: (id, row) => (
        <>
          <Radio disabled={isDisableTime(row)} onClick={() => unSelectTime(row)} style={{ color: '#3abcca' }} value={id} />
        </>
      ),
      align: 'left',
      width: '10%',
    },
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
      align: 'left',
      width: '20%',
    },
    {
      title: 'FROM',
      dataIndex: 'time_start',
      key: 'time_start',
      render: time_start => <span>{moment(time_start).format('HH:mm A')}</span>,
      align: 'left',
      width: '20%',
    },
    {
      title: 'TO',
      dataIndex: 'time_end',
      key: 'time_end',
      render: time_end => <span>{moment(time_end).format('HH:mm A')}</span>,
      align: 'left',
      width: '20%',
      },
    {
        title: 'CONTACT',
        dataIndex: 'contact',
        key: 'contact',
        render: contact => <span>{contact}</span>,
        align: 'left',
        width: '30%',
    }
  ];

  const isDisableTime = (interview) => {
    const values = Object.values(selectedInterviews);
    const keys = Object.keys(selectedInterviews);
    return values.some(x => interview._id === x && selectedInterviews[interview.candidate_id] !== x);
  }

  const unSelectTime = (interview) => {
    if(selectedInterviews[interview.candidate_id] === interview._id) {
      delete selectedInterviews[interview.candidate_id];
      setSelectedInterviews({ ...selectedInterviews });
    }
  }

  const getTimeOfJob = async () => {
    if (selectedContact) {
      try {
        const result = await jobService.getTimeOfJob(
          selectedContact.job_id,
          selectedContact.client_contact_id,
        );
        if (result.data) {
          const selectedInterview = {};
          const { data } = result;
          for (let i = 0; i < data.data.length; i++) {
            selectedInterview[`${data.data[i].candidate_id}`] = data.data[i].time._id;
            selectedInterview[`info-${data.data[i].candidate_id}`] = candidateInterviewList[0]?.interviews[0].info || ""
          }
          setSelectedInterviews(selectedInterview);
          setInitInterviewList(data.data)
        }
      } catch (err) {
        console.log(err);
      } finally {
      }
    }
  };

  const loadList = async () => {
    try {
      setLoading(true);
      if (shortlistedCandidateList && shortlistedCandidateList.length) {
        const results = [];
        for (let i = 0; i < shortlistedCandidateList.length; i++) {
          const interviewsResult = await jobService.getDateInterviewOfCandidate(
            selectedContact.job_id,
            shortlistedCandidateList[i].id,
          );

          const result = {
            ...shortlistedCandidateList[i],
            interviews: interviewsResult.data.map(x => {
              const result = {
                ...x,
                key: x.id,
                candidate_id: shortlistedCandidateList[i].id
              };

              return result;
            }),
          };
          results.push(result);
        }

        setCandidateInterviewList(results);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    handleInterviewSubmit(selectedInterviews);
  };

    const { TextArea } = Input;
    
  return (
    <ModalCustom
      bodyStyle={{
        backgroundColor: '#f4f6f9',
        maxHeight: 750,
        overflowY: 'scroll',
      }}
      width={1100}
      showModal={showInterviewModal}
      toggleModal={toggleInterviewModal}
      handleOk={submit}
      handleCancel={handleInterviewCancel}
      wrapClassName={`set-interview-modal`}
      title={
        <span className={`text-22-bold add-client`}>
          <FormattedMessage {...messages.interviewTime} />
        </span>
      }
      footer={[
        <Row gutter={[8, 0]} justify="center" key="add_client">
          <Col>
            <ButtonCustom
              case="static"
              className="btn-danger btn-77-40"
              onClick={handleInterviewCancel}
            >
              <FormattedMessage {...messages.cancel} />
            </ButtonCustom>
          </Col>
          <Col>
            <ButtonCustom
              className="btn-primary-gradient btn-140-40"
              onClick={() => submit()}
            >
             <FormattedMessage {...messages.saveAndSubmit} />

            </ButtonCustom>
          </Col>
        </Row>,
      ]}
    >
      {loading ? (
        <div className="spinerContainer">
          <Spin />
        </div>
      ) : (
        <>
            {candidateInterviewList.map(candidateInterview => {
                          const returnContact = (candidateInterview) =>{
                              let arr = candidateInterview.interviews
                              let newArr = []
                              if (arr.length !== 0) {
                                 arr.forEach(item => {
                                    item["contact"] = item["create_by"].email
                                    newArr.push(item)
                                })
                              }
                              return newArr
                          }
                        
                          return (
                              <div
                                  key={candidateInterview.id}
                                  style={{ marginTop: 20, backgroundColor: 'white', padding: 20 }}
                              >
                                  <label className={!arrayCollapseCadidate.includes(candidateInterview.id)  ? "active collapse-custom" :"collapse-custom"} onClick={()=>collapseCadidate(candidateInterview.id)} style={{ fontWeight: 700, color: '#32363e', fontSize: 18, display:"block", cursor:"pointer" }}>
                                      {candidateInterview.name ? candidateInterview.name : '...'}
                                  </label>
                              { !arrayCollapseCadidate.includes(candidateInterview.id)  ? <>
                                    <Radio.Group
                                      style={{ width: '100%' }}
                                      onChange={event => {
                                          selectedInterviews[`${candidateInterview.id}`] =
                                            event.target.value;
                                        selectedInterviews[`info-${candidateInterview.id}`] =
                                              candidateInterview.interviews[0].info;
                                          setSelectedInterviews({ ...selectedInterviews });
                                      }}
                                      value={selectedInterviews[`${candidateInterview.id}`]}
                                  >
                                      <Table
                                          columns={interviewColumns}
                                          dataSource={candidateInterview.interviews && candidateInterview.interviews.length ? returnContact(candidateInterview) : []}
                                          pagination={false}
                                          st
                                      />
                                  </Radio.Group>

                                  <Row
                                      style={{ marginTop: 15 }}
                                      gutter={[24, 0]}
                                      justify="space-between"
                                      align="center"
                                      className={`recruiter-row`}
                                  >
                                      <Col xs={24}>
                                          <label
                                              style={{
                                                  fontWeight: '700',
                                                  fontSize: 12,
                                                  color: '#888888',
                                              }}
                                          >
                                              Additional Information
                                          </label>
                                          <TextArea
                                              readOnly
                                              style={{ marginTop: 5 }}
                                              name="info"
                                              placeholder="E.g: Interview address"
                                              defaultValue={candidateInterview.interviews && candidateInterview.interviews.length ? candidateInterview.interviews[0].info : ''}
                                              rows={4}
                                          />
                                      </Col>
                                  </Row>
                                                            
                              </> : null
                              }</div>
                          )
                      }
          )}
        </>
      )}
    </ModalCustom>
  );
};

export default InterviewModal;
