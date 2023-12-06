import React, { useEffect, useRef, useState, useCallback } from 'react';

import './VotesPerEntertainerBarChart.css';

import * as d3 from 'd3';

import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const VotesPerEntertainerBarChart = () => {
    const d3Chart = useRef();
    const [votesData, setVotesData] = useState([]);

    // Define drawChart with useCallback
    const drawChart = useCallback(() => {
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };
        const width = 460 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

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
            .domain(votesData.map(d => d.entertainerID))
            .padding(0.2);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(votesData, d => d.votes)])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll('myBar')
            .data(votesData)
            .join('rect')
            .attr('x', d => x(d.entertainerID))
            .attr('y', d => y(d.votes))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.votes))
            .attr('fill', '#69b3a2');
    }, [votesData]); // Add any dependencies of drawChart here

    useEffect(() => {
        // Fetch votes from Firebase and process them
        const fetchVotes = async () => {
            const votesSnapshot = await getDocs(collection(db, 'votes'));
            const votes = votesSnapshot.docs.map(doc => doc.data());

            // Reduce the votes into a count per entertainer
            const countPerEntertainer = votes.reduce((acc, { entertainerID }) => {
                acc[entertainerID] = (acc[entertainerID] || 0) + 1;
                return acc;
            }, {});

            // Convert the object into an array of objects
            const dataArray = Object.keys(countPerEntertainer).map(key => ({
                entertainerID: key,
                votes: countPerEntertainer[key]
            }));

            setVotesData(dataArray);
        };

        fetchVotes();
    }, []);

    useEffect(() => {
        if (votesData.length > 0) {
            drawChart();
        }
    }, [votesData, drawChart]);

    return <div ref={d3Chart} />;
};

export default VotesPerEntertainerBarChart;
