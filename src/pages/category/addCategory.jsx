import React, { Component } from 'react'
import { Form, Select, Input } from 'antd';
import PropTypes from 'prop-types'

const { Option } = Select;
export default class AddCategory extends Component {
    validator = (_, value) => {
        if(!value) {
            return Promise.reject(new Error('需要输入分类名称哦~~'));
        }else if(value.trim()===''){
            return Promise.reject(new Error('分类名称不能全是空格哦~~'));
        }
        return Promise.resolve();
    }

    static propTypes={
        categories: PropTypes.array.isRequired, //一级分类的数组
        parentId: PropTypes.string.isRequired, //父分类id
        addValues: PropTypes.func.isRequired, //向父组件传递ref
    }

    render() {
        return (
            <Form layout="vertical" className="addCategory-form" ref={(c) => { this.form = c; this.props.addValues(this.form)}}>
                <Form.Item initialValue={this.props.parentId} label="所属分类：" name="parentId" rules={[{ required: true, message: '所属分类是什么嘞' }]}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="分类是什么嘞~~"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="0">一级分类</Option>
                        {this.props.categories.map((category) => <Option value={category._id} children={category.name} key={category._id}></Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="分类名称：" name="categoryName" rules={[{ validator: this.validator }]} required>
                    <Input placeholder="分类名称是什么嘞~~"></Input>
                </Form.Item>
            </Form>
        )
    }
}