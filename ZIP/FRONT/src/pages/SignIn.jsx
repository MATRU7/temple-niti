import { useState, useContext } from "react";
import axiosClient from "../../apiClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function SignIn() {
    const [loginData, setloginData] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleInput = (e) => {
        setloginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(loginData.email, loginData.password);
            navigate("/");
        } catch (error) {
            console.error("Login Error:", error);
            alert(error.response?.data?.message || "Invalid credentials!");
        }
    };

    return (
        <div className="split-screen-container animate-fade-in w-100" style={{ margin: "-1rem -24px" }}>
            <div className="split-screen-left d-none d-lg-flex" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80')" }}>
                <div className="text-start z-1">
                    <h1 className="display-3 fw-bolder mb-4 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)', fontFamily: 'var(--font-heading)' }}>Welcome Back to <span className="text-gold">Ananda</span></h1>
                    <p className="lead fw-normal text-light opacity-100 pe-5 fs-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        Manage your sacred spaces, verify rituals, and guide thousands of devotees looking for peaceful darshan.
                    </p>
                </div>
            </div>
            
            <div className="split-screen-right position-relative">
                <div style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }} className="animate-slide-up delay-100">
                    <div className="text-center mb-5">
                        <div className="text-saffron d-inline-flex p-3 mb-2" style={{ backgroundColor: 'var(--color-sand)', borderRadius: '50%', border: 'var(--border-ornate)' }}>
                            <LogIn size={32} />
                        </div>
                        <h2 className="fw-bolder text-charcoal mb-2 display-6" style={{ fontFamily: 'var(--font-heading)' }}>Sign in to your account</h2>
                        <p className="text-secondary fs-5">Enter your details to proceed.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div>
                            <label className="form-label text-charcoal fw-bold ps-1">Email Address</label>
                            <input type="email" name="email" value={loginData.email} onChange={handleInput} 
                                className="form-control-traditional w-100" required placeholder="you@example.com" />
                        </div>

                        <div>
                            <label className="form-label text-charcoal fw-bold ps-1">Password</label>
                            <input type="password" name="password" value={loginData.password} onChange={handleInput} 
                                className="form-control-traditional w-100" required placeholder="••••••••" />
                        </div>

                        <button className="btn-traditional w-100 fw-bold mt-4 py-3 fs-5" type="submit">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center mt-5 text-secondary fs-5">
                        Don't have an account? <Link to="/signup" className="text-saffron fw-bold text-decoration-none ms-1">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
