import React, { Component } from 'react'
import { Card, List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button';
import { reqCategory } from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
const Item = List.Item;
export default class Detail extends Component {
    state={
        cName1: '',//一级分类名称
        cName2: '',//二级分类名称
    }

    async componentDidMount(){
        //得到当前商品的分类ID
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId==='0'){
            //一级分类下的产品
            const { data } = await reqCategory(categoryId)
            this.setState({cName1:data.data.name})
        }else{
            //二级分类下的产品
            // const { data: result1} = await reqCategory(pCategoryId) //获取一级分类列表
            // const { data: result2 } = await reqCategory(categoryId) //获取二级分类列表
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.data.name
            const cName2 = results[1].data.data.name
            this.setState({ cName1, cName2})
        }
    }

    render() {
        //读取携带的state数据
        const { name, desc, price, detail, imgs } = this.props.location.state.product;
        
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} /></LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail' style={{ width: '100%', height: '100%' }}>
                <List >
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>{this.state.cName1} {this.state.cName2 ? '-->' + this.state.cName2:null}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        {
                            imgs.map(img=>(
                                <img className='product-img' key={img} src={BASE_IMG_URL + img} alt="图片" />
                            ))
                        }

                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
