/**
 *
 * BarChart
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Bar } from '@ant-design/charts'

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function BarChart() {
  const data = [
    {
      type: 'Achievement and Effort',
      sales: 4,
    },
    {
      type: 'Adaptability and Flexibility',
      sales: 5,
    },
    {
      type: 'Analytical Thinking ',
      sales: 9,
    },
    {
      type: 'Attention to Detail',
      sales: 5,
    },
    {
      type: 'Concern for Others',
      sales: 3,
    },
    {
      type: 'Cooperation',
      sales: 5,
    },
    {
      type: 'Dependability ',
      sales: 5,
    },
    {
      type: 'Initiative',
      sales: 5,
    },
    {
      type: 'Innovation',
      sales: 9,
    },
    {
      type: 'Integrity',
      sales: 4,
    },
    {
      type: 'Leadership',
      sales: 10,
    },
    {
      type: 'Persistence ',
      sales: 6,
    },
    {
      type: 'Self-Control',
      sales: 5,
    },
    {
      type: 'Social Orientation',
      sales: 5,
    },
    {
      type: 'Stress Tolerance',
      sales: 5,
    },

  ];

  const config = {
    width: 400,
    height: 1300,
    color: ['#3abcca', 'black'],


    labelEmit: true,
    // isPercent: true,
    isStack: true,
    shadowOffsetY: 10,
    shadowColor: 'red',


    label: {
      offsetX: -30,
      // layout: 'limitInShape',
      position: 'right',

      style: {

        fontWeight: 600,
        fill: 'white',

      },
    },

    xAxis: {
      grid: {

        line: {
          style: {
            // stroke: 'black',
            lineWidth: 2,
            lineDash: [0, 1],
            // strokeOpacity: 0.7,
            // shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 15,
            cursor: 'pointer',
            stroke: 'red',
            shadowColor: 'red',
          }
        }
      }
    },
    // yAxis: {
    //   grid: {
    //     line: {
    //       style: {
    //         // stroke: 'black',
    //         // lineWidth: 2,
    //         lineDash: [0, 0],
    //         strokeOpacity: 0.7,
    //         // shadowColor: 'black',
    //         shadowBlur: 10,
    //         // shadowOffsetX: 500,
    //         // shadowOffsetY: 100,
    //         cursor: 'pointer'
    //       }
    //     }
    //   }
    // },


    data,
    xField: 'sales',
    yField: 'type',
    legend: true,

    meta: {
      type: { alias: 'rate' },
      sales: { alias: 'a' },
    },
  };

  return (
    <div>
      <Bar {...config} />
    </div >
  );
}

BarChart.propTypes = {};

export default memo(BarChart);
