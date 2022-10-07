import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { loader } from './App'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

import { worker } from './mocks/browser'


if (process.env.NODE_ENV === 'development') {
  worker.start().catch(e => console.log(e))
}

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    loader
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
)
