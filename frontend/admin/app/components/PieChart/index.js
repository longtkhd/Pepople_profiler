/**
 *
 * PieChart
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ResponsivePie } from '@nivo/pie';

const CharWrapper = styled.div`
  height: 500px;
  margin: 0 auto;
`
const WrapperPie = styled(ResponsivePie)`
  font-size: 16px;
`

const Heading = styled.h1`
  text-align: center;
  font-weight: bold;
`




const PieChart = ({ heading, data, total }) => {
    const format = v => `${v / total}%`
    const labelFormat = d => `${d.value} `

    return (
        <CharWrapper>
            <Heading >{heading}</Heading>
            <WrapperPie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                endAngle={-360}
                // colors={{ datum: 'data.color' }}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                labelFormat={format}
                tooltipFormat={format}
                // sliceLabel={labelFormat}
                sliceLabel={(v) => `${(((v.value) * 100) / total).toFixed(2)}%`}
                borderColor="#fcfcfc"
                // enableRadialLabels={false}
                // radialLabelsSkipAngle={15}
                radialLabel="value"
                radialLabelsLinkDiagonalLength={20}
                radialLabelsLinkOffset={10}
                radialLabelsTextXOffset={0}
                radialLabelsTextColor="#333333"
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor="black"
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#ffffff"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                itemsSpacing={30}
                sliceLabelsSkipAngle={15}
                sliceLabelsTextColor="#333333"
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'freeTrial'
                        },
                        // id: 'dots'
                    },
                    {
                        match: {
                            id: 'noSubscription'
                        },
                        // id: 'dots'
                    },
                    {
                        match: {
                            id: 'Basic'
                        },
                        // id: 'dots'
                    },
                    {
                        match: {
                            id: 'Standard'
                        },
                        // id: 'dots'
                    },

                    {
                        match: {
                            id: 'Premium'
                        },
                        // id: 'lines'
                    },
                    {
                        match: {
                            id: 'Plus'
                        },
                        id: 'lines'
                    },

                ]}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        symbolSize: 18,
                        symbolShape: 'square',
                        itemsSpacing: 40,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />

        </CharWrapper>
    )
}

PieChart.propTypes = {};

export default memo(PieChart);
