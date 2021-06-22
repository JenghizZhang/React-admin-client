import React, { Component } from 'react'
import { Card, Table, Button, Modal, message, Popconfirm } from 'antd'

import AddUpdateUser from './add-update';
import formDate from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { reqAddOrUpdateUser, reqDeleteUser, reqUsers } from '../../api'

//用户管理的路由
export default class User extends Component {
    
    state = {
        loading: true,//Table是否处于加载
        visible: false,//false看不到Modal
        users: [],//所有用户的列表
        roles: [],//所有角色的列表
        selectedUser: {}, //点击修改所选择的user
    }

    //定义基本信息
    columns = [
        {
            title: '账号',
            dataIndex: 'username',
            key: 'username',
            align: 'center'
        },
        {
            title: '邮箱',
            key: 'email',
            dataIndex: 'email',
            align: 'center',
        },
       {
            title: '电话',
            key: 'phone',
            dataIndex: 'phone',
            align: 'center',
        },
        {
            title: '创建时间',
            key: 'create_time',
            dataIndex: 'create_time',
            align: 'center',
            render: formDate,
        },
        {
            title: '所属角色',
            key: 'role_id',
            dataIndex: 'role_id',
            align: 'center',
            render: (role_id) => this.roleNames[role_id]
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (user) => (
                <span>
                    <LinkButton onClick={() => this.setState({ visible: true, selectedUser: user })}>修改</LinkButton>

                    <Popconfirm
                        title={"确定要删除" + user.username + "吗`(*>﹏<*)′"}
                        onConfirm={() => this.deleteUser(user)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <LinkButton >删除</LinkButton>
                    </Popconfirm>
                </span>
            )
        }
    ];

    //处理添加或更新用户
    handleModalOk = () => {
        //1.收集输入的数据
        if (Object.keys(this.state.selectedUser).length===0){
            this.form.validateFields()
                .then(async (user) => {
                    //2.提交请求
                    const { data } = await reqAddOrUpdateUser(user)
                    if (data.status === 0) {
                        //3.更新列表显示
                        this.setState({ visible: false })
                        this.getUsers()
                        message.success('创建用户成功啦~~~')
                    } else {
                        message.error(data.msg)
                        this.setState({ visible: false })
                    }
                })
                .catch(() => { })
        } else {
            this.form.validateFields()
                .then(async (user) => {
                    //2.提交请求
                    const newUser = {...this.state.selectedUser, ...user}
                    const { data } = await reqAddOrUpdateUser(newUser)
                    if (data.status === 0) {
                        //3.更新列表显示
                        this.setState({ visible: false, selectedUser: {} })
                        this.getUsers()
                        message.success('修改用户成功啦~~~')
                    } else {
                        message.error(data.msg)
                        this.setState({ visible: false, selectedUser: {} })
                    }
                })
                .catch(() => { })
        }

    }

    //获得添加或修改用户的Form组件
    getForm = (form) => {
        this.form = form
    }

    //删除User的回调函数
    deleteUser = async (user)=>{
        const { data } = await reqDeleteUser(user._id)
        if(data.status===0){
            message.success('删除用户成功啦~~')
            this.getUsers()
        }else{
            message.error('服务器开小差了哦')
        }
    }

    //根据roles的数组生成包含key为_id的值，value为name的对象
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    //获取用户列表,调用initRoleNames
    getUsers = () => {
        this.setState({ loading: true }, async () => {
            const { data } = await reqUsers()
            if (data.status === 0) {
                this.initRoleNames(data.data.roles)
                this.setState({ loading: false, users: data.data.users, roles: data.data.roles })
            } else {
                message.error('哦？服务器开小差了')
            }
        })
    }

    //调用getUsers
    componentDidMount(){
        this.getUsers()
    }

    render() {
        const title=(
            <Button type='primary' shape='round' onClick={() => this.setState({ visible: true })}>添加用户</Button>
        )
        
        return (
            <Card title={title} style={{ minHeight: '100%', minWidth: '100%' }}>
                <Table
                    bordered 
                    rowKey="_id" 
                    loading={this.state.loading}
                    dataSource={this.state.users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />

                <Modal title={Object.keys(this.state.selectedUser).length === 0 ? '添加用户' : `修改${this.state.selectedUser.username}`} destroyOnClose visible={this.state.visible} onOk={this.handleModalOk} onCancel={() => this.setState({ visible: false, selectedUser: {} })} cancelText='取消' okText='确定'>
                    <AddUpdateUser getForm={this.getForm} roles={this.state.roles} user={this.state.selectedUser}/>
                </Modal>
            </Card>
        )
    }
}
