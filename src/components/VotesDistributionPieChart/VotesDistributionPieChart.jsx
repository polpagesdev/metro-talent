import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

import './VotesDistributionPieChart.css';

const VotesDistributionPieChart = () => {
    const d3Chart = useRef();
    const [votes, setVotes] = useState([]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        const fetchData = async () => {
            let votesQuery = collection(db, 'votes');
            if (dateRange.start && dateRange.end) {
                votesQuery = query(votesQuery, where("timestamp", ">=", dateRange.start), where("timestamp", "<=", dateRange.end));
            }
            const votesSnapshot = await getDocs(votesQuery);
            const votesData = votesSnapshot.docs.map(doc => doc.data());
            setVotes(votesData);
        };

        fetchData();
    }, [dateRange]);

    useEffect(() => {
        if (votes.length > 0) {
            drawChart(votes);
        }
    }, [votes]);

    const drawChart = (votesData) => {
        // Set the dimensions and margins of the graph
        const width = 450;
        const height = 450;
        const margin = 40;

        // The radius of the pie chart is half the smallest side
        const radius = Math.min(width, height) / 2 - margin;

        // Append the svg object to the div called 'd3Chart'
        const svg = d3.select(d3Chart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Set the color scale
        const color = d3.scaleOrdinal()
            .domain(votesData.map(d => d.vote))
            .range(d3.schemeCategory10);

        // Compute the position of each group on the pie
        const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d.count);

        const data_ready = pie(votesData);

        // Build the pie chart
        svg
            .selectAll('pie-slices')
            .data(data_ready)
            .join('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', d => color(d.data.vote))
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .style('opacity', 0.7);
    };

    const handleDateFilterChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className="filters">
                <input type="date" name="start" value={dateRange.start} onChange={handleDateFilterChange} />
                <input type="date" name="end" value={dateRange.end} onChange={handleDateFilterChange} />
            </div>
            <div ref={d3Chart}></div>
        </>
    );
};

export default VotesDistributionPieChart;
