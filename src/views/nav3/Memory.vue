<template>
    <div id="memory">

    </div>
</template>

<script>
    import echarts from 'echarts'
    import moment from 'moment'
    import {  getMemory   } from '../../api/api';

    export default {
        props: {
            hostid: String
        },
        created() {
            getMemory({hostid:this.hostid}).then((res) => {
                const items = res.data;
                let ydata = [];
                let xdata = [];
                items.forEach(function (item) {
                    xdata.push(item['clock']);
                    ydata.push(item['value']);
                });
                xdata = xdata.map(function (time) {
                    return moment(time * 1000).format('HH:mm:ss') + '\n\n' + moment(time * 1000).format('YYYY/MM/DD')
                });
	        console.log(xdata)	
                const cpuChart = echarts.init(document.getElementById('memory'));
                const option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['可用内存百分比']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        data: xdata,
                    },
                    yAxis: {
                        name:'内存(%)'
                    },
                    series: [
                        {
                            name: '可用内存',
                            type: 'line',
                            //smooth: true,
                            data: ydata,
                            //sampling: 'average',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(255,70,131)'
                                }
                            }
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                cpuChart.setOption(option);
            });
        }
    }
</script>
<style scoped="scoped">
    #memory {
        width: 1500px;
        height: 500px;
    }
</style>
