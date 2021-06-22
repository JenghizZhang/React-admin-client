import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router';
// import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
import { connect } from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../chart/bar'
import Line from '../chart/line'
import Pie from '../chart/pie'

const { Footer, Sider, Content } = Layout;

//主界面的路由组件
class Admin extends Component {
    render() {
        const user = this.props.user;
        //如果内存中没有存储user ==> 当前没有登录
        if (!user || !user._id) {
            //自动跳转到登录（在render中）
            return <Redirect to="/login"></Redirect>
        }
        return (
            
            <Layout style={{minHeight:'100%'}}>
                <Sider><LeftNav style={{ minHeight: '100%' }}/></Sider>
                <Layout>
                    <Header/>
                    <Content style={{backgroundColor:"#fff",margin:"20px"}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>

                    <Footer style={{
                        textAlign:'center',
                        margin:'auto',
                        fontSize:'15px',
                        color:'gray',
                        // backgroundColor: 'white',
                        backgroundColor:'#f0f2f5',
                        width:'100%',
                        display:'flex',
                        minHeight:'5%',
                        alignItems:'flex-end',
                        justifyContent: 'center'
                    }}>后台管理系统 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hello {user.username}
                    </Footer>
                </Layout>
            </Layout>
        
        )
    }
}
export default connect((state) => ({ user: state.user }))(Admin)
