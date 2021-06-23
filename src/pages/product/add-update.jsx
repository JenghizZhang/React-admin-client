import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import { setProduct } from '../../redux/actions'
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor'
import { reqCategories, reqAddOrUpdateProduct } from '../../api'
import LinkButton from '../../components/link-button';

const { Item } = Form
const { TextArea } = Input;

//产品添加更新的子路由
class AddUpdate extends Component {
    state = {
        options:[],
    }

    //根据categories生成options数组更新状态
    initOptions = async (categories) => {
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        //如果是一个二级分类商品的更新
        const { isUpdate, product } = this;
        const { pCategoryId } = product;
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategories=await this.getCategories(pCategoryId)
            const childOptions = subCategories.map(subC => ({
                label: subC.name,
                value: subC._id,
                parentId: subC.parentId,
                isLeaf: true,
            }))
            //关联到对应的一级option上
            const pIndex = options.findIndex(c => c.value === pCategoryId);
            options[pIndex].children = childOptions;
        }

        this.setState({ options })
    }

    //获取一级或者二级分类列表
    getCategories = async (parentId) => {
        const {data} = await reqCategories(parentId)
        if(data.status===0){
            const categories=data.data;
            //如果是一级分类列表
            if (parentId===0){
                this.initOptions(categories)
            }else{
                //二级列表
                return categories
            }
        }else{
            message.error('获取列表错误')
        }
    }

    //验证函数必须有值
    validatorRequired = (_, value) => {
        if (!value||value.length===0) {
            return Promise.reject(new Error('需要输入哦~~'));
        }
        return Promise.resolve();
    }

    //Cascader级联器加载下一级数据的函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]; //得到选择的option对象
        targetOption.loading = true; //显示loading效果

        //根据选中的分类，请求获取二级分类
        const subCategories = await this.getCategories(targetOption.value)
        if (subCategories && subCategories.length>0){
            //有二级分类
            targetOption.children = subCategories.map(subC=>({
                label: subC.name,
                value: subC._id,
                parentId: subC.parentId,
                isLeaf: true,
            }));
            targetOption.loading = false;
        }else{
            //没有二级分类
            targetOption.loading = false;
            targetOption.isLeaf = true
        }
        this.setState({ options: [...this.state.options] });
    };

    //提交函数
    onFinish = async (datas) => {
        //1. 收集数据，并封装成product对象
        const { name, desc, price, categoryIds } = datas;
        const imgs = this.picturesWall.current.getImgs()
        const detail = this.richTextEditor.current.getDetail()
        let pCategoryId, categoryId;
        if(categoryIds.length===1){
            pCategoryId = '0';
            categoryId=categoryIds[0];
        }else{
            pCategoryId = categoryIds[0];
            categoryId = categoryIds[1];
        }

        const product = { name, desc, price, pCategoryId, categoryId, imgs, detail}
        //如果是更新，需要添加_id
        if(this.isUpdate){
            product._id=this.product._id
        }
        
        //2. 调用接口请求函数去添加/更新
        const { data } = await reqAddOrUpdateProduct(product)
        //3. 根据结果提示
        if (data.status===0){
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功啦~~`)
            this.props.history.push('/product')
        }else{
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败了哦`)
        }
    }

    componentDidMount() {
        this.getCategories(0)
    }

    //取出携带的state
    constructor(props){
        super(props);
        const product=this.props.product
        //保存是否为更新的标识
        this.isUpdate=!!product._id
        this.product = product || {}

        // console.log(product)

        //创建用来保存ref标识的标签对象的容器
        this.picturesWall = React.createRef();
        this.richTextEditor = React.createRef();
    }

    componentWillUnmount(){
        this.props.setProduct({})
    }

    render() {
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} /></LinkButton>
                {this.isUpdate ? <span>修改商品</span> : <span>添加商品</span>}
            </span>
        )

        //设定form的样式
        const formItemLayout = {
            labelCol:{span:3}, //左侧label的宽度
            wrapperCol:{span:12}, //指定右侧包裹的宽度
        }

        //用来接收级联分类ID的数组
        const categoryIds = [];
        const { pCategoryId, categoryId, imgs } = this.product;
        if(this.isUpdate){
            //商品是一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                //商品是二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        return (
            <Card title={title} style={{ width: '100%', height: '100%' }}>
                <Form {...formItemLayout} onFinish={this.onFinish} ref={c => { this.form = c;}} initialValues={{ remember: false }}>
                    <Item label="商品名称" name="name" initialValue={this.product.name} rules={[{ validator: this.validatorRequired }]} required>
                        <Input placeholder="商品名称叫什么嘞~~~" ></Input>
                    </Item>
                    <Item label="商品描述" name='desc' initialValue={this.product.desc}>
                        <TextArea placeholder="有啥子描述呢~~~" autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item label="商品价格" required name='price' initialValue={this.product.price} rules={[{ validator: (_, value) => value * 1 >= 0 ? Promise.resolve() : Promise.reject(new Error('价格不能小于0哦~~~')) }, { validator: this.validatorRequired }]}>
                        <Input type='number'  placeholder="商品好多钱嘞~~~" addonAfter="元"></Input>
                    </Item>
                    <Item label="商品分类" initialValue={categoryIds} rules={[{ validator: this.validatorRequired }]} required name='categoryIds'>
                        <Cascader 
                            placeholder="选择吧"
                            options={this.state.options}  //需要展示的列表数据
                            loadData={this.loadData}  //当选择某个列表项，加载下一列表的回调函数
                        />
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.picturesWall} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.richTextEditor} detail={this.product.detail}/>
                    </Item>
                    <Item style={{ display: 'flex', justifyContent: 'center' }} labelCol={{ span: 23 }} wrapperCol={{ span: 1 }}>
                        <Button type='primary' shape="round" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default connect(
    state => ({ product: state.product }),
    { setProduct }
)(AddUpdate)
