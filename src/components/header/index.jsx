import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Popconfirm, message } from 'antd';
import { reqWeather, reqLocation } from '../../api'
import storageUtils from '../../utils/storageUtils'
import formateDate from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import "./index.less"
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), //当前时间字符串
        location: '',
        weather: '',
        temperature: ''
    }

    confirm=()=> {
        storageUtils.removeUser();
        memoryUtils.user={};
        this.props.history.replace('/login')
        message.success('您已退出登录');
    }

    getLocation = async () => {
        const data=await reqLocation();
        this.setState({location:data})
    }
    getWeather = async () => {
        const { weather, temperature} = await reqWeather();
        this.setState({ weather, temperature})
    }

    getTitle = ()=>{
        //得到当前请求路径
        const path=this.props.location.pathname.slice(1);
        let title = '';
        menuList.forEach(item=>{
            if(item.key===path){
                title=item.title;
            } else if (item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem){
                    title=cItem.title;
                }
            }
        })
        return title;
    }

    componentDidMount(){
        this.timeInterval=setInterval(() => {
            this.setState({ currentTime: formateDate(Date.now())})
        }, 1000);
        this.getLocation();
        this.getWeather();
        this.secondTimeInterval=setInterval(() => {
            this.getLocation();
            this.getWeather();
        }, 60000);
    }
        

    componentWillUnmount(){
        clearInterval(this.timeInterval)
        clearInterval(this.secondTimeInterval)
    }

    render() {
        const {currentTime,location,weather, temperature} = this.state
        const { username } = memoryUtils.user
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <Popconfirm
                        title="确定要退出吗`(*>﹏<*)′"
                        onConfirm={this.confirm}
                        okText="确定"
                        cancelText="取消"
                    >
                        <LinkButton>退出</LinkButton>
                        {/* <a href="/login">退出</a> */}
                    </Popconfirm>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{this.getTitle()}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>{`城市：${location}`}</span>
                        <span>{`天气：${weather}`}</span>
                        <span>{`温度：${temperature}`}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)