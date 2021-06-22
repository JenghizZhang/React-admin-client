import React, { Component } from 'react'
import { Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import './index.less'
import logo from '../../assets/imgs/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;
var openKey = '';

//左侧导航的组件
class LeftNav extends Component {
/*     // 根据menu的数据数组生成对应的标签数组
    getMenuNodes = (menuList) => { 
        return menuList.map(item => {
            //有可能是Menu.Item也有可能是SubMenu
            // {
            //     title:"首页",
            //     key: "home",
            //     icon: "<MailOutlined />",
            //     children: []
            // } 
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={`/${item.key}`}>{item.title}</Link>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                );
            }
        })
    } */


    //判断当前永辉对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        //1. 如果当前用户是admin
        //2. 如果当前用户没有设置权限，isPublic===true的菜单
        //3. 当前用户有此item权限
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1){
            return true;
        } else if (item.children) {
            //如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    // 用reduce来实现
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item)=>{
            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if(this.hasAuth(item)){
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={`/${item.key}`}>{item.title}</Link>
                        </Menu.Item>
                    ))
                } else {
                    //查找一个与当前路径匹配的子item
                    const cItem = item.children.find((cItem) => this.props.location.pathname.indexOf(cItem.key) === 1)
                    if (cItem) {
                        openKey = item.key;
                    }

                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        },[])
    }

    constructor(props){
        super(props);
        this.menuNodes = this.getMenuNodes(menuList)
    }
    
    render() {
        //得到当前请求的路由路径
        let path = this.props.location.pathname.slice(1)
        if (path.substring(0,7)==='product'){
            path = 'product'
            // openKey='sub1'
        }
        return (
            <div className="left-nav">
                <Link to='/home'>
                    <header className="left-nav-header">
                        <img src={logo} alt="妞妞妞妞~" />
                        <h1>后台~</h1>
                    </header>
                </Link>
                
                <div>
                    <Menu
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    >
                        {this.menuNodes}
                    </Menu>
                </div>
           </div>
        )
    }
}
//因为本身没有location属性，所以需要用withRouter改为路由组件
export default withRouter(LeftNav)