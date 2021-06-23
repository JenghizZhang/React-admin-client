import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'

import { setProduct } from '../../redux/actions'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option
//product默认子路由组件
class ProductHome extends Component {
    state={
        total:0, //商品的总数量
        product:[], //商品的数组
        loading: false, //是否正在加载中
        searchName: '',  //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }
    

    status=1
    //card的右侧额外信息
    extra = <Button type="primary" shape="round" onClick={()=>this.props.history.push('/product/addupdate')}><PlusOutlined />添加</Button>;
    //Table列的数组要求
    columns = [
        {
            align: 'center',
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            align: 'center',
            title: '商品描述',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            align: 'center',
            width: '7%',
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (price)=> '￥'+price //当前制定了对应的属性，传入的是对应的属性值
        },
        {
            align: 'center',
            width: '7%',
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status,product)=>{
                return (
                    <span>
                        <Button type='primary' onClick={() => this.updateStatus(product._id, status === 1 ? 2 : 1)}>
                            {product.status===1?'下架':'上架'}
                        </Button>
                        <br />
                        <span>{product.status === 2 ? '已下架' : '在售'}</span>
                    </span>
                )
            }
        },
        {
            align: 'center',
            width: '7%',
            title: '操作',
            render: (product) => {
                return (
                    <span>
                        {/* 将product对象作为目标路由组件 */}
                        <LinkButton onClick={() => { this.props.history.push('/product/detail'); this.props.setProduct(product)}}>详情</LinkButton>
                        <LinkButton onClick={() => { this.props.history.push('/product/addupdate'); this.props.setProduct(product) }}>修改</LinkButton>
                    </span>
                )
            }
        },
    ];

    updateStatus=async (id,status)=>{
        const {data}=await reqUpdateStatus(id,status)
        if (data.status===0){
            message.success('更新成功啦~~~')
            this.getProducts(this.pageNum)
        } else {
            message.error('添加分类列表失败~~~')
            this.setState({ loading: false })
        }
    }

    //获取指定页码的列表数据显示
    getProducts=(pageNum)=>{
        this.pageNum=pageNum; //保存pageNum让其他方法可以看到
        this.setState({ loading: true }, async()=>{
            //如果搜索关键字有值，则为搜索分页
            if(this.state.searchName){
                let { data } = await reqSearchProducts(pageNum, PAGE_SIZE, this.state.searchName, this.state.searchType)
                if (data.status === 0) {
                    let { total, list } = data.data;
                    this.setState({ total, product: list, loading: false })
                }else{
                    message.error('添加分类列表失败~~~')
                    this.setState({ loading: false })
                }
            }else{
                let { data } = await reqProducts(pageNum, PAGE_SIZE)
                if (data.status === 0) {
                    let { total, list } = data.data;
                    this.setState({ total, product: list, loading: false })
                } else {
                    message.error('添加分类列表失败~~~')
                    this.setState({ loading: false })
                }
            }
        })
    }

    //render后发送请求
    componentDidMount(){
        this.getProducts(1)
    }

    render() {
        const title = (
            <span>
                <Select defaultValue={this.state.searchType} style={{ width: '15%' }} onChange={(searchType) => this.setState({ searchType })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder="搜索啥嘞~" style={{ width: "20%", margin: '0 15px' }} defaultValue={this.state.searchName} onChange={(e) => this.setState({ searchName: e.target.value })}></Input>
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )

        return (
            <Card title={title} extra={this.extra} style={{ width: '100%', height: '100%' }}>
                <Table 
                    dataSource={this.state.product} columns={this.columns} 
                    bordered rowKey='_id' style={{ width: '100%', height: '100%' }}
                    pagination={{ 
                        defaultPageSize: PAGE_SIZE, showQuickJumper: true, total: this.state.total,
                        onChange: this.getProducts,
                    }}
                    loading={this.state.loading}
                />
            </Card>
        )
    }
}

export default connect(
    state => ({ product: state.product }),
    { setProduct }
)(ProductHome)