// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Form, Input, Select } from 'antd';

// const Option = Select.Option

// const layout = {
//     labelCol: { span: 6 },
//     wrapperCol: { span: 16 },
// };

// //添加分类form组件
// export default class AddForm extends Component {

//     static propTypes={
//         categorys: PropTypes.array.isRequired, //一级分类的数组
//         parentId: PropTypes.string.isRequired //父分类ID
//     }

//     render() {
//         return (
//             <div>
//                 <Form
//                     {...layout}
//                     name="basic"
//                 >
//                     <Form.Item initialValue={this.props.parentId} name="parentId" label="所属分类" rules={[{ required: true, message: '所属分类是什么嘞' }]}>
//                         <Select placeholder="选择分类" onChange={(e) => { console.log(e); this.props.addParentId(e)}}>
//                             <Option value="0">一级分类</Option>
//                             {
//                                 this.props.categorys.map((c) => <Option value={c._id} key={c._id}>{c.name}</Option>)
//                             }
//                         </Select>
//                     </Form.Item>
//                     <Form.Item
//                         label="分类名称"
//                         name="categoriyName"
//                         rules={[{ required: true, message: '分类名称是什么嘞' }]}
//                     >
//                         <Input placeholder="分类名称是什么嘞" ref={c => this.inputValue = c} onKeyUp={() => { this.props.addName(this.inputValue.props.value)}}></Input>
//                     </Form.Item>
//                 </Form>

//             </div>
//         )
//     }
// }