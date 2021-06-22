import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

//用于图片上传的组件
export default class PicturesWall extends Component {
    state = {
        previewVisible: false, //标识是否显示modal预览
        previewTitle: '', //modal图片的标题
        previewImage: '', //modal图片的url
        fileList: [],
    };

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props);
        //一旦传入imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0){
            let fileList=imgs.map((img,index)=>({
                uid: -index, //每个file都有自己的唯一id
                name: img, //图片文件名
                status: 'done',
                url: BASE_IMG_URL+img,
            }))
            this.state.fileList=fileList
        }
    }

    //将modal隐藏，隐藏图片
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        // console.log('handlePreview',file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //fileList：是所有已上传文件图片的数组
    //file：是当前操作的图片文件（上传/删除）
    handleChange = async ({ file, fileList }) => {
        //一旦文件上传成功，就将上传的file的信息进行修正（name和url）
        if (file.status === "done") {
            const result = file.response;
            if(result.status===0){
                message.success('图片上传成功啦~~~')
                const { name, url } = result.data;
                fileList[fileList.length - 1].name = name;
                fileList[fileList.length - 1].url = url;
                // console.log('handleChange', file, fileList)
            }else{
                message.error('欸？服务器开小差了哦，失败啦')
            }
        } else if (file.status === "removed") {
            // console.log(fileList,file)
            const {data}=await reqDeleteImg(file.name)
            if(data.status===0){
                message.success('删除成功啦')
            }else{
                message.error('删除失败，服务器开小差啦')
            }
        }
        //在上传或删除过程中及时更新图片列表
        this.setState({ fileList });
    }

    //获取所有已上传的图片文件名数组
    getImgs=()=>{
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewTitle, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"//上传图片的接口地址
                    accept="image/*" //直接收图片类型的文件
                    listType="picture-card" //卡片样式
                    name='image'//发到后台的文件参数名
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="图片" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}