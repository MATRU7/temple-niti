import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top devotional-nav py-3">
            <div className="container">
                {/* Traditional Devotional Logo */}
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <span className="fs-3">ॐ</span> {/* Using Om symbol instead of building */}
                    <span>Temple Niti</span>
                </Link>
                
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto ps-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/">Directory</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/about">About Us</Link>
                        </li>
                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link px-3" to="/add-temple">Add Mandir</Link>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-white fw-bold fs-5">Suprabhat, <span className="text-gold">{user.name}</span></span>
                                <button className="btn-traditional px-4 py-2" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-3">
                                <Link className="btn-outline-gold" to="/signin">Sign In</Link>
                                <Link className="btn-traditional" style={{ textDecoration: 'none', padding: '0.6rem 1.5rem' }} to="/signup">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}