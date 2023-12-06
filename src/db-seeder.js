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

// Seeder function to populate the database
const seedDatabase = async (numberOfVotes) => {
  const batch = db.batch();

  for (let i = 0; i < numberOfVotes; i++) {
    const voteRef = db.collection('votes').doc();
    const newVote = {
      entertainerID: `entertainer${Math.ceil(Math.random() * 4)}`, // Assuming we have 4 entertainers per station
      stationID: `station${Math.ceil(Math.random() * 10)}`, // Assuming we have 10 stations
      timestamp: randomDate(new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)), new Date()),
      vote: randomVote()
    };
    batch.set(voteRef, newVote);
  }

  await batch.commit();
  console.log(`${numberOfVotes} votes seeded to the database.`);
};

// Call the seeder function with the desired number of mock votes
seedDatabase(500); // This will create 1000 mock votes
