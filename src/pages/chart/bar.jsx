import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

//图表管理的路由
export default class Bar extends Component {

    state = {
        sales: [5, 20, 36, 10, 10, 20 ], //销量的数组
        stores: [7, 27, 38, 18, 15, 30], //库存的数组
    }

    update = () => {
        this.setState(state => ({
            sales: state.sales.map(value => value + 1),
            stores: state.stores.reduce((pre, value) => [...pre, value + 5], []),
        }))
    }

    //返回柱状图的配置对象
    getOption = (sales, stores)=>{
        return (
            {
                title: {
                    text: 'ECharts'
                },
                tooltip: { trigger: 'axis',},
                legend: {
                    data: ['销量', '库存']
                },
                xAxis: {
                    data: ["戴尔", "神州", "测试1", "测试2", "测试3", "测试4"]
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: sales
                    },
                    {
                        name: '库存',
                        type: 'bar',
                        data: stores
                    }
                ],
            }
        )
    }

    render() {
        const { sales, stores } = this.state
        const title = <Button type='primary' shape='round' onClick={this.update}>柱状图更新</Button>
        return (
            <Card title={title} style={{ minHeight: '100%', minWidth: '100%' }}>
                <ReactEcharts option={this.getOption(sales, stores)} style={{ minHeight: '100%' }} />
            </Card>
        )
    }

}
