//包含多个actions creators函数的模块
//同步action：对象{type: 'XXX', data: 数据值}
//异步action：函数 dispatch=>{}
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, REST_USER, SET_PRODUCT } from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
import { message } from 'antd'


//设置标题头部的同步action
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

//接收到user的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, user})

//显示错误信息的同步action
const showErrorMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg })

//重置user的同步action
export const resetUser = () => ({ type: REST_USER, user: {} })

//设置product
export const setProduct = (product) => ({ type: SET_PRODUCT, product })

//登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        //1. 执行异步ajax请求
        const { data } = await reqLogin(username, password) //{status:0, data: user}/{status:1, msg:'XXX'}
        if(data.status===0){
            //2.1 如果成功，分发成功的同步action
            const user = data.data;
            //保存到localStorage中
            storageUtils.saveUser(user)
            message.success(`你好${user.username}~~~`)
            dispatch(receiveUser(user))
        }else{
            //2.2 如果失败，分发失败的同步action
            dispatch(showErrorMsg(data.msg))
        }
    }
}