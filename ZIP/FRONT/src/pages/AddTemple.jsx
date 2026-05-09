import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../apiClient.js";
import { AuthContext } from "../context/AuthContext";

export default function AddTemple() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        state: "",
        city: "",
        status: "open",
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    if(!user) {
        return <div className="container mt-5"><div className="alert alert-warning shadow-sm rounded p-4 fw-bold text-center" style={{ border: 'var(--border-ornate)' }}>Please login to add a temple.</div></div>
    }

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleFileChange = (e) => setImage(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (let key in formData) {
                data.append(key, formData[key]);
            }
            if (image) data.append("templeImage", image);

            await axiosClient.post("/temples", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to add temple");
        }
    }

    return (
        <div className="container mt-5 mb-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="devotional-card p-5">
                        <div className="text-center mb-5">
                            <h1 className="fw-bolder text-charcoal mb-3 display-5" style={{ fontFamily: 'var(--font-heading)' }}>Add Temple Listing</h1>
                            <hr className="ornate-divider w-50 mx-auto" />
                            <p className="text-secondary fs-5">Register a new sacred location to the community database.</p>
                        </div>
                        {error && <div className="alert alert-danger rounded shadow-sm">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">Temple Name</label>
                                    <input type="text" name="name" className="form-control-traditional w-100" onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-charcoal fw-bold ps-1">City</label>
                                    <input type="text" name="city" className="form-control-traditional w-100" onChange={handleChange} required />
                                </div>
                            </div>
                            
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">State</label>
                                    <input type="text" name="state" className="form-control-traditional w-100" onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-charcoal fw-bold ps-1">Location (Address)</label>
                                    <input type="text" name="location" className="form-control-traditional w-100" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">Darshan Start Time</label>
                                    <input type="time" name="startTime" className="form-control-traditional w-100" onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">Darshan End Time</label>
                                    <input type="time" name="endTime" className="form-control-traditional w-100" onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-charcoal fw-bold ps-1">Current Status</label>
                                    <select name="status" className="form-control-traditional w-100" onChange={handleChange} value={formData.status}>
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1">Description</label>
                                <textarea name="description" className="form-control-traditional w-100" rows="4" onChange={handleChange} required></textarea>
                            </div>

                            <div className="mb-5">
                                <label className="form-label text-charcoal fw-bold ps-1">Temple Image</label>
                                <input type="file" name="templeImage" className="form-control-traditional w-100 p-2" onChange={handleFileChange} required accept="image/*" />
                            </div>

                            <button type="submit" className="btn-traditional w-100 py-3 mt-2 fs-5">
                                Publish Temple
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
