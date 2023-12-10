import React, { useEffect, useRef, useState, useCallback } from 'react';
import './VotesPerEntertainerBarChart.css';
import * as d3 from 'd3';

const VotesPerEntertainerBarChart = ({ votesData }) => {
    const d3Chart = useRef();
    const [processedData, setProcessedData] = useState([]);

    const processVotesData = useCallback(() => {
        // Reduce the votes into a count per entertainer
        const countPerEntertainer = votesData.reduce((acc, vote) => {
            acc[vote.entertainerID] = (acc[vote.entertainerID] || 0) + 1;
            return acc;
        }, {});

        // Convert the object into an array of objects
        const dataArray = Object.keys(countPerEntertainer).map(key => ({
            entertainerID: key,
            votes: countPerEntertainer[key]
        }));

        setProcessedData(dataArray);
    }, [votesData]);

    useEffect(() => {
        processVotesData();
    }, [processVotesData]);

    const drawChart = useCallback(() => {
        const margin = { top: 20, right: 30, bottom: 120, left: 90 };
        const width = 560 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        // Clear any previous svg
        d3.select(d3Chart.current).selectAll("*").remove();

        const svg = d3.select(d3Chart.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(processedData.map(d => d.entertainerID))
            .padding(0.2);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(processedData, d => d.votes)])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(y));

        // Tooltip for the bars
        const tooltip = d3.select('body').append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Bars
        svg.selectAll('myBar')
            .data(processedData)
            .join('rect')
            .attr('x', d => x(d.entertainerID))
            .attr('y', d => y(d.votes))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.votes))
            .attr('fill', '#69b3a2')
            .on('mouseover', (event, d) => {
                tooltip.transition()
                    .duration(100)
                    .style('opacity', 0.9); // Make it more visible
                tooltip.html(d.entertainerID + "<br/>Votes: " + d.votes)
                    .style('left', (event.pageX + 10) + 'px') // Position tooltip correctly
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition()
                    .duration(50)
                    .style('opacity', 0);
            });

        // Rotate the text on the x-axis so it's readable
        svg.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    }, [processedData]);

    useEffect(() => {
        if (processedData.length > 0) {
            drawChart();
        }
    }, [processedData, drawChart]);

    return <div ref={d3Chart} />;
};

export default VotesPerEntertainerBarChart;
