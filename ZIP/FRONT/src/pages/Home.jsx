import { useEffect, useState } from "react";
import axiosClient from "../../apiClient";
import TempleCard from "../components/TempleCard";
import { Search } from "lucide-react";
// We'll replace the local import with a devotional Unsplash URL directly in style, or just keep import if needed.
// Actually, using a high quality devotional image is better.
// 
function Home() {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getTemples() {
        try {
            setLoading(true);
            const res = await axiosClient.get("/temples");
            setTemples(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch temples");
            setTemples([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTemples();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/temples/${id}`);
            setTemples(temples.filter(t => t._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete temple");
        }
    };

    return (
        <div className="w-100 animate-fade-in">
            {/* Hero Section */}
            <div className="container mt-4 mb-5 px-3">
                <div className="position-relative overflow-hidden rounded shadow-lg animate-fade-in" 
                     style={{ minHeight: '550px', borderRadius: '4px', border: 'var(--border-ornate)' }}>
                    
                    {/* Background Video */}
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ objectFit: 'cover', zIndex: -1 }}
                    >
                        <source src="/WhatsApp Video 2026-04-29 at 6.51.36 PM.mp4" type="video/mp4" />
                    </video>

                    {/* Content Overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center p-5"
                         style={{ background: 'linear-gradient(rgba(42, 33, 24, 0.6), rgba(42, 33, 24, 0.7))' }}>
                        
                        <span className="badge text-dark mb-4 px-4 py-2 fs-6" style={{ background: 'var(--color-gold-light)', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>
                            DIVINE BLESSINGS & HERITAGE
                        </span>
                        <h1 className="display-3 mb-4 text-white" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                            Discover Sacred <span className="text-gold">Temples</span>
                        </h1>
                        <p className="lead mb-5 text-light w-75 mx-auto" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontSize: '1.25rem', fontFamily: 'var(--font-body)' }}>
                            Immerse yourself in India's spiritual core. Discover sacred shrines, coordinate with authentic daily Niti rituals, and experience the grace of ancient darshan from anywhere.
                        </p>
                        <div className="input-group input-group-lg w-50 mx-auto d-none d-md-flex" style={{ borderRadius: '2px', overflow: 'hidden', border: '2px solid var(--color-gold-dark)' }}>
                            <span className="input-group-text border-0 ps-4" style={{ backgroundColor: 'var(--color-parchment)' }}><Search size={22} className="text-saffron" /></span>
                            <input type="text" className="form-control border-0 shadow-none py-3" placeholder="Search by city or temple name..." style={{ fontSize: '1.1rem', backgroundColor: 'var(--color-parchment)', color: 'var(--color-charcoal)' }} />
                            <button className="btn-traditional px-5 fs-5" style={{ borderRadius: '0' }}>Explore</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mb-5">
                <div className="text-center mb-5">
                    <h2 className="display-6 mb-2">Sacred Destinations</h2>
                    <hr className="ornate-divider w-50 mx-auto" />
                    <p className="text-light fs-5">Browse through our curated directory of temples.</p>
                </div>

                {/* Loading */}
                {loading && <div className="text-center py-5 my-5"><div className="spinner-border text-saffron" style={{ width: '3rem', height: '3rem' }} /></div>}

                {/* Error */}
                {error && <div className="alert alert-danger shadow-sm p-4 text-center" style={{ border: 'var(--border-ornate)', backgroundColor: 'var(--color-parchment)' }}>{error}</div>}

                {/* No Data */}
                {!loading && temples.length === 0 && !error && (
                    <div className="text-center p-5 rounded shadow-sm border" style={{ backgroundColor: 'var(--color-parchment)', border: 'var(--border-ornate)' }}>
                        <h4 className="text-charcoal mb-3">No temples found</h4>
                        <p className="text-secondary fs-5">Be the first to list a sacred space!</p>
                    </div>
                )}

                {/* Temple List */}
                <div className="row g-4">
                    {temples.map((temple, idx) => (
                        <div className={`col-lg-4 col-md-6 animate-slide-up delay-${(idx % 4) * 100}`} key={temple._id}>
                            <TempleCard temple={temple} onDelete={() => handleDelete(temple._id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;