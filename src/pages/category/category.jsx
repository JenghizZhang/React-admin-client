import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import { reqCategories, reqUpdateCategory, reqAddCategory } from '../../api'
import AddCategory from './addCategory'
import UpdateCategory from './updateCategory'

export default class category extends Component {
    state={
        categoryList:[], //一级分类列表
        subCategoryList:[], //二级分类列表
        loading:true, //是否正在获取数据
        parentId:"0", //默认获取一级分类列表
        parentName: '', //当前需要显示的分类列表的父分类名称
        visible: 0, //添加更新的确认框是否显示，0都不显示，1显示添加，2显示更新
    }

    //定义基本信息
    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '操作',
            key: 'action',
            width: '35%',
            align: 'center',
            render: (category) => (
                <span>
                    <LinkButton onClick={() => { this.setState({ visible: 2 }); this.category = category}}>修改分类</LinkButton>
                    {this.state.parentId === "0" ? <LinkButton onClick={this.showSubCategoryList(category)}>查看子分类</LinkButton>:null}
                </span>
            ),
        },
    ];
    
    //card的右侧额外信息
    extra = <Button type="primary" shape="round" onClick={()=>this.setState({visible:1})}><PlusOutlined />添加</Button>;
    //默认category
    category={name:''}

    //显示二级分类列表
    showSubCategoryList = (category)=>{
        return () => {
            this.setState({parentId:category._id, parentName:category.name},()=>{ //setState是异步更新的，在状态更新且重新render（）后执行
                this.getCategoryList()
            })
        }
    }

    //显示一级分类列表
    showFirstCategoryList = ()=>{
        this.setState({
            subCategoryList: [], //二级分类列表
            parentId: "0", //默认获取一级分类列表
            parentName: ''
        }, () => { this.getCategoryList()})
        
    }

    //异步获取一、二级分类列表显示
    getCategoryList = async () => {
        this.setState({loading:true})
        const parentId = this.state.parentId
        //发异步ajax请求获取数据
        const result = await reqCategories(parentId)
        if(result.data.status===0){
            //更新state状态
            if(parentId==='0'){
                this.setState({ categoryList: result.data.data, loading: false })
            }else{
                this.setState({ subCategoryList: result.data.data, loading: false })
            }
        }else{
            message.error('获取分类列表失败~~~')
        }
    }

    //点击增加目录
    handleAddOk =  () => {
        //进行表单验证
        this.addForm.validateFields()
            .then(async (values)=>{
            this.setState({ visible: 0 }) //1. 隐藏确认框
            const { parentId, categoryName } = values
            //2. 发送请求
            let result = await reqAddCategory(parentId, categoryName)
            if (result.data.status === 0) {
                this.getCategoryList() //3. 重新显示列表
            } else {
                message.error('添加分类列表失败~~~')
            }
            })
            .catch(() => { })
    }

    //点击更新目录
    handleUpdateOk = async () => {
        if (this.updateName.trim() !== '' && this.updateName) {
            this.setState({ visible: 0 }) //1. 隐藏确认框
            //2. 发送请求
            let result = await reqUpdateCategory(this.category._id, this.updateName)
            if (result.data.status === 0) {
                this.getCategoryList() //3. 重新显示列表
            } else {
                message.error('更新分类列表失败~~~')
            }
        }
    }

    //定义函数处理更新目录
    updateValue=(value)=>{
        this.updateName = value //updateName为从子组件获得的名字
    }

    //定义函数处理增加目录
    addValues=(value)=>{
        this.addForm=value
    }

    componentDidMount(){
        this.getCategoryList() //获取一级分类列表显示
    }

    render() {
        //card的左侧标题
        let title = this.state.parentId === "0" ? <span style={{marginLeft:6}}>一级分类列表</span> : (
            <span>
                <LinkButton onClick={this.showFirstCategoryList}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:5}}/> 
                <span>{this.state.parentName}</span>
            </span>
        );

        return (
            <Card title={title} extra={this.extra} style={{ width: '100%', height:'100%' }}>
                <Table 
                    style={{ width: '100%', height: '100%' }}
                    bordered rowKey="_id" loading={this.state.loading} 
                    pagination={{ defaultPageSize: 5, showQuickJumper:true}} 
                    dataSource={this.state.parentId === '0' ? this.state.categoryList : this.state.subCategoryList} 
                    columns={this.columns} 
                />

                <Modal title="添加分类" destroyOnClose visible={this.state.visible === 1} onOk={this.handleAddOk} onCancel={() => this.setState({ visible: 0 })} cancelText='取消' okText='确定'>
                    <AddCategory categories={this.state.categoryList} parentId={this.state.parentId} addValues={this.addValues}></AddCategory>
                </Modal>

                <Modal title="修改分类" destroyOnClose visible={this.state.visible === 2} onOk={this.handleUpdateOk} onCancel={() => this.setState({ visible: 0 })} cancelText='取消' okText='确定'>
                    <UpdateCategory categoryName={this.category.name || ''} updateValue={this.updateValue}></UpdateCategory>
                </Modal>
            </Card>
        )
    }
}
