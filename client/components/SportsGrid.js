import React from 'react';
import './SportsTabs';
import basketballImg from './images/basketball.jpeg';
import cricketImg from './images/CRICKET.jpeg';
import footballImg from './images/football.jpeg';
import motorsportImg from './images/motorsport.jpeg';

const sportss = [
    {
        img: cricketImg,
        sport: 'Cricket',
        href: '/sports/cricket'
    },
    {
        img: basketballImg,
        sport: 'Basketball',
        href: '/sports/basketball'
    },
    {
        img: footballImg,
        sport: 'Football',
        href: '/sports/football'
    },
    {
        img: motorsportImg,
        sport: 'Motorsport',
        href: '/sports/motorsport'
    }
];

function SportsGrid() {
    return (
        <section className="Sports-Grid">
            <h2>Category</h2>
            <div className="sport-grid">
                {sportss.map((sports, idx) => (
                    <a href={sports.href} className="sport-card" key={idx}>
                        <img src={sports.img} alt={sports.sport} className="sports-img" />
                        <div className="sports-info">
                            <span className="sports-sport">{sports.sport}</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default SportsGrid;