import { useState, useEffect } from 'react';

const PriceRangeSlider = ({ onPriceChange }) => {
    const [minPrice, setMinPrice] = useState(2500);
    const [maxPrice, setMaxPrice] = useState(7500);
    const priceGap = 1000;
    const maxValue = 10000;

    const updateProgress = () => {
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            const leftPosition = (minPrice / maxValue) * 100;
            const rightPosition = 100 - (maxPrice / maxValue) * 100;
            progressBar.style.left = `${leftPosition}%`;
            progressBar.style.right = `${rightPosition}%`;
        }
    };

    useEffect(() => {
        updateProgress();
        onPriceChange(`${minPrice}-${maxPrice}`);
    }, [minPrice, maxPrice]);

    const handleMinChange = (value) => {
        const newMin = Math.min(parseInt(value), maxPrice - priceGap);
        if (newMin >= 0) {
            setMinPrice(newMin);
        }
    };

    const handleMaxChange = (value) => {
        const newMax = Math.max(parseInt(value), minPrice + priceGap);
        if (newMax <= maxValue) {
            setMaxPrice(newMax);
        }
    };

    return (
        <div className="price-range-wrapper">
            <div className="price-range-header">
                <h4>Price Range</h4>
                <p>Use slider or enter min and max price</p>
            </div>
            
            <div className="price-input">
                <div className="price-field">
                    <span>Min</span>
                    <input
                        type="number"
                        className="input-min"
                        value={minPrice}
                        onChange={(e) => handleMinChange(e.target.value)}
                    />
                </div>
                <div className="price-field">
                    <span>Max</span>
                    <input
                        type="number"
                        className="input-max"
                        value={maxPrice}
                        onChange={(e) => handleMaxChange(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="slider">
                <div className="progress"></div>
            </div>
            
            <div className="range-input">
                <input
                    type="range"
                    className="range-min"
                    min="0"
                    max={maxValue}
                    value={minPrice}
                    step="100"
                    onChange={(e) => handleMinChange(e.target.value)}
                />
                <input
                    type="range"
                    className="range-max"
                    min="0"
                    max={maxValue}
                    value={maxPrice}
                    step="100"
                    onChange={(e) => handleMaxChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default PriceRangeSlider;