import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../apiClient.js";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Save, MapPin, Image as ImageIcon } from "lucide-react";

export default function EditTemple() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [templeForm, setTempleForm] = useState({
        name: "",
        location: "",
        city: "",
        state: "",
        description: "",
        startTime: "",
        endTime: "",
        status: "open"
    });
    const [templeEditFile, setTempleEditFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchTemple = async () => {
            try {
                const res = await axiosClient.get("/temples");
                const found = res.data.find(t => t._id.toString() === id.toString());
                if (!found) {
                    setError("Temple not found");
                    return;
                }
                setTempleForm({
                    name: found.name,
                    location: found.location,
                    city: found.city,
                    state: found.state,
                    description: found.description,
                    startTime: found.startTime,
                    endTime: found.endTime,
                    status: found.status
                });
                if (found.templeImage) setImagePreview(found.templeImage);
            } catch (err) {
                setError("Failed to fetch temple details.");
            } finally {
                setFetching(false);
            }
        };
        fetchTemple();
    }, [id]);

    const handleChange = (e) => setTempleForm({ ...templeForm, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempleEditFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleTempleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = new FormData();
            for (let key in templeForm) {
                data.append(key, templeForm[key]);
            }
            if (templeEditFile) {
                data.append("templeImage", templeEditFile);
            }

            await axiosClient.put(`/temples/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate(`/temple/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update temple");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="container mt-5 text-center alert alert-warning">Please login to edit this temple.</div>;
    }

    if (fetching) {
        return <div className="container mt-5 text-center"><div className="spinner-border text-warning" /></div>;
    }

    return (
        <div className="container mt-5 mb-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <button 
                        onClick={() => navigate(`/temple/${id}`)}
                        className="btn btn-link text-charcoal d-flex align-items-center gap-2 mb-4 p-0 text-decoration-none fw-bold"
                    >
                        <ArrowLeft size={18} /> Back to Temple
                    </button>

                    <div className="devotional-card p-5">
                        <div className="text-center mb-5">
                            <h1 className="fw-bolder text-charcoal mb-3 display-5" style={{ fontFamily: 'var(--font-heading)' }}>Edit Temple Details</h1>
                            <hr className="ornate-divider w-50 mx-auto" />
                            <p className="text-secondary fs-5">Update the information for this sacred location.</p>
                        </div>

                        {error && <div className="alert alert-danger rounded shadow-sm mb-4">{error}</div>}

                        <form onSubmit={handleTempleEditSubmit}>
                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1">Temple Name</label>
                                <input type="text" name="name" className="form-control-traditional w-100" value={templeForm.name} onChange={handleChange} required />
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">City</label>
                                    <input type="text" name="city" className="form-control-traditional w-100" value={templeForm.city} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-charcoal fw-bold ps-1">State</label>
                                    <input type="text" name="state" className="form-control-traditional w-100" value={templeForm.state} onChange={handleChange} required />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1">Location Details (Address)</label>
                                <div className="position-relative">
                                    <MapPin className="position-absolute translate-middle-y top-50 start-0 ms-3 text-gold opacity-50" size={18} />
                                    <input type="text" name="location" className="form-control-traditional w-100 ps-5" value={templeForm.location} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">Darshan Start</label>
                                    <input type="time" name="startTime" className="form-control-traditional w-100" value={templeForm.startTime} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">Darshan End</label>
                                    <input type="time" name="endTime" className="form-control-traditional w-100" value={templeForm.endTime} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-charcoal fw-bold ps-1">Status</label>
                                    <select name="status" className="form-control-traditional w-100" value={templeForm.status} onChange={handleChange}>
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1">Description</label>
                                <textarea name="description" className="form-control-traditional w-100" rows="4" value={templeForm.description} onChange={handleChange} required></textarea>
                            </div>

                            <div className="mb-5">
                                <label className="form-label text-charcoal fw-bold ps-1">Update Temple Photo (Optional)</label>
                                <div 
                                    className="image-upload-container position-relative"
                                    style={{ 
                                        border: '2px dashed var(--color-gold-dark)', 
                                        borderRadius: '8px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--color-sand)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => document.getElementById('templeImage').click()}
                                >
                                    <input 
                                        type="file" 
                                        id="templeImage" 
                                        className="d-none" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                    />
                                    {imagePreview ? (
                                        <div className="position-relative">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="img-fluid rounded shadow-sm" 
                                                style={{ maxHeight: '250px', objectFit: 'cover', width: '100%' }} 
                                            />
                                            <div className="position-absolute top-0 end-0 p-2">
                                                <span className="badge bg-dark opacity-75">Change Photo</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <ImageIcon size={48} className="text-gold mb-2 opacity-50" />
                                            <p className="text-secondary mb-0">Click to upload or drag and drop</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="btn-traditional w-100 py-3 mt-2 fs-5 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm" /> : <Save size={20} />}
                                Update Temple Details
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
