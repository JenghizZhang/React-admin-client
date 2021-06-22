import React, { Component } from 'react'
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'

export default class ChangeName extends Component {

    //对表格属性进行限制
    static propTypes = {
        getForm: PropTypes.func.isRequired, //用来传递form对象的函数
        selectedRole: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.getForm(this.form)
    }

    validator = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('需要输入角色名称哦~~'));
        } else if (value.trim() === '') {
            return Promise.reject(new Error('角色名称不能全是空格哦~~'));
        }
        return Promise.resolve();
    }

    render() {
        return (
            <Form layout="vertical" className="ChangeRoleName-form" ref={c => this.form = c}>
                <Form.Item label="角色名称：" name="roleName" rules={[{ validator: this.validator }]} initialValue={this.props.selectedRole.name}  required>
                    <Input placeholder="角色名称是什么嘞~~" ></Input>
                </Form.Item>
            </Form>
        )
    }
}
