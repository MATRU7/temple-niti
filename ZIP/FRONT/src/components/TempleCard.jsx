import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Clock, MapPin, Trash2, Edit } from "lucide-react";

export default function TempleCard({ temple, onDelete }) {
    const { user } = useContext(AuthContext);
    const isAdmin = user && (!temple.user || temple.user === user._id || (temple.user._id && temple.user._id === user._id));

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(window.confirm("Are you sure you want to delete this temple?")) {
            onDelete();
        }
    };

    const isOpen = temple.status.toLowerCase() === 'open';

    return (
        <div className="devotional-card h-100 d-flex flex-column animate-fade-up">
            <Link to={`/temple/${temple._id}`} className="text-decoration-none text-charcoal h-100 d-flex flex-column">
                <div className="img-zoom-wrapper border-bottom border-warning position-relative" style={{ borderBottom: '2px solid var(--color-gold-dark) !important' }}>
                    <img 
                        src={temple.templeImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80'} 
                        alt={temple.name} 
                        className="w-100" 
                        style={{ height: '220px', objectFit: 'cover' }} 
                    />
                    <div className="position-absolute top-0 end-0 p-3 d-flex gap-2 z-1">
                        {isAdmin && (
                            <div className="d-flex gap-2">
                                <Link 
                                    to={`/edit-temple/${temple._id}`} 
                                    className="btn btn-sm btn-light p-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center text-primary" 
                                    style={{ width: '36px', height: '36px' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Edit size={16}/>
                                </Link>
                                <button 
                                    className="btn btn-sm btn-light p-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center text-danger" 
                                    onClick={handleDeleteClick} 
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="card-body p-4 d-flex flex-column flex-grow-1 text-center">
                    <div className="mb-3 d-flex justify-content-center">
                        <span className={`badge px-3 py-1 ${isOpen ? 'badge-devotional-success' : 'badge-devotional-danger'}`}>
                            {temple.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <h3 className="fw-bold mb-2 text-charcoal text-truncate">{temple.name}</h3>
                    
                    <div className="d-flex justify-content-center align-items-center gap-2 text-muted mb-3 text-truncate">
                        <MapPin size={16} className="text-saffron" />
                        <span className="fs-6">{temple.location}, {temple.city}</span>
                    </div>
                    
                    <hr className="ornate-divider my-3 w-75 mx-auto" style={{ height: '1px' }} />
                    
                    <p className="card-text text-secondary line-clamp-3 mb-4 flex-grow-1" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {temple.description || "A sacred sanctuary for devotion and peace."}
                    </p>
                    
                    <div className="mt-auto pt-3 border-top" style={{ borderColor: 'rgba(184, 134, 11, 0.2) !important' }}>
                        <div className="d-flex justify-content-center align-items-center px-2">
                            <div className="d-flex align-items-center gap-2 text-dark fw-bold">
                                <Clock size={18} className="text-saffron" />
                                <span>{temple.startTime} - {temple.endTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}