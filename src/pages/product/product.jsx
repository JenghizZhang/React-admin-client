import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './product-home'
import AddUpdate from './add-update'
import Detail from './detail'
import './product.less'

//商品管理的路由
export default class Product extends Component {
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Switch>
                    {/* 路径完全匹配 */}
                    <Route path="/product" exact component={ProductHome}></Route> 
                    <Route path='/product/addupdate' component={AddUpdate}></Route>
                    <Route path='/product/detail' component={Detail}></Route>
                    <Redirect to='/product'></Redirect>
                </Switch>
            </div>
        )
    }
}
