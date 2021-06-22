import React, { Component } from 'react'
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'

export default class UpdateCategory extends Component {
    //对表现属性进行限制
    static propTypes={
        categoryName: PropTypes.string.isRequired,
        updateValue: PropTypes.func.isRequired,
    }

    validator = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('需要输入分类名称哦~~'));
        } else if (value.trim() === '') {
            return Promise.reject(new Error('分类名称不能全是空格哦~~'));
        }
        return Promise.resolve();
    }
    render() {
        return (
            <Form layout="vertical" className="updateCategory-form">
                <Form.Item initialValue={this.props.categoryName} label="分类名称：" name="categoryName" rules={[{ validator: this.validator }]} required>
                    <Input placeholder="分类名称是什么嘞~~" onChange={(event) => { this.props.updateValue(event.target.value);}}></Input>
                </Form.Item>
            </Form>
        )
    }
}
