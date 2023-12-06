import React from 'react';

import './App.css';

import Ranking from './components/Ranking/Ranking';
import VotesPerEntertainerBarChart from './components/VotesPerEntertainerBarChart/VotesPerEntertainerBarChart';
import VotesOverTimeLineChart from './components/VotesOverTimeLineChart/VotesOverTimeLineChart';

function App() {
  return (
    <div className="App">
      <Ranking />
      <VotesPerEntertainerBarChart />
      <VotesOverTimeLineChart />
    </div>
  );
}

export default App;
