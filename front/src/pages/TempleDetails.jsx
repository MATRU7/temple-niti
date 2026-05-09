import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../apiClient.js";
import { AuthContext } from "../context/AuthContext";
import { Clock, MapPin, Calendar, Plus, Edit, Trash2, Timer, Info } from "lucide-react";

// ── Countdown Timer Hook ──────────────────────────────────────────────────────
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!targetDate) {
            setTimeLeft(null);
            return;
        }

        const target = new Date(targetDate).getTime();

        const calculate = () => {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft({ expired: true });
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setTimeLeft({
                expired: false,
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
                total: diff
            });
        };

        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

// ── Countdown Display Component ───────────────────────────────────────────────
function NitiCountdown({ niti }) {
    // Priority: use endTime if niti is running, else nextNitiTime
    const now = Date.now();
    const startTime = niti.startTime ? new Date(niti.startTime).getTime() : null;
    const endTime = niti.endTime ? new Date(niti.endTime).getTime() : null;
    const nextNitiTime = niti.nextNitiTime ? new Date(niti.nextNitiTime).getTime() : null;

    // Determine which countdown to show
    let countdownTarget = null;
    let countdownLabel = "";

    if (startTime && now < startTime) {
        countdownTarget = niti.startTime;
        countdownLabel = "Starts in";
    } else if (endTime && now < endTime) {
        countdownTarget = niti.endTime;
        countdownLabel = "Ends in";
    } else if (nextNitiTime && now < nextNitiTime) {
        countdownTarget = niti.nextNitiTime;
        countdownLabel = "Next Niti in";
    }

    const timeLeft = useCountdown(countdownTarget);

    if (!timeLeft) return null;

    if (timeLeft.expired) {
        return (
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3 px-3 py-2 rounded"
                style={{ backgroundColor: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.2)' }}>
                <Timer size={14} className="text-muted" />
                <span className="small text-muted fw-semibold">Completed</span>
            </div>
        );
    }

    const isUrgent = timeLeft.total < 30 * 60 * 1000; // Under 30 minutes

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center mb-3 px-3 py-2 rounded"
            style={{
                backgroundColor: isUrgent ? 'rgba(220,53,69,0.08)' : 'rgba(184,134,11,0.08)',
                border: `1px solid ${isUrgent ? 'rgba(220,53,69,0.25)' : 'rgba(184,134,11,0.25)'}`,
            }}
        >
            <div className="d-flex align-items-center gap-1 mb-1">
                <Timer size={13} className={isUrgent ? "text-danger" : "text-saffron"} />
                <span className="small fw-semibold" style={{ color: isUrgent ? '#dc3545' : 'var(--color-gold-dark)', fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {countdownLabel}
                </span>
            </div>
            <div className="d-flex align-items-center gap-1">
                {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                    <span key={i} className="d-flex align-items-center gap-1">
                        <span
                            className="fw-bold"
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '1.25rem',
                                color: isUrgent ? '#dc3545' : 'var(--color-charcoal, #2c2c2c)',
                                minWidth: '2ch',
                                display: 'inline-block',
                                textAlign: 'center'
                            }}
                        >
                            {unit}
                        </span>
                        {i < 2 && <span style={{ color: 'var(--color-gold-dark)', fontWeight: 700, fontSize: '1.1rem' }}>:</span>}
                    </span>
                ))}
            </div>
            <div className="d-flex gap-3 mt-1" style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '0.05em' }}>
                <span>HH</span><span>MM</span><span>SS</span>
            </div>
        </div>
    );
}

// ── Main TempleDetails Component ──────────────────────────────────────────────
export default function TempleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [temple, setTemple] = useState(null);
    const [nitis, setNitis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Use the new single-temple endpoint for efficiency
            const [templeRes, nitiRes] = await Promise.all([
                axiosClient.get(`/temples/${id}`),
                axiosClient.get(`/nitti/temple/${id}`)
            ]);

            // Handle both { temple: {...} } and flat response formats
            const templeData = templeRes.data?.temple || templeRes.data;
            if (!templeData) {
                setError("Temple not found");
                return;
            }
            setTemple(templeData);

            // Handle both { nitis: [...] } and flat array response formats
            const nitisArr = nitiRes.data?.nitis ?? (Array.isArray(nitiRes.data) ? nitiRes.data : []);
            setNitis(nitisArr);
        } catch (err) {
            console.error("fetchDetails error:", err);
            // Fallback: try old endpoint format
            try {
                const res = await axiosClient.get("/temples");
                const temples = res.data?.temples || res.data;
                const found = Array.isArray(temples) ? temples.find(t => t._id.toString() === id.toString()) : null;
                if (!found) {
                    setError("Temple not found");
                    return;
                }
                setTemple(found);
                const nitiRes = await axiosClient.get(`/nitti/temple/${id}`);
                const nitisArr = nitiRes.data?.nitis ?? (Array.isArray(nitiRes.data) ? nitiRes.data : []);
                setNitis(nitisArr);
            } catch {
                setError("Error loading details. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchDetails();
    }, [id, fetchDetails]);

    const handleTempleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this temple? This will also remove all its rituals.")) return;
        try {
            await axiosClient.delete(`/temples/${id}`);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete temple");
        }
    };

    const handleNitiDelete = async (nitiId) => {
        if (!window.confirm("Are you sure you want to delete this ritual?")) return;
        try {
            await axiosClient.delete(`/nitti/${nitiId}`);
            fetchDetails();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete ritual");
        }
    };

    if (loading) return (
        <div className="container mt-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
                <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} />
                <p className="text-muted fs-5">Loading temple details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger p-4 text-center">
                <h5 className="fw-bold">{error}</h5>
                <button className="btn-traditional mt-3" onClick={fetchDetails}>Try Again</button>
            </div>
        </div>
    );

    if (!temple) return null;

    const templeOwnerId = temple.user?._id ? temple.user._id.toString() : temple.user?.toString();
    const userId = user?._id?.toString();
    const isAdmin = user && templeOwnerId && userId && templeOwnerId === userId;

    return (
        <div className="container mt-4 mb-5 animate-fade-in">
            {/* Hero Section */}
            <div className="devotional-card mb-5 overflow-hidden">
                <div className="row g-0">
                    <div className="col-md-5 position-relative p-0 m-0 border-end" style={{ borderColor: 'var(--color-gold-dark)' }}>
                        <img
                            src={temple.templeImage}
                            alt={temple.name}
                            className="w-100"
                            style={{ objectFit: 'cover', height: '100%', minHeight: '350px', maxHeight: '450px', display: 'block' }}
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.15 }}></div>
                    </div>
                    <div className="col-md-7 d-flex flex-column justify-content-center" style={{ backgroundColor: 'var(--color-parchment)' }}>
                        <div className="card-body p-5 text-center">
                            <div className="mb-4 d-flex justify-content-center">
                                <span className={`badge px-4 py-2 fs-6 ${temple.status === 'open' ? 'badge-devotional-success' : 'badge-devotional-danger'}`}>
                                    {temple.status?.toUpperCase()}
                                </span>
                            </div>

                            <h1 className="display-4 fw-bolder mb-3 text-charcoal" style={{ fontFamily: 'var(--font-heading)' }}>
                                {temple.name}
                            </h1>

                            <p className="text-saffron fs-5 d-flex justify-content-center align-items-center gap-2 fw-bold">
                                <MapPin size={22} /> {temple.location}, {temple.city}, {temple.state}
                            </p>

                            <hr className="ornate-divider w-75 mx-auto" />

                            <p className="fs-5 text-secondary px-md-4" style={{ lineHeight: '1.8', fontFamily: 'var(--font-body)' }}>
                                {temple.description}
                            </p>

                            <div className="d-inline-flex align-items-center gap-3 mt-4 px-4 py-2" style={{ border: 'var(--border-ornate)', backgroundColor: 'var(--color-sand)', borderRadius: '2px' }}>
                                <Clock className="text-saffron" size={24} />
                                <span className="fs-5 fw-bold text-charcoal">Darshan:</span>
                                <span className="fs-5 text-muted">{temple.startTime} – {temple.endTime}</span>
                            </div>

                            {isAdmin && (
                                <div className="d-flex justify-content-center gap-3 mt-5">
                                    <button
                                        className="btn-traditional d-flex align-items-center gap-2"
                                        onClick={() => navigate(`/edit-temple/${id}`)}
                                    >
                                        <Edit size={18} /> Edit Details
                                    </button>
                                    <button
                                        className="btn-traditional-outline d-flex align-items-center gap-2 border-danger text-danger"
                                        onClick={handleTempleDelete}
                                    >
                                        <Trash2 size={18} /> Delete Temple
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Niti Schedule */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--color-gold-dark)' }}>
                <h2 className="fw-bold display-6 mb-0 text-charcoal">Niti &amp; Rituals Schedule</h2>
                {user && (
                    <button className="btn-traditional d-flex align-items-center gap-2" onClick={() => navigate(`/add-niti/${id}`)}>
                        <Plus size={20} /> Add New Ritual
                    </button>
                )}
            </div>

            <div className="row g-4">
                {nitis.length === 0 ? (
                    <div className="col-12 text-center text-muted p-5 rounded" style={{ border: '2px dashed var(--color-gold-dark)', backgroundColor: 'var(--color-sand)' }}>
                        <Calendar size={48} className="opacity-25 mb-3" />
                        <h4 className="fw-bold text-charcoal mb-2">No rituals scheduled yet</h4>
                        <p className="fs-5 mb-0">
                            {user ? (
                                <>Be the first to <span className="text-saffron fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate(`/add-niti/${id}`)}>add a ritual</span>.</>
                            ) : "Check back later or contact administration."}
                        </p>
                    </div>
                ) : (
                    nitis.map((niti, idx) => {
                        const nitiUploaderId = niti.updatedBy?._id
                            ? niti.updatedBy._id.toString()
                            : niti.updatedBy?.toString();
                        const canModify = isAdmin || (user && userId && nitiUploaderId && nitiUploaderId === userId);

                        return (
                            <div className={`col-lg-4 col-md-6 animate-slide-up delay-${(idx % 4) * 100}`} key={niti._id}>
                                <div className="devotional-card h-100 overflow-hidden d-flex flex-column text-center">
                                    {/* Niti Image */}
                                    {niti.nitiImage ? (
                                        <img
                                            src={niti.nitiImage}
                                            alt={niti.currentNiti}
                                            className="w-100 border-bottom"
                                            style={{ height: '180px', objectFit: 'cover', borderColor: 'var(--color-gold-dark)' }}
                                        />
                                    ) : (
                                        <div className="w-100 d-flex align-items-center justify-content-center border-bottom" style={{ height: '180px', backgroundColor: 'var(--color-sand)', borderColor: 'var(--color-gold-dark)' }}>
                                            <Calendar size={48} className="text-gold opacity-50" />
                                        </div>
                                    )}

                                    <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
                                        <div>
                                            {/* Status Badge */}
                                            <div className="mb-3 d-flex justify-content-center">
                                                <span className={`badge px-3 py-1 ${niti.status === 'Closed' ? 'badge-devotional-danger' : 'badge-devotional-success'}`}>
                                                    {niti.status}
                                                </span>
                                            </div>

                                            {/* Ritual Name */}
                                            <h4 className="fw-bold text-charcoal mb-2">{niti.currentNiti}</h4>
                                            <hr className="ornate-divider my-2 w-50 mx-auto" style={{ height: '1px' }} />

                                            {/* Next Niti */}
                                            <p className="text-secondary mb-2 fs-6">
                                                <strong>Up Next:</strong> {niti.nextNiti}
                                            </p>

                                            {/* Description — NEW */}
                                            {niti.description && (
                                                <div className="d-flex align-items-start gap-2 mb-2 px-2 py-2 rounded text-start"
                                                    style={{ backgroundColor: 'rgba(184,134,11,0.06)', border: '1px solid rgba(184,134,11,0.15)' }}>
                                                    <Info size={13} className="text-saffron flex-shrink-0 mt-1" />
                                                    <p className="mb-0 small text-secondary" style={{ lineHeight: 1.5 }}>
                                                        {niti.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            {/* ── Live Countdown Timer ── */}
                                            <NitiCountdown niti={niti} />

                                            {/* Start / End Time Display */}
                                            <div className="d-flex justify-content-center align-items-center gap-2 small text-dark fw-bold mb-3">
                                                <Clock size={16} className="text-saffron" />
                                                {new Date(niti.startTime).toLocaleString('en-IN', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                                {niti.endTime && (
                                                    <> – {new Date(niti.endTime).toLocaleString('en-IN', { timeStyle: 'short' })}</>
                                                )}
                                            </div>

                                            {/* Edit / Delete Buttons */}
                                            {canModify && (
                                                <div className="d-flex gap-2 justify-content-center border-top pt-3" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                                                    <button
                                                        className="btn-traditional px-3 py-1 d-flex align-items-center gap-1"
                                                        onClick={() => navigate(`/edit-niti/${id}/${niti._id}`)}
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button
                                                        className="btn-traditional-outline px-3 py-1 d-flex align-items-center gap-1 text-danger border-danger"
                                                        onClick={() => handleNitiDelete(niti._id)}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
