/**
 *
 * RadarChart
 *
 */

import React, { memo, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Radar } from '@ant-design/charts';

function RadarChart(props) {
  const { data } = props;
  const hasWindow = typeof window !== 'undefined';

  function getWindowWitdh() {
    const width = hasWindow ? window.innerWidth : null;
    return width;
  }

  const [windowWidth, setWindowWidth] = useState(getWindowWitdh());

  const handleResize = e => {
    if (hasWindow) {
      setWindowWidth(window.innerWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, [windowWidth]);

  const fontSizeLabelFormat = useMemo(() => {
    if (windowWidth < 500) {
      return 9;
    }
    if (windowWidth < 900) {
      return 14;
    } else return 17.6;
  }, [windowWidth]);

  const maxLabelLength = 15;
  const dataDefault = [
    {
      name: 'Competency 1',
      value: 70,
    },
    {
      name: 'Competency 2',
      value: 70,
    },
    {
      name: 'Competency 3',
      value: 90,
    },
    {
      name: 'Competency 4',
      value: 70,
    },
    {
      name: 'Competency 5',
      value: 90,
    },
    {
      name: 'Competency 6',
      value: 70,
    },
    {
      name: 'Competency 7',
      value: 70,
    },
    {
      name: 'Competency 8',
      value: 70,
    },
  ];
  const wrapText = (text, width) => {
    if (text) {
      let words = text
          .split(/\s+/)
          .reverse()
          .filter(s => s.length > 0),
        word,
        strLine = '';
      let countLine = 0;
      while ((word = words.pop())) {
        countLine += word.length;
        if (countLine > width) {
          countLine = 0;
          strLine += '\n\n' + word;
        } else {
          strLine += ' ' + word;
        }
      }
      strLine += '\n';

      return strLine;
    }

    return text;
  };
  
  const formatLabel = data => {
    if (data && data.length) {
      const formatedData = data.map(d => {
        const name = d?.name;
        const formatedName = wrapText(name, maxLabelLength);
        d.name = formatedName;
        return d;
      });
      return formatedData;
    }
  };

  const config = {
    data: formatLabel(data) || dataDefault,
    color: props.colorLine || null,
    width: 400,
    height: 600,
    padding: 'auto',
    autoFit: true,
    xField: 'name',
    yField: 'value',
    meta: {
      score: {
        alias: 'value',
      },
    },
    yAxis: {
      // label: false,
      tickCount: 10,
      min: 1,
      max: 10,
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {},
        },
      },
      label: {
        style: {
          fontSize: fontSizeLabelFormat,
          fill: '#32363e',
        },
      },
    },
    point: {},
  };
  return <Radar {...config} />;
}

RadarChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default memo(RadarChart);
