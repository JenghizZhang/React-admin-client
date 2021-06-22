import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'

import AddRole from './add-role'
import AuthRole from './auth-role'
import ChangeName from './change-name'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import formateDate from '../../utils/dateUtils'
import { reqAddRole, reqRoles, reqChangeRoleName, reqUpdateRole } from '../../api'
import storageUtils from '../../utils/storageUtils'

//权限管理的路由
export default class Role extends Component {
    state = {
        roles: [], //所有角色的列表
        selectedRole: {}, //选中的role
        visiable: 0, //添加修改是否显示，0都不显示，1显示添加，2显示更新，3更改名称
        loading: true
    }

    //Table列的信息
    columns = [
        {
            align: 'center',
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            align: 'center',
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: formateDate
        },
        {
            align: 'center',
            title: '授权时间',
            dataIndex: 'auth_time',
            key: 'auth_time',
            render: formateDate
        }, 
        {
            align: 'center',
            title: '授权人',
            dataIndex: 'auth_name',
            key: 'auth_name',
        },
        {
            align: 'center',
            title: '操作',
            render:(role)=>{
                return (
                    <span>
                        <LinkButton onClick={() => this.setState({ visible: 3 })}>修改</LinkButton>
                    </span>
                )
            }
        },
    ];



    //Table中设置行属性，点击某一行
    onRow = (role) => {
        return {
            onClick: () => { //点击了行
                this.setState({ selectedRole: role })
            }
        }
    }

    //Table中设置rowSelection，点击radio框
    onSelect = (record) => this.setState({ selectedRole: record })

    //获得子组件的form对象（添加）
    getFormAdd = (form) => this.addRole = form

    //点击添加Modal的确认的回调函数
    handleAddOk = () => {
        //进行表单验证，只有通过了才继续
        this.addRole.validateFields()
            .then(async value => {
                this.setState({ visible: 0 });
                //收集输入数据
                const { roleName } = value;
                //请求添加
                const { data } = await reqAddRole(roleName)
                //根据结果更新显示
                if(data.status===0){
                    message.success('创建角色成功啦~别忘了设置权限哦')
                    this.setState({ roles: [...this.state.roles, data.data] })
                }else{
                    message.error('创建角色失败，服务器开小差了')
                }
            })
            .catch(()=> {
            })
    }

    //点击修改角色权限的回调函数
    handleAuthOk = async () => {
        this.setState({ visible: 0 });
        let selectedRole = this.state.selectedRole;
        selectedRole.menus = this.authRole.getMenus();
        selectedRole.auth_name = memoryUtils.user.username
        // console.log(selectedRole)

        //请求更新
        const { data } = await reqUpdateRole(selectedRole)
        if (data.status === 0) {

            //如果当前更新的是自己的角色的权限，强制退出
            if (selectedRole._id === memoryUtils.user.role_id) {
                memoryUtils.user={};
                storageUtils.removeUser();
                this.props.history.replace('/login')
                message.success('设置角色权限成功啦，改变了当前用户的权限需要重新登录哦~')
            }else{
                message.success('设置角色权限成功啦~~~')
                this.setState({ selectedRole })
                this.getRoles()
            }
        }else{
            message.error('欸？服务器开小差了欸')
        }
    }


    //获得子组件的form对象（修改名称）
    getFormChangeName = (form) => this.changeName = form

    //点击修改角色名称的回调函数
    handleChangeNameOk=()=>{
        //进行表单验证，只有通过了才继续
        this.changeName.validateFields()
            .then(async value => {
                this.setState({ visible: 0 });
                //收集输入数据
                const { roleName } = value;
                //请求添加
                const { data } = await reqChangeRoleName(this.state.selectedRole._id, roleName)
                //根据结果更新显示
                if (data.status === 0) {
                    message.success('修改名称成功啦~~')
                    this.getRoles()
                    this.setState({ selectedRole: {} })
                } else {
                    message.error('修改名称失败，服务器开小差了')
                }
            })
            .catch(() => {
            })
    }

    //发送请求获取所有role列表
    getRoles = async () => {
        const { data } = await reqRoles();
        if (data.status === 0) {
            const roles = data.data;
            this.setState({ roles, loading: false });
        } else {
            message.error('服务器开小差了，获取角色列表失败！')
        }
    }

    //调用getRoles()
    componentDidMount() {
        this.getRoles()
    }


    render() {
        const title=(
            <span>
                <Button type="primary" shape='round' style={{ marginRight: 10 }} onClick={() => this.setState({ visible: 1 })}>创建角色</Button>
                <Button type="primary" shape='round' disabled={!this.state.selectedRole._id} onClick={() => this.setState({ visible: 2 })}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title} style={{ minHeight: '100%', minWidth: '100%' }}>
                <Table 
                    rowKey="_id"
                    dataSource={this.state.roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    onRow={this.onRow}
                    rowSelection={{ type: 'radio', selectedRowKeys: [this.state.selectedRole._id], onSelect: this.onSelect }}
                    bordered
                    loading={this.state.loading}
                />
                
                <Modal title="创建角色" destroyOnClose visible={this.state.visible === 1} onOk={this.handleAddOk} onCancel={() => this.setState({ visible: 0 })} cancelText='取消' okText='确定'>
                    <AddRole getForm={this.getFormAdd} />
                </Modal>

                <Modal title="设置角色权限" destroyOnClose visible={this.state.visible === 2} onOk={this.handleAuthOk} onCancel={() => this.setState({ visible: 0 })} cancelText='取消' okText='确定'>
                    <AuthRole role={this.state.selectedRole} ref={(c) => this.authRole = c} />
                </Modal>

                <Modal title="更改角色名称" destroyOnClose visible={this.state.visible === 3} onOk={this.handleChangeNameOk} onCancel={() => this.setState({ visible: 0 })} cancelText='取消' okText='确定'>
                    <ChangeName getForm={this.getFormChangeName} selectedRole={this.state.selectedRole}/>
                </Modal>
            </Card>
        )
    }
}
