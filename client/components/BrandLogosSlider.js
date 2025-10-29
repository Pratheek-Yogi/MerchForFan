import React from 'react';
import './BrandLogosSlider.css';

import adidas from './images/BrandLogos/adidas-logo-brandlogos-net-sdsassa.svg';
import bmw from './images/BrandLogos/bmw-m-logo-7622BB3yr5_brandlogos.net.svg';
import formula1 from './images/BrandLogos/Formula_1-OLg9jfKnA_brandlogos.net.svg';
import nba from './images/BrandLogos/nba-logo-brandlogos.net_340asq5n5.svg';
import nike from './images/BrandLogos/nike-logo-brandlogos.net_2m94h35p7.svg';
import puma from './images/BrandLogos/Puma_SE-OxBEf0ABY_brandlogos.net.svg';
import ipl from './images/BrandLogos/tata-ipl-logo-brandlogos.net_ip4y468a5.svg';

const BrandLogosSlider = () => {
    const logos = [adidas, bmw, formula1, nba, nike, puma, ipl];
    // Extend to 9 logos (3 sets of 3) for smooth infinite scroll
    const extendedLogos = [...logos, ...logos, ...logos];

    return (
        <div className="brand-logos-slider-container">
            <h2>Our Partners</h2>
            <div className="brand-logos-slider">
                <div className="slider-wrapper">
                    {extendedLogos.map((logo, index) => (
                        <div className="logo-slide" key={index}>
                            <img src={logo} alt="Brand Logo" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandLogosSlider;