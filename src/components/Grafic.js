import React from 'react';
import ReactEcharts from 'echarts-for-react';
const getRandomData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
        data.push(Math.floor(Math.random() * 40)); // Genera números aleatorios entre 0 y 40
    }
    return data;
}
    const options = {
    xAxis: {
        type: 'category',
        data: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado ', 'Domingo']
    },
    yAxis: {
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false }
    },
    series: [
        {
            data: getRandomData(),
            type: 'line',
            smooth: true,
            itemStyle: {
                color: '#dcc9a6'

},
            label: {
                show: true,
                position: 'top',
                color: 'white',
                formatter: params => {
                    let icon = '';
                    if (params.value > 35) {
                        icon = '🔥';
                    } else if (params.value >= 25) {
                        icon = '☀️';
                    } else {
                        icon = '🌧️';
                    }
                    return `${icon} ${params.value}°C`;
                },
                rich: {
                    icon: {
                        align: 'center'
                    }
                }
            }
        }
    ]
};

const Grafic = () => {
    return (
        <ReactEcharts option={options} />
    );
};

export default Grafic;
