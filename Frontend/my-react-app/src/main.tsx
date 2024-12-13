import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as React from 'react';
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MyContextProvider } from './components/custom/MyContext.tsx';

const router = createBrowserRouter([{
  path: "/",
  element:<App/>
}])


createRoot(document.getElementById('root')!).render(
  <MyContextProvider>
    <RouterProvider router={router} />
  </MyContextProvider>,
)
