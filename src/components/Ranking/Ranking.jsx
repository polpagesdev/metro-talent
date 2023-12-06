import React, { useEffect, useState } from 'react';

import './Ranking.css';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';

const Rankings = () => {
    const [entertainers, setEntertainers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDocs(query(collection(db, 'votes'), orderBy('stationID')));
            const votes = data.docs.map(doc => doc.data());

            // Count votes for each entertainer
            const voteCounts = votes.reduce((acc, vote) => {
                const { entertainerID } = vote;
                acc[entertainerID] = (acc[entertainerID] || 0) + 1;
                return acc;
            }, {});

            // Convert to array and sort by vote count
            const sortedEntertainers = Object.entries(voteCounts).map(([id, count]) => ({
                entertainerID: id,
                voteCount: count
            })).sort((a, b) => b.voteCount - a.voteCount);

            setEntertainers(sortedEntertainers);
        };

        fetchData();
    }, []);

    return (
        <div className="rankings-container">
            <h1 className="rankings-title">Entertainer's Ranking</h1>
            <ul className="rankings-list">
                {entertainers.map((entertainer, index) => (
                    <li key={entertainer.entertainerID}>
                        {entertainer.entertainerID} - Votes: {entertainer.voteCount}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Rankings;
