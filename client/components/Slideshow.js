import React, { useState, useEffect } from 'react';
import './Slideshow.css';

import image1 from './images/basketball.jpeg';
import image2 from './images/CRICKET.jpeg';
import image3 from './images/football.jpeg';
import image4 from './images/motorsport.jpeg';

const images = [image1, image2, image3, image4];

const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slideshow-container">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
            ))}
        </div>
    );
};

export default Slideshow;
