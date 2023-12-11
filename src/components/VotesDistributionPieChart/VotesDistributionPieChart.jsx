import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './VotesDistributionPieChart.css';

const VotesDistributionPieChart = ({ votesData }) => {
    const d3Chart = useRef();
    const [stationVotes, setStationVotes] = useState([]);

    useEffect(() => {
        // Group votes by station and then by entertainers
        const votesByStation = votesData.reduce((acc, vote) => {
            if (!acc[vote.stationID]) {
                acc[vote.stationID] = {};
            }
            if (!acc[vote.stationID][vote.entertainerID]) {
                acc[vote.stationID][vote.entertainerID] = 0;
            }
            acc[vote.stationID][vote.entertainerID]++;
            return acc;
        }, {});

        // Convert the nested object into an array suitable for D3
        const processedData = Object.entries(votesByStation).map(([station, entertainers]) => ({
            stationID: station,
            votesCount: Object.values(entertainers).reduce((sum, current) => sum + current, 0),
            details: entertainers // Keep the entertainers and their votes for the tooltip
        }));

        setStationVotes(processedData);
    }, [votesData]);

    useEffect(() => {
        if (stationVotes.length > 0) {
            drawChart();
        }
    }, [stationVotes]);

    function getContrastYIQ(rgb) {
        const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
        return yiq >= 128 ? 'black' : 'white';
    }

    const drawChart = () => {
        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        // Clear previous SVG
        d3.select(d3Chart.current).selectAll("*").remove();

        const svg = d3.select(d3Chart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height + 100)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${(height / 2) + 20})`);

        // Set up a color scale with random colors
        const color = d3.scaleOrdinal()
            .domain(stationVotes.map(d => d.stationID))
            .range(stationVotes.map(() => d3.rgb(d3.randomUniform(0, 255)(), d3.randomUniform(0, 255)(), d3.randomUniform(0, 255)())));

        // Generate the pie
        const pie = d3.pie()
            .value(d => d.votesCount);

        // Generate the arcs
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Define the div for the tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Function to determine text color based on the background color
        const getContrastYIQ = (rgb) => {
            const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
            return yiq >= 128 ? 'black' : 'white';
        };

        // Draw the pie
        svg.selectAll('slice')
            .data(pie(stationVotes))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.stationID))
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .on("mouseover", (event, d) => {
                // Tooltip logic...
            })
            .on('mouseout', () => {
                // Tooltip logic...
            });

        // Add titles to pie sections
        svg.selectAll('text')
            .data(pie(stationVotes))
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .style('fill', d => getContrastYIQ(d3.rgb(color(d.data.stationID))))
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .selectAll('tspan')
            .data(d => [
                { text: d.data.stationID, x: 0, dy: '-0.7em' },
                { text: `Votes: ${d.data.votesCount}`, x: 0, dy: '1em' }
            ])
            .enter()
            .append('tspan')
            .attr('x', d => d.x)
            .attr('dy', d => d.dy)
            .text(d => d.text);
    };

    return (
        <div ref={d3Chart} />
    );
};

export default VotesDistributionPieChart;
