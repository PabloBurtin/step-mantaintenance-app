import { Outlet } from "react-router-dom";
import Navbar from './Navbar.jsx'

const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout