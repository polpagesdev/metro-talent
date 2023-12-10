import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './TimeSeriesVotesChart.css'; // Make sure to create the corresponding CSS file

const TimeSeriesVotesChart = ({ votesData }) => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30))); // Default to the last 30 days
    const [endDate, setEndDate] = useState(new Date());
    const [filteredData, setFilteredData] = useState([]);
    const chartRef = useRef();

    // Process the votes data to aggregate votes by date
    const processVotesData = () => {
        // Convert Firestore timestamps to Dates and filter by date range
        const dataInRange = votesData
            .map(vote => ({
                ...vote,
                date: vote.timestamp.toDate()
            }))
            .filter(vote => vote.date >= startDate && vote.date <= endDate);

        // Aggregate votes by date
        const votesByDate = d3.group(dataInRange, d => d3.timeDay.floor(d.date));
        const aggregatedData = Array.from(votesByDate, ([date, votes]) => ({
            date,
            voteCount: votes.length
        }));

        // Sort by date
        aggregatedData.sort((a, b) => a.date - b.date);

        setFilteredData(aggregatedData);
    };

    // Draw the line chart with D3
    const drawChart = () => {
        if (filteredData.length === 0) {
            return;
        }

        const margin = { top: 20, right: 20, bottom: 70, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Clear any existing SVG
        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set the ranges for the scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(filteredData, d => d.date))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.voteCount)])
            .range([height, 0]);

        // Define the line
        const voteLine = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.voteCount));

        // Add the X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // Add the Y Axis
        svg.append('g')
            .call(d3.axisLeft(yScale));

        // Add the path using the line function
        svg.append('path')
            .data([filteredData])
            .attr('class', 'line') // Class to style the line via CSS
            .attr('d', voteLine);

        // Add the scatterplot points
        svg.selectAll('dot')
            .data(filteredData)
            .enter().append('circle')
            .attr('r', 5)
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.voteCount))
            .attr('class', 'dot'); // Class to style the dots via CSS
    };

    // Update the chart when filteredData changes
    useEffect(drawChart, [filteredData]);

    // Re-process the data when votesData or date range changes
    useEffect(processVotesData, [votesData, startDate, endDate]);

    return (
        <div>
            <label htmlFor="start-date">Start Date</label>
            <input
                type="date"
                id="start-date"
                value={startDate.toISOString().split('T')[0]}
                onChange={e => setStartDate(new Date(e.target.value))}
            />
            <label htmlFor="end-date">End Date</label>
            <input
                type="date"
                id="end-date"
                value={endDate.toISOString().split('T')[0]}
                onChange={e => setEndDate(new Date(e.target.value))}
            />
            <div ref={chartRef} />
        </div>
    );
};

export default TimeSeriesVotesChart;
