import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './TopEntertainersTreemap.css'; // Make sure to create the corresponding CSS file

const TopEntertainersTreemap = ({ votesData }) => {
    const [topEntertainers, setTopEntertainers] = useState([]);
    const chartRef = useRef();

    // Process votes data to get the top entertainers with their vote counts and station IDs
    const getTopEntertainers = () => {
        const voteCounts = votesData.reduce((acc, { entertainerID, stationID }) => {
            const key = entertainerID + '-' + stationID;
            if (!acc[key]) {
                acc[key] = { name: entertainerID, stationID: stationID, value: 0 };
            }
            acc[key].value += 1;
            return acc;
        }, {});

        const sortedEntertainers = Object.entries(voteCounts)
            .map(([_, data]) => data)
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Get top 10

        setTopEntertainers({ children: sortedEntertainers });
    };

    // Draw the treemap with D3
    const drawChart = () => {
        if (topEntertainers.length === 0) {
            return;
        }

        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = 850 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const color = d3.scaleOrdinal(d3.schemeCategory10); // Define a color scale

        // Clear any existing SVG
        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const root = d3.hierarchy(topEntertainers).sum(d => d.value);
        d3.treemap()
            .size([width, height])
            .paddingInner(3)(root);

        // Draw the rectangles for each node
        const cell = svg.selectAll('g')
            .data(root.leaves())
            .enter().append('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        cell.append('rect')
            .attr('id', d => "rect-" + d.data.name)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('fill', d => color(d.data.name));

        // Clip text to fit within each rectangle
        cell.append('clipPath')
            .attr('id', d => "clip-" + d.data.name)
            .append('use')
            .attr('xlink:href', d => "#rect-" + d.data.name);

        // Add the text to each cell
        cell.append('text')
            .attr('clip-path', d => "url(#clip-" + d.data.name + ")")
            .selectAll('tspan')
            .data(d => [d.data.name, `Votes: ${d.data.value}`, `Station: ${d.data.stationID}`])
            .enter().append('tspan')
            .attr('x', 50) // Small padding from the left edge
            .attr('y', (d, i) => 20 + i * 15) // Offset each line of text
            .text(d => d)
            .attr('fill', 'white')
            .attr('font-size', '0.8em')
            .attr('font-weight', 'bold')
    };

    // Update the treemap when votesData changes
    useEffect(getTopEntertainers, [votesData]);

    // Draw the treemap when topEntertainers changes
    useEffect(drawChart, [topEntertainers]);

    return (
        <>
            <div ref={chartRef} />
        </>
    );
};

export default TopEntertainersTreemap;
