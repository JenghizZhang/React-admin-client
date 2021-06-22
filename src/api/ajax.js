//能发送异步ajax请求的函数模块
//封装的是axios库
//函数的返回值是promise对象
//1. 优化：统一处理请求异常

import axios from 'axios'
import { message } from 'antd';
//指定默认值
export default function ajax(url, data = {}, method = 'GET') {

    return new Promise ((resolve,_)=>{
        let promise;
        //1. 执行异步ajax请求
        if (method === 'GET') {
            promise = axios.get(url, { params: data })
        } else {
            promise = axios.post(url, data)
        }
        //2. 成功调用resolve
        promise.then(response=>{
            resolve(response)
        })
        //3. 失败不调用reject，而是提示异常信息
        .catch(error=>{
            message.error('请求出错了： '+error.message)
        })
    })
}


// //请求登录接口
// ajax('/login', { username: 'admin', password: "admin" }, 'POST');
// //添加用户
// ajax('/manage/user/add', { username: 'tom', password: "123",phone:"1231231234567" }, 'POST');

