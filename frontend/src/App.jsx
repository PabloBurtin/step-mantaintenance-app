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
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage.jsx'
import PedidoDetailPage from './pages/PedidoDetailPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import { USER_ROLES } from './constants/index.js'
import PublicPedidoPage from './pages/PublicPedidoPage.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage/>} />
        <Route path='/pedidos/public/:token' element={<PublicPedidoPage/>} /> 
        <Route path='/verify-email/:token' element={<VerifyEmailPage/>} />

        <Route path= "/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard/>}/>
          <Route path="clientes" element={<ClientesPage/>} />
          <Route path="locales/:clienteId" element={<LocalesPage/>} />
          <Route path="pedidos" element={<PedidosPage/>} />
          <Route path="pedidos/:id" element={<PedidoDetailPage/>} />
          <Route path='perfil' element={<PerfilPage/>} />
          <Route path="remitos" element={<RemitosPage/>} />
          <Route path='remitos/nuevo'element={<CrearRemitoPage/>} />
          <Route path="usuarios" element={
            <PrivateRoute roles={[USER_ROLES.ADMIN, USER_ROLES.GERENTE]}>
              <UsuariosPage />
            </PrivateRoute>
            } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App