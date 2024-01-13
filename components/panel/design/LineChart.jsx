import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import colors from 'tailwindcss/colors';

const LineChart = ({ data, labels }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Keep track of the Chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous Chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'INR',
            backgroundColor: colors.orange[500],
            borderColor: colors.orange[500],
            data: data,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
              },
              color: '#000000',
            },
          },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#000000',
            bodyColor: '#000000',
          },
        },
        scales: {
          x: {
            display: false, // hide x-axis labels
            grid: {
              color: '#000000', // set grid color for x-axis
            },
          },
          y: {
            display: false, // hide y-axis labels
            grid: {
              color: '#000000', // set grid color for y-axis
            },
          },
        },
      },
    });

    // Store the new Chart instance in the ref
    chartInstanceRef.current = newChartInstance;

    return () => {
      // Clean up: Destroy the Chart instance when the component is unmounted
      newChartInstance.destroy();
    };
  }, [data, labels]);

  return <canvas ref={chartRef} />;
};

export default LineChart;
