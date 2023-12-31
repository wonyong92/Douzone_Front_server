import React, {Component} from 'react';
import * as echarts from 'echarts';

class EmployeeBarChart extends Component {
    chartRef = React.createRef();
    chartInstance = null;

    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.monthlyData) !== JSON.stringify(this.props.monthlyData)) {
            this.updateChart();
        }
    }

    initChart = () => {
        if (this.chartRef.current) {
            this.chartInstance = echarts.init(this.chartRef.current);
            this.chartInstance.setOption(this.getOption());
        }
    };

    updateChart = () => {
        if (this.chartInstance) {
            this.chartInstance.setOption(this.getOption(), true);
        }
    };

    getOption = () => {
        const {monthlyData} = this.props;
        const yAxisData = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        const filteredData = monthlyData.filter(data => data.isSelected);
        const defaultData = new Array(12).fill(0);
        const getMonthlyData = (data, key) => {
            const monthData = filteredData.find(d => d.month === key);
            return monthData ? monthData[data] : 0;
        };
        const series = [
            {
                name: '승인된 연차',
                type: 'bar',
                stack: 'total',
                itemStyle: {color: '#4F5DF8'},
                data: yAxisData.map((_, index) => getMonthlyData('approvedVacationCount', index + 1))
            },
            {
                name: '거절된 연차',
                type: 'bar',
                stack: 'total',
                itemStyle: {color: '#F74F4F'},
                data: yAxisData.map((_, index) => getMonthlyData('rejectedVacationCount', index + 1))
            },
            {
                name: '요청중인 연차',
                type: 'bar',
                stack: 'total',
                itemStyle: {color: '#B3A62C'},

                data: yAxisData.map((_, index) => getMonthlyData('requestedVacationCount', index + 1))
            },
            {
                name: '근태 정상',
                type: 'bar',
                stack: 'total',
                itemStyle: {color: '#1B46C6'},
                data: yAxisData.map((_, index) => getMonthlyData('approvedCount', index + 1))
            },
            {
                name: '근태 불량',
                type: 'bar',
                stack: 'total',
                itemStyle: {color: '#D643B7'},

                data: yAxisData.map((_, index) => getMonthlyData('unapprovedVacationCount', index + 1))

            },
            {
                name: '조정 요청',
                type: 'bar',
                stack: 'total',
                itemStyle: {color: '#33CC4C'},
                data: yAxisData.map((_, index) => getMonthlyData('approvalRequestedAttendance', index + 1))
            }
        ];

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'}
            },
            legend: {data: series.map(s => s.name)},
            grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
            xAxis: {type: 'value'},
            yAxis: {type: 'category', data: yAxisData},
            series: series
        };
    };

    render() {
        return (
            <div ref={this.chartRef} style={{height: '400px'}}></div>
        );
    }
}

export default EmployeeBarChart;
