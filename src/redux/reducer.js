//用来根据现有的state指定的action生成并返回新的state的纯函数
import { combineReducers } from 'redux'

import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, REST_USER } from './action-types'
import storageUtils from '../utils/storageUtils'

//用来管理头部标题的reducer函数
const initHeadTitle = '首页'
function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

//用来管理当前登录用户的reducer函数
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg=action.errorMsg
            return { ...state, errorMsg } //不要直接修改原本的状态数据
        case REST_USER:
            return {}
        default:
            return state
    }
}

//向外默认暴露的是合并产生的总的reducer函数
//管理总的state的结构：{headTitle: '首页', user={XXX}}
export default combineReducers({
    headTitle,
    user
})