/**
 *
 * BarChart
 *
 */

import React, { memo, useEffect } from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { FormattedMessage } from 'react-intl';
import messages from './messages'
import { Row, Col } from 'antd'
import FormAtnd from './FormAntd'
import './styles.less'
import { makeSelectParsingPageResponse } from 'containers/dashboard_page/selectors'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'

const BarWrapper = styled(BarChart)`
  width: 100%;
`

const Heading = styled.h1`
  text-align: center;
  font-weight: bold;
  color:#32363e;
`

const InforLabel = styled.p`
  font-size: 22px;
`

const HeadWrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
`

const BarChartWrapper = (props) => {
  const {
    heading,
    total,
    chartData,
    labels,
    totalLabel
  } = props


  return (

    <div>
      <Heading>{heading}</Heading>
      <HeadWrapper>
        <Row justify="space-between">
          <Col>
            <InforLabel>
              {labels}
            </InforLabel>
          </Col>
          <Col>
            <InforLabel>
              {totalLabel} <span className="total-number">{total}</span>
            </InforLabel>
          </Col>
        </Row>
      </HeadWrapper>
      <ResponsiveContainer height={400}>
        <BarWrapper
          data={chartData}
          barSize={50}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}

        >
          <XAxis dataKey='agency_name' domain={[0, 10]} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3abcca" />
        </BarWrapper>
      </ResponsiveContainer>
    </div>
  )
}

BarChartWrapper.propTypes = {}





const mapStateToProps = createStructuredSelector({
  parsingData: makeSelectParsingPageResponse()


})

function mapDispatchToProps(dispatch) {
  return {
    dispatch,

  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  memo,
)(BarChartWrapper)




