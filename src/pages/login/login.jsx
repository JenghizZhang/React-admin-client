import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/imgs/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storeageUtils from '../../utils/storageUtils'


//登录的路由组件
export default class Login extends Component {
    //提交ajax请求
    onFinish = async (values) => {
        // console.log('提交ajax请求', values);
        // 请求登录
        const response = await reqLogin(values.username, values.password)
        if (response.data.status===1){
            message.error(response.data.msg)
            // console.log(response.data.msg)
        }else{
            memoryUtils.user = response.data.data;//保存到内存中
            storeageUtils.saveUser(response.data.data)//保存到local中
            message.success(`你好${response.data.data.username}~~~`)
            //不需要在回退，所以用replace
            this.props.history.replace('/')
        }       
    };

    //对密码进行自定义验证
    validator = (_, value) => {
        if(!value) {
            return Promise.reject(new Error('需要输入密码哦~~'));
        } else if (value.length < 4 || value.length > 12 || !/^[A-Za-z0-9_]+$/.test(value)) {
            return Promise.reject(new Error('不符合要求哦~~'));
        }
        return Promise.resolve();
    }

    render() {
        //判断用户是否登录
        const user = memoryUtils.user;
        if (user && user._id) {
            //自动跳转到登录（在render中）
            return <Redirect to="/"></Redirect>
        }


        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="徐妞妞妞妞妞妞"/>
                    <h1>后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, whitespace:true, message: '需要输入用户名哦~~' },
                                { min: 4, message: '不能小于4位哦~~' },
                                { max: 12, message: '不能大于12位哦~~'},
                                { pattern:/^[A-Za-z0-9_]+$/, message: '不符合要求哦~~'}
                            ]}
                            // initialValue="admin"
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0,0,0,0.25)'}} />} placeholder="用户名是什么嘞" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { validator: this.validator }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                                type="password"
                                placeholder="密码是什么嘞"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
