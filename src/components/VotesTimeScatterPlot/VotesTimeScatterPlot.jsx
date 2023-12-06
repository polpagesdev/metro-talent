import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './VotesTimeScatterPlot.css';

const VotesTimeScatterPlot = () => {
    const d3Chart = useRef();
    const [votes, setVotes] = useState([]);
    const [selectedEntertainer, setSelectedEntertainer] = useState('');

    const drawChart = useEffect(() => {
        // Clear any existing svg
        d3.select(d3Chart.current).selectAll("*").remove();
    
        const margin = { top: 20, right: 20, bottom: 30, left: 50 },
              width = 600 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;
    
        // Append the svg object to the div
        const svg = d3.select(d3Chart.current)
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // X axis - representing hours of the day
        const x = d3.scaleLinear()
                    .domain([0, 24])
                    .range([0, width]);
        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));
    
        // Y axis - representing number of votes
        const y = d3.scaleLinear()
                    .domain([0, d3.max(votes, d => d.voteCount)])
                    .range([height, 0]);
        svg.append("g")
           .call(d3.axisLeft(y));
    
        // Add dots
        svg.append('g')
           .selectAll("dot")
           .data(votes)
           .enter()
           .append("circle")
             .attr("cx", d => x(d.hour))
             .attr("cy", d => y(d.voteCount))
             .attr("r", 5)
             .style("fill", "#69b3a2");
    });

    useEffect(() => {
        const fetchData = async () => {
            let votesQuery = collection(db, 'votes');
            if (selectedEntertainer) {
                votesQuery = query(votesQuery, where("entertainerID", "==", selectedEntertainer));
            }
            const votesSnapshot = await getDocs(votesQuery);
            const votesData = votesSnapshot.docs.map(doc => {
                const data = doc.data();
                data.hour = new Date(data.timestamp.seconds * 1000).getHours();
                return data;
            });
            setVotes(votesData);
        };

        fetchData();
    }, [selectedEntertainer]);

    useEffect(() => {
        if (votes.length > 0) {
            drawChart();
        }
    }, [votes, drawChart]);    

    const handleEntertainerChange = (e) => {
        setSelectedEntertainer(e.target.value);
    };

    return (
        <div>
            <div className="filters">
                <select onChange={handleEntertainerChange}>
                    <option value="">Select Entertainer</option>
                    {/* Options for entertainers ('a', 'b', 'c', 'd') */}
                    <option value="a">Entertainer A</option>
                    <option value="b">Entertainer B</option>
                    <option value="c">Entertainer C</option>
                    <option value="d">Entertainer D</option>
                </select>
            </div>
            <div ref={d3Chart}></div>
        </div>
    );
};

export default VotesTimeScatterPlot;
