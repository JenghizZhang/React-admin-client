// import React, { Component } from 'react'
// import { Form, Input } from 'antd';
// import PropTypes from 'prop-types'


// const layout = {
//     labelCol: { span: 6 },
//     wrapperCol: { span: 16 },
// };

// //添加分类form组件
// export default class AddForm extends Component {

//     static propTypes={
//         categoryName: PropTypes.string.isRequired,
//         setForm:PropTypes.func.isRequired
//     }

//     render() {
//         return (
//             <div>
//                 <Form
//                     {...layout}
//                     name="basic"
//                 >
//                     <Form.Item
//                         label="分类名称"
//                         name="categoriyName"
//                         rules={[{ required: true, message: '分类名称是什么嘞' }]}
//                         initialValue={this.props.categoryName}
                        
//                     >
//                         <Input placeholder="分类名称是什么嘞" ref={c => this.inputValue = c} onKeyUp={() => this.props.setForm(this.inputValue.props)}></Input>
//                     </Form.Item>
//                 </Form>
//             </div>
//         )
//     }
// }
