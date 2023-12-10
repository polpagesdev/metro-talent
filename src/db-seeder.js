const admin = require('firebase-admin');

const serviceAccount = require('./metro-talent-firebase-adminsdk-ptldc-bcfcf0480a.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper function to generate a random timestamp within the last 30 days
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate a random vote
const randomVote = () => {
  const votes = ['a', 'b', 'c', 'd'];
  return votes[Math.floor(Math.random() * votes.length)];
};

// Mapping names to station IDs
const nameToStationMap = {
  'Emily Miller': 'L1',
  'David Davis': 'L1',
  'Sarah Rodriguez': 'L1',
  'Kevin Martinez': 'L1',
  'Rachel Hernandez': 'L2',
  'James Lopez': 'L2',
  'Laura Gonzalez': 'L2',
  'Chris Wilson': 'L2',
  'Megan Anderson': 'L3',
  'Mark Thomas': 'L3',
  'Olivia Taylor': 'L3',
  'Jason Moore': 'L3',
  'Chloe Jackson': 'L4',
  'Aaron Martin': 'L4',
  'Sophia Lee': 'L4',
  'Ethan Perez': 'L4',
  'Grace Thompson': 'L5',
  'Kyle White': 'L5',
  'Emma Harris': 'L5',
  'Ryan Sanchez': 'L5'
};

// Helper function to get a random name and its corresponding station ID
const randomNameAndStation = () => {
  const names = Object.keys(nameToStationMap);
  const randomName = names[Math.floor(Math.random() * names.length)];
  return {
    name: randomName,
    stationID: nameToStationMap[randomName]
  };
};

// Seeder function to populate the database
const seedDatabase = async (numberOfVotes) => {
  const batch = db.batch();

  for (let i = 0; i < numberOfVotes; i++) {
    const { name, stationID } = randomNameAndStation();
    const voteRef = db.collection('votes').doc();
    const newVote = {
      entertainerID: name,
      stationID: stationID,
      timestamp: randomDate(new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)), new Date()),
      vote: randomVote()
    };
    batch.set(voteRef, newVote);
  }

  await batch.commit();
  console.log(`${numberOfVotes} votes seeded to the database.`);
};

// Call the seeder function with the desired number of mock votes
seedDatabase(100); // This will create 100 mock votes
