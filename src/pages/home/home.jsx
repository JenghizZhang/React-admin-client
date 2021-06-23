import { Card, Statistic } from 'antd'
import React, { Component } from 'react'
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import './home.less'
import Line from './line'
//home的路由组件
export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <Card 
                    className="home-card"
                    title='商品总量'
                    extra={<QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                >
                    <Statistic value={112893} suffix="个" style={{ fontWeight: 'bolder' }}/>
                    <Statistic
                        value={15}
                        prefix={'周同比'}
                        valueStyle={{ fontSize: 15 }}
                        suffix={<div>%<ArrowUpOutlined style={{ color: 'red', marginLeft: 10 }}/></div>}
                    />
                    <Statistic
                        value={19}
                        prefix={'日同比'}
                        valueStyle={{ fontSize: 15 }}
                        suffix={<div>%<ArrowDownOutlined style={{ color: 'green', marginLeft: 10 }} /></div>}
                    />
                </Card>
                <Line lassName="home-line"></Line>
            </div>
        )
    }
}
