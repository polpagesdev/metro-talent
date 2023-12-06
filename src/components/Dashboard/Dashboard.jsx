import React, { useState } from 'react';

import logo from '../../logo.png';

import Ranking from '../Ranking/Ranking';
import VotesPerEntertainerBarChart from '../VotesPerEntertainerBarChart/VotesPerEntertainerBarChart';
import VotesOverTimeLineChart from '../VotesOverTimeLineChart/VotesOverTimeLineChart';
import VotesDistributionPieChart from '../VotesDistributionPieChart/VotesDistributionPieChart';
import VotesTimeScatterPlot from '../VotesTimeScatterPlot/VotesTimeScatterPlot';

import './Dashboard.css';

const Dashboard = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        { id: "ranking", title: "Entertainer's Ranking", content: <Ranking /> },
        { id: "votes-bar-chart", title: "Votes Per Entertainer Bar Chart", content: <VotesPerEntertainerBarChart /> },
        { id: "votes-time-chart", title: "Votes Over Time Line Chart", content: <VotesOverTimeLineChart /> },
        { id: "votes-distribution-chart", title: "Votes Distribution Pie Chart", content: <VotesDistributionPieChart /> },
        { id: "votes-time-scatter-plot", title: "Votes Time Scatter Plot", content: <VotesTimeScatterPlot /> },
    ];

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    const nextSlide = () => {
        setActiveSlide((prevActiveSlide) => (prevActiveSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setActiveSlide((prevActiveSlide) => (prevActiveSlide - 1 + slides.length) % slides.length);
    };

    return (
        <div className="dashboard">
            <nav className="dashboard-navbar">
                <div className="nav-logo">
                    <img src={logo} alt="Metro Logo" /> Metro Talent
                </div>
                <div className="nav-items">
                    <a href="#ranking">Ranking</a>
                    <a href="#votes-bar-chart">Votes Bar Chart</a>
                    <a href="#votes-time-chart">Votes Time Chart</a>
                </div>
            </nav>

            <header className="dashboard-header">
                <h1>Welcome to the Metro Talent Dashboard</h1>
                <p>Explore the data about our metro station entertainers and see who's topping the charts!</p>
            </header>

            <div className="slider-container">
                <button className="slide-nav left-nav" onClick={prevSlide}>←</button>
                <div className="slides" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                    {slides.map((slide, index) => (
                        <section key={slide.id} id={slide.id} className="dashboard-section slide">
                            <h2 className="section-title">{slide.title}</h2>
                            <p className="section-description">Description for {slide.title}</p>
                            {slide.content}
                        </section>
                    ))}
                </div>
                <button className="slide-nav right-nav" onClick={nextSlide}>→</button>
                <div className="slider-nav">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => goToSlide(index)} className={activeSlide === index ? 'nav-button active' : 'nav-button'}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
