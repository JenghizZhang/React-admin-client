import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, HashRouter } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import App from './App';
import { Provider } from 'react-redux'

import store from './redux/store'
// 读取local中保存的user，保存到内存中
// import storageUtils from './utils/storageUtils'
// import memoryUtils from './utils/memoryUtils'
// const user = storageUtils.getUser()
// memoryUtils.user=user;

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
  ,
  document.getElementById('root')
);
