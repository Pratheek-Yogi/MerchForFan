import React from 'react';
import { Link } from 'react-router-dom';
import './PopularAthletes.css';
import { popularAthletes } from './imageUtils';

function PopularAthletes() {
    return (
        <section className="popular-athletes">
            <h2>Popular Athletes</h2>
            <div className="athlete-grid">
                {popularAthletes.map((athlete) => (
                    <Link to={`/athlete/${athlete.name.toLowerCase().replace(' ', '-')}`} key={athlete.id} className="athlete-card">
                        <img src={athlete.image} alt={athlete.name} className="athlete-img" />
                        <div className="athlete-info">
                            <span className="athlete-name">{athlete.name}</span>
                            <span className="athlete-sport">{athlete.description}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default PopularAthletes;
