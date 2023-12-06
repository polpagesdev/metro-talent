import React, { useEffect, useRef, useState } from 'react';

import './VotesOverTimeLineChart.css';

import * as d3 from 'd3';

import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const VotesOverTimeLineChart = () => {
    const d3Chart = useRef();
    const [votesData, setVotesData] = useState([]);

    useEffect(() => {
        // Fetch votes from Firebase and process them
        const fetchVotes = async () => {
            const votesSnapshot = await getDocs(collection(db, 'votes'));
            const votes = votesSnapshot.docs.map(doc => {
                // Parse the timestamp into a JavaScript Date object
                // Make sure to parse your timestamp correctly according to its format
                const timestamp = new Date(doc.data().timestamp.seconds * 1000);
                return { ...doc.data(), timestamp };
            });

            // Sort the votes by timestamp
            votes.sort((a, b) => a.timestamp - b.timestamp);

            // Group votes by date
            const votesByDate = d3.group(votes, vote => d3.timeDay(vote.timestamp));

            // Map to array for D3
            const dataArray = Array.from(votesByDate, ([date, values]) => ({
                date,
                votes: values.length
            }));

            setVotesData(dataArray);
        };

        fetchVotes();
    });

    useEffect(() => {
        if (votesData.length > 0) {
            // Moved drawChart inside useEffect
            const margin = { top: 20, right: 20, bottom: 30, left: 50 };
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            // Clear any previous svg
            d3.select(d3Chart.current).selectAll("*").remove();

            const svg = d3.select(d3Chart.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // X scale and Axis
            const x = d3.scaleTime()
                .domain(d3.extent(votesData, d => d.date))
                .range([0, width]);

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Y scale and Axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(votesData, d => d.votes)])
                .range([height, 0]);

            svg.append('g')
                .call(d3.axisLeft(y));

            // Line generator
            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.votes));

            // Draw the line
            svg.append('path')
                .datum(votesData)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 1.5)
                .attr('d', line);
        }
    }, [votesData]); // drawChart function is no longer a dependency

    return <div className="d3-chart" ref={d3Chart} />;
};

export default VotesOverTimeLineChart;