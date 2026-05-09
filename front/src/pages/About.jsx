import React from 'react';

export default function About() {
    return (
        <div className="container mt-4 mb-5 animate-fade-in">
            <div className="text-center mb-5 pb-4">
                <span className="badge text-dark px-4 py-2 mb-4" style={{ backgroundColor: 'var(--color-gold-light)', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>ABOUT THE INITIATIVE</span>
                <h1 className="fw-bolder display-4 text-charcoal mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Preserving Our Sacred Heritage</h1>
                <hr className="ornate-divider w-50 mx-auto" />
                <p className="lead text-light w-75 mx-auto fs-5" style={{ lineHeight: '1.8' }}>
                    Temple Niti is dedicated to keeping the traditions, rituals, and history of India's spiritual centers alive. 
                    Through digital scheduling and community management, we ensure devotees globally stay connected.
                </p>
            </div>

            <div className="row g-4 mb-5 pb-4">
                <div className="col-lg-6">
                    <div className="devotional-card h-100 overflow-hidden img-zoom-wrapper" style={{ border: 'var(--border-ornate)' }}>
                        <img 
                            src="pexels-sudipto-chakrabarty-2152424918-36613136.jpg" 
                            alt="Lit Diyas" 
                            className="w-100 h-100" 
                            style={{ objectFit: 'cover', minHeight: '400px' }} 
                        />
                        <div className="position-absolute bottom-0 w-100 p-5 z-1" style={{ background: 'linear-gradient(transparent, rgba(42, 33, 24, 0.95) 80%)' }}>
                            <h2 className="text-white fw-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Eternal Devotion</h2>
                            <p className="text-light opacity-75 mb-0 fs-5">Keeping the flame of faith burning bright across generations.</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 d-flex flex-column gap-4">
                    <div className="devotional-card h-50 overflow-hidden img-zoom-wrapper">
                        <div className="row g-0 h-100">
                            <div className="col-6">
                                <img 
                                    src="/pexels-subhrajyoti-paul-447200412-35729427.jpg" 
                                    alt="Temple Top Night" 
                                    className="w-100 h-100" 
                                    style={{ objectFit: 'cover', borderRight: '2px solid var(--color-gold-dark)' }} 
                                />
                            </div>
                            <div className="col-6 d-flex flex-column justify-content-center p-4 p-md-5" style={{ backgroundColor: 'var(--color-parchment)' }}>
                                <h4 className="fw-bold text-charcoal mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Nightly Darshan</h4>
                                <p className="text-secondary mb-0">Illuminated sacred architectures towering into the peaceful night sky.</p>
                            </div>
                        </div>
                    </div>

                    <div className="devotional-card h-50 overflow-hidden img-zoom-wrapper">
                        <div className="row g-0 h-100 flex-row-reverse">
                            <div className="col-6 position-relative overflow-hidden">
                                <video 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover', borderLeft: '2px solid var(--color-gold-dark)' }}
                                >
                                    <source src="/WhatsApp Video 2026-04-29 at 6.51.48 PM.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <div className="col-6 d-flex flex-column justify-content-center p-4 p-md-5 text-end" style={{ backgroundColor: 'var(--color-parchment)' }}>
                                <h4 className="fw-bold text-charcoal mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Sacred Echoes</h4>
                                <p className="text-secondary mb-0">The resonating sound of bells awakening the spirit.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="devotional-card p-5 text-center my-5">
                <div className="position-relative z-1">
                    <h2 className="fw-bold text-charcoal mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Contribute to the Archive</h2>
                    <p className="text-secondary mb-5 w-75 mx-auto fs-5">
                        Help us expand our spiritual directory. Authenticated users can list local shrines, coordinate darshan timings, and ensure daily Nitis are respected globally.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn-traditional px-5 py-3 fs-5">Join the Community</button>
                        <button className="btn-traditional-outline px-5 py-3 fs-5">Contact Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
