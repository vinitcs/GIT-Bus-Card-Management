import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from "react-redux";
import { store } from './redux/store.js';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import "./Interceptors/axios.js"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
        bodyClassName="toastBody"
      />
    </Provider>
  </React.StrictMode>,
)
