import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute.jsx'
import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ClientesPage from './pages/ClientesPage.jsx'
import LocalesPage from './pages/LocalesPage.jsx'
import PedidosPage from './pages/PedidosPage.jsx'
import RemitosPage from './pages/RemitosPage.jsx'
import UsuariosPage from './pages/UsuariosPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CrearRemitoPage from './pages/CrearRemitoPage.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />

        <Route path= "/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard/>}/>
          <Route path="clientes" element={<ClientesPage/>} />
          <Route path="locales/:clienteId" element={<LocalesPage/>} />
          <Route path="pedidos" element={<PedidosPage/>} />
          <Route path="remitos" element={<RemitosPage/>} />
          <Route path='remitos/nuevo'element={<CrearRemitoPage/>} />
          <Route path="usuarios" element={
            <PrivateRoute roles={['admin']}>
              <UsuariosPage />
            </PrivateRoute>
            } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App