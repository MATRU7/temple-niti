export default function Footer() {
    return (
        <footer className="bg-dark text-light py-5 mt-auto">
            <div className="container">
                <div className="row g-4 mb-4">
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-warning">
                            Ananda Temples
                        </h5>
                        <p className="text-secondary mb-4 pe-lg-5">
                            Streamlining spiritual journeys through intelligent temple scheduling and ritual (Niti) management across the country.
                        </p>
                        <div className="d-flex gap-3">
                            <span className="text-secondary" style={{cursor: 'pointer'}}>Twitter</span>
                            <span className="text-secondary" style={{cursor: 'pointer'}}>LinkedIn</span>
                            <span className="text-secondary" style={{cursor: 'pointer'}}>GitHub</span>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                        <h6 className="fw-bold mb-3">Product</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
                            <li style={{cursor: 'pointer'}}>Features</li>
                            <li style={{cursor: 'pointer'}}>Integrations</li>
                            <li style={{cursor: 'pointer'}}>Pricing</li>
                            <li style={{cursor: 'pointer'}}>Changelog</li>
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                        <h6 className="fw-bold mb-3">Company</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
                            <li style={{cursor: 'pointer'}}>About Us</li>
                            <li style={{cursor: 'pointer'}}>Careers</li>
                            <li style={{cursor: 'pointer'}}>Privacy Policy</li>
                            <li style={{cursor: 'pointer'}}>Terms of Service</li>
                        </ul>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <h6 className="fw-bold mb-3">Subscribe</h6>
                        <p className="text-secondary small mb-3">Get the latest updates on new features and temple listings directly in your inbox.</p>
                        <div className="d-flex gap-2">
                            <input type="email" className="form-control form-control-sm" placeholder="Email address" />
                            <button className="btn btn-warning btn-sm fw-bold">Subscribe</button>
                        </div>
                    </div>
                </div>
                <hr className="border-secondary" />
                <div className="text-center text-secondary small mt-4">
                    &copy; 2026 Ananda Temples. All rights reserved. Designed for ET LAB.
                </div>
            </div>
        </footer>
    );
}