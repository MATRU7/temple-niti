import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../apiClient.js";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";

export default function AddNiti() {
    const { templeId, nitiId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!nitiId);
    const [error, setError] = useState(null);
    const [nitiForm, setNitiForm] = useState({
        currentNiti: "",
        nextNiti: "",
        status: "Open",
        startTime: "",
        endTime: ""
    });
    const [nitiImageFile, setNitiImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (nitiId && templeId) {
            const fetchNitiDetails = async () => {
                setFetching(true);
                try {
                    const res = await axiosClient.get(`/nitti/temple/${templeId}`);
                    // Use string conversion to ensure IDs match correctly
                    const niti = res.data.find(n => n._id.toString() === nitiId.toString());
                    if (niti) {
                        const formatDt = (dt) => {
                            if (!dt) return "";
                            const date = new Date(dt);
                            return !isNaN(date.getTime()) ? date.toISOString().slice(0, 16) : "";
                        };
                        setNitiForm({
                            currentNiti: niti.currentNiti || "",
                            nextNiti: niti.nextNiti || "",
                            status: niti.status || "Open",
                            startTime: formatDt(niti.startTime),
                            endTime: formatDt(niti.endTime)
                        });
                        if (niti.nitiImage) setImagePreview(niti.nitiImage);
                    } else {
                        console.error("Niti ID not found in temple rituals list:", nitiId);
                        setError("Ritual not found in this temple schedule.");
                    }
                } catch (err) {
                    console.error("Error fetching niti details:", err);
                    setError("Failed to fetch ritual details.");
                } finally {
                    setFetching(false);
                }
            };
            fetchNitiDetails();
        }
    }, [nitiId, templeId]);

    const handleChange = (e) => setNitiForm({ ...nitiForm, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNitiImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append('currentNiti', nitiForm.currentNiti);
            data.append('nextNiti', nitiForm.nextNiti);
            data.append('status', nitiForm.status);
            data.append('startTime', nitiForm.startTime);
            if (nitiForm.endTime) data.append('endTime', nitiForm.endTime);
            if (nitiImageFile) data.append('nitiImage', nitiImageFile);

            if (nitiId) {
                await axiosClient.put(`/nitti/${nitiId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                data.append('mandir', templeId);
                await axiosClient.post("/nitti", data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate(`/temple/${templeId}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save ritual.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning shadow-sm rounded p-4 fw-bold text-center" style={{ border: 'var(--border-ornate)' }}>
                    Please login to manage rituals.
                </div>
            </div>
        );
    }

    if (fetching) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-warning" />
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <button 
                        onClick={() => navigate(`/temple/${templeId}`)}
                        className="btn btn-link text-charcoal d-flex align-items-center gap-2 mb-4 p-0 text-decoration-none fw-bold"
                    >
                        <ArrowLeft size={18} /> Back to Temple
                    </button>

                    <div className="devotional-card p-5">
                        <div className="text-center mb-5">
                            <h1 className="fw-bolder text-charcoal mb-3 display-5" style={{ fontFamily: 'var(--font-heading)' }}>
                                {nitiId ? "Edit Ritual Schedule" : "Add New Ritual"}
                            </h1>
                            <hr className="ornate-divider w-50 mx-auto" />
                            <p className="text-secondary fs-5">
                                {nitiId ? "Update the details for this sacred ritual." : "Schedule a new ritual or Niti for this temple."}
                            </p>
                        </div>

                        {error && <div className="alert alert-danger rounded shadow-sm mb-4">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1">Current Ritual Name</label>
                                <input 
                                    type="text" 
                                    name="currentNiti" 
                                    className="form-control-traditional w-100" 
                                    value={nitiForm.currentNiti} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="e.g. Mahasnan, Sandhya Alati"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1">Next Scheduled Ritual</label>
                                <input 
                                    type="text" 
                                    name="nextNiti" 
                                    className="form-control-traditional w-100" 
                                    value={nitiForm.nextNiti} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="What comes after this?"
                                />
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-12">
                                    <label className="form-label text-charcoal fw-bold ps-1">Status</label>
                                    <select 
                                        name="status" 
                                        className="form-control-traditional w-100" 
                                        value={nitiForm.status} 
                                        onChange={handleChange}
                                    >
                                        <option>Open</option>
                                        <option>Closed</option>
                                        <option>Darshan Available</option>
                                        <option>Special Ritual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1">Start Time</label>
                                    <div className="position-relative">
                                        <input 
                                            type="datetime-local" 
                                            name="startTime" 
                                            className="form-control-traditional w-100" 
                                            value={nitiForm.startTime} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-charcoal fw-bold ps-1">End Time (Optional)</label>
                                    <div className="position-relative">
                                        <input 
                                            type="datetime-local" 
                                            name="endTime" 
                                            className="form-control-traditional w-100" 
                                            value={nitiForm.endTime} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="form-label text-charcoal fw-bold ps-1">Ritual Image (Optional)</label>
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
                                    onClick={() => document.getElementById('nitiImage').click()}
                                >
                                    <input 
                                        type="file" 
                                        id="nitiImage" 
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
                                                <span className="badge bg-dark opacity-75">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <ImageIcon size={48} className="text-gold mb-2 opacity-50" />
                                            <p className="text-secondary mb-0">Click to upload or drag and drop</p>
                                            <p className="small text-muted">PNG, JPG or JPEG (Max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-traditional w-100 py-3 mt-2 fs-5 d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <Save size={20} />
                                )}
                                {nitiId ? "Update Ritual Schedule" : "Publish Ritual"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
