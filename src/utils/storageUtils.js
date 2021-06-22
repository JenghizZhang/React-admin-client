import store from 'store'

//进行local数据存储管理的工具模块
const USER_KEY = 'user_key'

var storageUtils={
    //保存user
    saveUser(user) {
        store.set(USER_KEY,user)
    },
    //读取user
    getUser(){
        return store.get(USER_KEY)||{}
    },
    //删除user
    removeUser(){
        store.remove(USER_KEY)
    }
}
// localStorage只能保存string，如果是对象，自动调用toString（）方法
// var storageUtils = {
//     //保存user
//     saveUser(user) {
//         localStorage.setItem(USER_KEY, JSON.stringify(user))
//     },
//     //读取user
//     getUser() {
//         return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
//     },
//     //删除user
//     removeUser() {
//         localStorage.removeItem(USER_KEY)
//     }
// }

export default storageUtils