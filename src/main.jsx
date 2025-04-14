import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App copy'
import { Toaster } from './components/ui/sonner'
import ItemProvider from './contexts/ItemProvider'
import ListProvider from './contexts/ListProvider'
import Dashboard from './Dashboard'
import './index.css'
import Home from './pages/Home'
import List from './pages/List'
import Login from './pages/Login'
import UserProvider from './contexts/UserProvider'
import GuestLayout from './layouts/GuestLayout'
import AxiosProvider from './contexts/AxiosProvider'
import Profile from './pages/Profile'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AxiosProvider>
        <UserProvider>
          <Routes>
            <Route path='/' element={
              <ListProvider>
                <ItemProvider>
                  <Dashboard />
                </ItemProvider>
              </ListProvider>
              }> 
              <Route index element={<Home />}/>
              <Route path='/lists/:id' element={<List/>}/> 
              <Route path='/luigi' element={<App/>}/> {/* with dashboard */}
              <Route path='/profile' element={<Profile/>} />
            </Route>
            <Route path='/' element={<GuestLayout />}> 
              <Route path='/login' element={<Login />} />
            </Route>
            <Route path='/luigi' element={<App/>}/> {/* without dashboard */}
          </Routes>
          </UserProvider>
        <Toaster />
      </AxiosProvider>
    </BrowserRouter>
  </StrictMode>,
)

/* Home.jsx è caricato dentro a dashboard.jsx, ma in realtà è figlio di main.jsx, stessa cosa dashboard.jsx*/
