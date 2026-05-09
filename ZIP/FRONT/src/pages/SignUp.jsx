import { useState, useContext } from "react";
import axiosClient from "../../apiClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function SignUp() {
    const [signupData, setSignupData] = useState({ name: "", mobile: "", email: "", password: "" });
    const { login } = useContext(AuthContext); // Can auto login later
    const navigate = useNavigate();

    const handleInput = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/users", signupData);
            if (res.status === 201 || res.status === 200) {
                alert("Account created successfully! Please Sign In.");
                navigate("/signin");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response?.data?.message || "Failed to sign up.");
        }
    };

    return (
        <div className="split-screen-container animate-fade-in w-100" style={{ margin: "-1rem -24px" }}>
            <div className="split-screen-left d-none d-lg-flex" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80')" }}>
                <div className="text-start z-1">
                    <h1 className="display-3 fw-bolder mb-4 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)', fontFamily: 'var(--font-heading)' }}>Join the <span className="text-gold">Community</span></h1>
                    <p className="lead fw-normal text-white opacity-100 pe-5 fs-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        Register to list your local temple, document vital Niti schedules, and help the community stay connected.
                    </p>
                </div>
            </div>
            
            <div className="split-screen-right position-relative">
                <div style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }} className="animate-slide-up delay-100">
                    <div className="text-center mb-5">
                        <div className="text-saffron d-inline-flex p-3 mb-2" style={{ backgroundColor: 'var(--color-sand)', borderRadius: '50%', border: 'var(--border-ornate)' }}>
                            <UserPlus size={32} />
                        </div>
                        <h2 className="fw-bolder text-charcoal mb-2 display-6" style={{ fontFamily: 'var(--font-heading)' }}>Create an account</h2>
                        <p className="text-secondary fs-5">Fill out your details to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div>
                            <label className="form-label text-charcoal fw-bold ps-1">Full Name</label>
                            <input type="text" name="name" value={signupData.name} onChange={handleInput} 
                                className="form-control-traditional w-100" required placeholder="John Doe" />
                        </div>
                        
                        <div>
                            <label className="form-label text-charcoal fw-bold ps-1">Mobile Number</label>
                            <input type="number" name="mobile" value={signupData.mobile} onChange={handleInput} 
                                className="form-control-traditional w-100" required placeholder="9876543210" />
                        </div>

                        <div>
                            <label className="form-label text-charcoal fw-bold ps-1">Email Address</label>
                            <input type="email" name="email" value={signupData.email} onChange={handleInput} 
                                className="form-control-traditional w-100" required placeholder="you@example.com" />
                        </div>

                        <div>
                            <label className="form-label text-charcoal fw-bold ps-1">Password</label>
                            <input type="password" name="password" value={signupData.password} onChange={handleInput} 
                                className="form-control-traditional w-100" required placeholder="••••••••" />
                        </div>

                        <button className="btn-traditional w-100 fw-bold mt-4 py-3 fs-5" type="submit">
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center mt-5 text-secondary fs-5">
                        Already have an account? <Link to="/signin" className="text-saffron fw-bold text-decoration-none ms-1">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
