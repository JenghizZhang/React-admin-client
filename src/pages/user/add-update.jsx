import React, { PureComponent } from 'react'
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'

const Option = Select.Option;

//添加或修改用户的form组件
export default class AddUpdateUser extends PureComponent {

    //对表格属性进行限制
    static propTypes = {
        getForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
    }

    componentDidMount() {
        this.props.getForm(this.form)
    }

    //对密码进行自定义验证
    validator = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('需要输入密码哦~~'));
        } else if (value.length < 4 || value.length > 12 || !/^[A-Za-z0-9_]+$/.test(value)) {
            return Promise.reject(new Error('不符合要求哦~~'));
        }
        return Promise.resolve();
    }

    render() {
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const user = this.props.user || {}

        return (
            <Form className="AddUpdateRole-form" ref={c => this.form = c} {...layout}>
                <Form.Item
                    initialValue={user.username}
                    label="用户名："
                    name="username"
                    rules={[
                        { required: true, whitespace: true, message: '需要输入用户名哦~~' },
                        { min: 4, message: '不能小于4位哦~~' },
                        { max: 12, message: '不能大于12位哦~~' },
                        { pattern: /^[A-Za-z0-9_]+$/, message: '不符合要求哦~~' }
                    ]} required
                >
                    <Input placeholder="用户名称是什么嘞~~" ></Input>
                </Form.Item>
                {
                    user._id?null:(
                        <Form.Item label="密码：" name="password" initialValue={user.password} rules={[{ validator: this.validator }]} required>
                            <Input type='password' placeholder="密码是什么嘞~~" ></Input>
                        </Form.Item>
                    )
                }
                <Form.Item label="电话：" name="phone" initialValue={user.phone}>
                    <Input placeholder="电话是什么嘞~~" ></Input>
                </Form.Item>
                <Form.Item label="邮箱：" name="email" initialValue={user.email} rules={[{ pattern: new RegExp('^[0-9a-zA-Z\\.]+@[0-9a-zA-Z]+\\.[a-zA-Z]+$'), message: '邮箱格式不对哦~'}]}>
                    <Input placeholder="邮箱是什么嘞~~" ></Input>
                </Form.Item>
                <Form.Item label="角色：" name="role_id" initialValue={user.role_id}>
                    <Select placeholder="角色是什么嘞~~">
                        {
                            this.props.roles.map(role => (
                                <Option key={role._id} value={role._id} children={role.name} />
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}
