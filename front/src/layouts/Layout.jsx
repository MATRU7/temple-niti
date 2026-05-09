import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
function Layout(){
    return (
        <div id="root-container" className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 animate-fade-in pb-5">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout