import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd';
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

export default class AuthRole extends Component {

    static propTypes={
        role: PropTypes.object.isRequired,//需要传入角色对象来获得menu和name
    }

    //初始treeData
    treeData = [
        {
            title: '平台权限',
            key: 'all',
            children: [],
        },
    ];

    //点击多选框时候的回调函数
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys })
        // console.log('onCheck', checkedKeys);
    };

    //给父组件提供选择key的函数
    getMenus = () => this.state.checkedKeys

    //配置treeData
    getTreeData = (menuList) => {
        // menuList.forEach(item => {
        //     let children = [];
        //     if (item.children) {
        //         item.children.forEach(subItem => {
        //             children = [...children, { title: subItem.title, key: subItem.key}]
        //         })                
        //     }
        //     this.treeData[0].children = [...this.treeData[0].children, { title: item.title, key: item.key, children }]
        // })

        return menuList.map(item => {
            return {
                title:item.title,
                key:item.key,
                children: item.children ? this.getTreeData(item.children) : null
            }
        })
    }

    //配置treeData和checkedKeys，调用getTreeData
    constructor(props) {
        super(props);
        this.treeData[0].children = this.getTreeData(menuList)

        //默认选择的key,根据传入角色的menus生成初始状态
        this.state = {
            checkedKeys: this.props.role.menus, //选中的数组
        }
    }


    render() {

        return (
            <div>
                <Form layout="horizontal" className="AuthRole-form" >
                    <Form.Item label="角色名称：" name="roleName" initialValue={this.props.role.name}>
                        <Input disabled />
                    </Form.Item>
                </Form>

                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={this.state.checkedKeys}
                    onCheck={this.onCheck}
                    treeData={this.treeData}
                />
            </div>
        )
    }
}
