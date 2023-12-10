import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../firebase-config';

import logo from '../../logo.png';

import Ranking from '../Ranking/Ranking';
import VotesPerEntertainerBarChart from '../VotesPerEntertainerBarChart/VotesPerEntertainerBarChart';
import VotesDistributionPieChart from '../VotesDistributionPieChart/VotesDistributionPieChart';
import TimeSeriesVotesChart from '../TimeSeriesVotesChart/TimeSeriesVotesChart';
import VotesHeatmapChart from '../VotesHeatmapChart/VotesHeatmapChart';
import TopEntertainersTreemap from '../TopEntertainersTreemap/TopEntertainersTreemap';

import './Dashboard.css';

const Dashboard = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [votesData, setVotesData] = useState([]);

    useEffect(() => {
        const fetchVotes = async () => {
            const votesSnapshot = await getDocs(collection(db, 'votes'));
            const votes = votesSnapshot.docs.map(doc => doc.data());
            setVotesData(votes);
        };

        fetchVotes();

        const interval = setInterval(fetchVotes, 300000); // Fetch data every 300 seconds

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    const slides = [
        {
            id: "ranking",
            title: "Entertainer's Ranking",
            content: <Ranking votesData={votesData} />,
            description: "This component displays a list of entertainers ranked by the number of votes they've received. Users can filter the rankings by metro station to see who is the most popular at each location."
        },
        {
            id: "votes-bar-chart",
            title: "Votes Per Entertainer Bar Chart",
            content: <VotesPerEntertainerBarChart votesData={votesData} />,
            description: "This bar chart compares the total number of votes each entertainer has received. It's useful for a quick comparison to see who has the most support among metro passengers."
        },
        {
            id: "votes-distribution-chart",
            title: "Votes Distribution Pie Chart",
            content: <VotesDistributionPieChart votesData={votesData} />,
            description: "This pie chart provides a visual breakdown of the total votes, allowing users to quickly grasp the proportion of votes each entertainer has garnered relative to the others."
        },
        {
            id: "timeseries-votes-chart",
            title: "Time Series Votes Chart",
            content: <TimeSeriesVotesChart votesData={votesData} />,
            description: "This chart presents a time series analysis of votes, showing trends and patterns over a specific period. Users can observe how vote counts for entertainers fluctuate over time."
        },
        {
            id: "votes-heatmap-chart",
            title: "Votes Heatmap Chart",
            content: <VotesHeatmapChart votesData={votesData} />,
            description: "This heatmap displays the density of votes across different times and days, offering insights into peak voting periods and helping to spot patterns in voting behavior."
        },
        {
            id: "top-entertainers-treemap",
            title: "Top Entertainers Treemap",
            content: <TopEntertainersTreemap votesData={votesData} />,
            description: "The treemap visualization illustrates the distribution of votes among the top entertainers. Each entertainer is represented by a colored rectangle, with the size indicating the number of votes received."
        },
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
                <a href="/"><div className="nav-logo">
                    <img src={logo} alt="Metro Logo" /> Metro Talent
                </div></a>
                <div className="nav-items">
                    <a href="/">Home</a>
                    <a href="#mission">Our mission</a>
                    <a href="#about">About us</a>
                    <a href="#contact">Contact</a>
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
                            <p className="section-description">{slide.description}</p>
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
