// import React, { Component } from 'react'
// import { Card, Button, Table, message, Modal  } from 'antd';
// import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
// import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
// import LinkButton from '../../components/link-button'
// import AddForm from './addForm'
// import UpdateForm from './updateForm'


// export default class Category extends Component {
//     state = { 
//         title:"一级分类列表", //card的左侧
//         categorys: [],//一级分类列表
//         subcategorys: [],//二级分类列表
//         loading: false, //没请求数据
//         parentId: "0", //当前需要显示的分类列表的parentId
//         parentName: '', //当前需要显示分类列表的父分类名称
//         moduleStatus: 0, //标识添加或更新确认框是否显示，0：都不显示，1：显示添加，2：显示更新
//     }

//     //表格右上方链接
//     extra = (
//         <Button type="primary" shape="round" onClick={() => this.setState({ moduleStatus: 1 })}>
//             <PlusOutlined />
//                 添加
//         </Button>
//     );

//     //商品分类的路由
//     columns = [
//         {
//             align: 'center',
//             title: '分类',
//             dataIndex: 'name', //显示数据对应的属性名
//             key: 'name',
//         },
//         {
//             align: 'center',
//             width: '50%',
//             title: '操作',
//             key: 'operation', //返回需要显示的界面标签
//             render: (category) => (
//                 <span>
//                     <LinkButton onClick={() => {this.setState({ moduleStatus: 2 }); this.category=category}}>修改分类</LinkButton>
//                     &nbsp;&nbsp;&nbsp;
//                     {this.state.parentId === '0' ? <LinkButton onClick={this.showSubcategorys(category)}>查看子分类</LinkButton> : null}
//                 </span>
//             )},
//     ];

//     // 获取以自分类的名称和id
//     showSubcategorys = (category) => {
//         return () => {
//             this.setState({ parentId: category._id, parentName: category.name }, ()=>{
//                 this.getCategorys();
//             })
//         }
//     }

//     //异步获取一、二级分类列表显示
//     getCategorys= async ()=>{
//         this.setState({ loading: true })
//         const result = await reqCategorys(this.state.parentId);
//         if (!result || result.data.status === 1) {
//             message.error('获取分类列表失败')
//         }else{
//             if (this.state.parentId === '0'){
//                 //更新一级分类
//                 this.setState({ categorys: result.data.data, loading: false });
//             }else{
//                 //更新二级分类
//                 this.setState({ subcategorys: result.data.data, loading: false });
//             }
//         }
//     }

//     //发送ajax请求
//     componentDidMount(){
//         this.getCategorys();
//     }

//     //添加分类，相应点击确定：隐藏对话框
//     addCategory = async () => {
//         //1. 隐藏对话框
//         this.setState({ moduleStatus: 0 })
//         // 2. 发请求更新
//         const result = await reqAddCategory(this.addCategoryParentId=0, this.addCategoryName)
//         if (result.status === 200 && result.data.status === 0) {
//             //3. 重新显示列表
//             this.getCategorys()
//         } else {
//             message.error('没有修改成功哦~~~')
//         }
//     };

//     //更新分类，相应点击确定：隐藏对话框
//     updateCategory = async() => {
//         //1. 隐藏对话框
//         this.setState({ moduleStatus: 0 })
//         const categoryId=this.category._id
//         // 2. 发请求更新
//         const result = await reqUpdateCategory(categoryId, this.formName.value)
//         if(result.status===200&&result.data.status===0){
//             //3. 重新显示列表
//             this.getCategorys()
//         }else{
//             message.error('没有修改成功哦~~~')
//         }
//     };


//     //相应点击取消：隐藏对话框
//     handleCancel = () => {
//         this.setState({ moduleStatus: 0 })
//     };

//     render() {
//         const title = this.state.parentId === '0' ? this.state.title : (
//             <span>
//                 <LinkButton onClick={() => this.setState({ parentId: '0', parentName: '' }, console.log(this.state.categorys))}>{this.state.title}</LinkButton>
//                 <ArrowRightOutlined style={{margin: '0 15px'}}/>
//                 <span>{this.state.parentName}</span>
//             </span>
//         );
//         const category = this.category || {};
//         return (
//             <div>
//                 <Card title={title} extra={this.extra} style={{ width: '100%', height: "100%" }}>
//                     <Table dataSource={this.state.parentId === "0" ? this.state.categorys : this.state.subcategorys}
//                         columns={this.columns}
//                         bordered={true}
//                         rowKey="_id"
//                         loading={this.state.loading}
//                         pagination={{ defaultPageSize: 6, showQuickJumper: true }} />
//                 </Card>
//                 <Modal title="添加分类" visible={this.state.moduleStatus === 1} onOk={this.addCategory} onCancel={this.handleCancel} destroyOnClose={true}>
//                     <AddForm categorys={this.state.categorys} parentId={this.state.parentId} addName={(form) => { this.addCategoryName = form }} addParentId={(form) => { this.addCategoryParentId = form }}/>
//                 </Modal>
//                 <Modal title="修改分类" visible={this.state.moduleStatus === 2} onOk={this.updateCategory} onCancel={this.handleCancel} destroyOnClose={true}>
//                     <UpdateForm categoryName={category.name || ''} setForm={(form) => {this.formName = form}}/>
//                 </Modal>
//             </div>
//         )
//     }
// }
