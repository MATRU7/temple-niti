import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../apiClient.js";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Save, Image as ImageIcon, Clock, FileText } from "lucide-react";

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
        description: "",
        status: "Open",
        startTime: "",
        endTime: "",
        nextNitiTime: ""
    });
    const [nitiImageFile, setNitiImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (nitiId && templeId) {
            const fetchNitiDetails = async () => {
                setFetching(true);
                try {
                    const res = await axiosClient.get(`/nitti/temple/${templeId}`);
                    // Handle both array response and { nitis: [...] } response
                    const nitisArr = Array.isArray(res.data) ? res.data : res.data.nitis;
                    const niti = nitisArr?.find(n => n._id.toString() === nitiId.toString());
                    if (niti) {
                        const formatDt = (dt) => {
                            if (!dt) return "";
                            const date = new Date(dt);
                            return !isNaN(date.getTime()) ? date.toISOString().slice(0, 16) : "";
                        };
                        setNitiForm({
                            currentNiti: niti.currentNiti || "",
                            nextNiti: niti.nextNiti || "",
                            description: niti.description || "",
                            status: niti.status || "Open",
                            startTime: formatDt(niti.startTime),
                            endTime: formatDt(niti.endTime),
                            nextNitiTime: formatDt(niti.nextNitiTime)
                        });
                        if (niti.nitiImage) setImagePreview(niti.nitiImage);
                    } else {
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
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be smaller than 5MB.");
                return;
            }
            setNitiImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError(null);
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
            if (nitiForm.description) data.append('description', nitiForm.description);
            if (nitiForm.endTime) data.append('endTime', nitiForm.endTime);
            if (nitiForm.nextNitiTime) data.append('nextNitiTime', nitiForm.nextNitiTime);
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
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to save ritual.");
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
                            {/* Current Niti Name */}
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

                            {/* Next Niti Name */}
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

                            {/* Description — NEW FIELD */}
                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1 d-flex align-items-center gap-2">
                                    <FileText size={16} className="text-saffron" /> Description <span className="text-muted fw-normal fs-6">(Optional)</span>
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control-traditional w-100"
                                    value={nitiForm.description}
                                    onChange={handleChange}
                                    placeholder="Briefly describe this ritual's significance or instructions..."
                                    rows={3}
                                    maxLength={500}
                                    style={{ resize: 'vertical', minHeight: '90px' }}
                                />
                                <small className="text-muted ps-1">{nitiForm.description.length}/500 characters</small>
                            </div>

                            {/* Status */}
                            <div className="mb-4">
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

                            {/* Start + End Time */}
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="form-label text-charcoal fw-bold ps-1 d-flex align-items-center gap-2">
                                        <Clock size={15} className="text-saffron" /> Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        className="form-control-traditional w-100"
                                        value={nitiForm.startTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-charcoal fw-bold ps-1 d-flex align-items-center gap-2">
                                        <Clock size={15} className="text-muted" /> End Time <span className="text-muted fw-normal fs-6">(Optional)</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        className="form-control-traditional w-100"
                                        value={nitiForm.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Next Niti Time — NEW FIELD */}
                            <div className="mb-4">
                                <label className="form-label text-charcoal fw-bold ps-1 d-flex align-items-center gap-2">
                                    <Clock size={15} className="text-saffron" /> Next Ritual Time <span className="text-muted fw-normal fs-6">(Optional — for countdown)</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="nextNitiTime"
                                    className="form-control-traditional w-100"
                                    value={nitiForm.nextNitiTime}
                                    onChange={handleChange}
                                />
                                <small className="text-muted ps-1">Set this to show a live countdown to the next ritual on the temple page.</small>
                            </div>

                            {/* Image Upload */}
                            <div className="mb-5">
                                <label className="form-label text-charcoal fw-bold ps-1">Ritual Image <span className="text-muted fw-normal fs-6">(Optional)</span></label>
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
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
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
                                            <p className="small text-muted">JPEG, PNG or WebP (Max 5MB)</p>
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
