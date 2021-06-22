//包含应用中所有接口请求函数的模块
//每个函数的返回值都是promise对象
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

//1. 登录接口
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

//2. 添加用户接口
//3. 更新用户接口
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//4. 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')

//5. 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')

//6. 获取一级或二级分类的列表
export const reqCategories = (parentId) => ajax('/manage/category/list', { parentId })

//7. 添加一级或二级分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')

//8. 更新一级或二级分类的名字
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

//9. 根据分类ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', { categoryId })

//10. 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })

//11. 搜索商品分页列表 searchType:搜索的类型，productName/productDesc
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => ajax('/manage/product/search', { pageSize, pageNum, [searchType]: searchName })

//12. 添加商品
//13. 更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//14. 更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

//15. 添加图片 upload自动请求

//16. 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', { name }, 'POST')

//17. 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST')

//18. 获取所有角色列表
export const reqRoles = () => ajax('/manage/role/list')

//19. 更新角色，给角色设置权限
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//21. 给角色重命名
export const reqChangeRoleName = (id, name) => ajax('/manage/role/rename', { id, name}, 'POST')

// jsonp请求地址函数接口
export const reqLocation = () => {
    return new Promise((resolve,_)=>{
        const urlLocation = 'https://restapi.amap.com/v3/ip?key=b31596256c9e00d77cb696b6ea16e5a8';
        jsonp(urlLocation, {}, (err, data) => {
            if(!err&&data.status==='1'){
                resolve(data.city)
            }else{
                message.error('获取地址信息失败')
            }
        })
    })
}

// jsonp请求天气函数接口
export const reqWeather = () => {
    return new Promise(async(resolve,_)=>{
        var place = await reqLocation();
        const urlWeather = 'https://restapi.amap.com/v3/weather/weatherInfo?key=b31596256c9e00d77cb696b6ea16e5a8&city=' + place;
        jsonp(urlWeather, {}, (err, data) => {
            if (!err && data.status === '1') {
                resolve(data.lives[0])
            } else {
                message.error('获取天气信息失败')
            }
        })
    })
}