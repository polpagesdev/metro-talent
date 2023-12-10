import React, { useState, useEffect } from 'react';
import './Ranking.css';

const Rankings = ({ votesData }) => {
    const [entertainers, setEntertainers] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [sortAscending, setSortAscending] = useState(false);

    const processVotesData = () => {
        // Filter votes by selected station if any
        const filteredVotes = selectedStation ? votesData.filter(vote => vote.stationID == selectedStation) : votesData;

        // Count votes for each entertainer
        const voteCounts = filteredVotes.reduce((acc, vote) => {
            const { entertainerID } = vote;
            acc[entertainerID] = (acc[entertainerID] || 0) + 1;
            return acc;
        }, {});

        // Convert to array and sort by vote count
        let sortedEntertainers = Object.entries(voteCounts).map(([id, count]) => ({
            entertainerID: id,
            voteCount: count
        }));

        // Sorting
        sortedEntertainers.sort((a, b) => sortAscending ? a.voteCount - b.voteCount : b.voteCount - a.voteCount);

        setEntertainers(sortedEntertainers);
    };

    useEffect(() => {
        if (votesData.length > 0) {
            processVotesData();
        }
    }, [votesData, selectedStation, sortAscending]);

    const handleStationChange = (event) => {
        setSelectedStation(event.target.value);
    };

    const toggleSortOrder = () => {
        setSortAscending(!sortAscending);
    };

    return (
        <div className="rankings-container">
            <div className="filters">
                <select onChange={handleStationChange} value={selectedStation}>
                    <option value="">All Stations</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="L4">L4</option>
                    <option value="L5">L5</option>
                </select>
                <button onClick={toggleSortOrder}>
                    Sort {sortAscending ? 'Descending' : 'Ascending'}
                </button>
            </div>
            <ul className="rankings-list">
                {entertainers.map((entertainer) => (
                    <li key={entertainer.entertainerID}>
                        {entertainer.entertainerID} - Votes: {entertainer.voteCount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rankings;
