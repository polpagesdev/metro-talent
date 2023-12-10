import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './VotesHeatmapChart.css'; // Make sure to create the corresponding CSS file

const VotesHeatmapChart = ({ votesData }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [selectedEntertainer, setSelectedEntertainer] = useState('');
    const chartRef = useRef();
    const entertainersList = [...new Set(votesData.map(vote => vote.entertainerID))];

    // This will process the votes data to fit the heatmap format
    const processVotesData = () => {
        // Filter by entertainer if one is selected
        const entertainerFilteredData = selectedEntertainer
            ? votesData.filter(vote => vote.entertainerID === selectedEntertainer)
            : votesData;

        // Map Firestore timestamps to JavaScript Date objects and extract day and hour
        const dataWithDateObjects = entertainerFilteredData.map(vote => ({
            ...vote,
            day: vote.timestamp.toDate().getDay(), // Sunday - Saturday : 0 - 6
            hour: vote.timestamp.toDate().getHours() // 0 - 23
        }));

        // Aggregate votes by day and hour
        const groupedData = d3.groups(dataWithDateObjects, d => d.day, d => d.hour);
        const heatmapData = groupedData.map(([day, hours]) => {
            const hoursMap = hours.map(([hour, votes]) => ({
                day,
                hour,
                votes: votes.length
            }));
            return hoursMap;
        }).flat();

        setFilteredData(heatmapData);
    };

    // Draw the heatmap with D3
    const drawChart = () => {
        if (filteredData.length === 0) {
            return;
        }

        const margin = { top: 50, right: 0, bottom: 100, left: 30 };
        const width = 950 - margin.left - margin.right;
        const height = 900 - margin.top - margin.bottom;
        const gridSize = Math.floor(width / 24);
        const legendElementWidth = gridSize * 2;
        const buckets = 9;
        const colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]; // alternatively colorbrewer.YlGnBu[9]

        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const times = Array.from(Array(24).keys()).map(d => `${d}:00`);

        // Clear any existing SVG
        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const dayLabels = svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(d => d)
            .attr('x', 0)
            .attr('y', (d, i) => i * gridSize)
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

        const timeLabels = svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(d => d)
            .attr('x', (d, i) => i * gridSize)
            .attr('y', 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));

        const colorScale = d3.scaleQuantile()
            .domain([0, buckets - 1, d3.max(filteredData, d => d.votes)])
            .range(colors);

        const cards = svg.selectAll(".hour")
            .data(filteredData, d => d.day + ':' + d.hour);

        cards.enter().append("rect")
            .attr("x", d => (d.hour) * gridSize)
            .attr("y", d => (d.day) * gridSize)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .transition().duration(1000)
            .style("fill", d => colorScale(d.votes));

        cards.select("title").text(d => d.votes);

        cards.exit().remove();
    };

    // Update the chart when filteredData changes
    useEffect(drawChart, [filteredData]);

    // Re-process the data when votesData or entertainer selection changes
    useEffect(processVotesData, [votesData, selectedEntertainer]);

    return (
        <div>
            <label htmlFor="entertainer-select">Choose an entertainer</label>
            <select id="entertainer-select" onChange={e => setSelectedEntertainer(e.target.value)}>
                <option value="">All Entertainers</option>
                {entertainersList.map(entertainer => (
                    <option key={entertainer} value={entertainer}>
                        {entertainer}
                    </option>
                ))}
            </select>
            <div ref={chartRef} />
        </div>
    );
};

export default VotesHeatmapChart;
