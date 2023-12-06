const admin = require('firebase-admin');
const serviceAccount = require('./metro-talent-firebase-adminsdk-ptldc-bcfcf0480a.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const deleteCollection = async (collectionPath, batchSize) => {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve).catch(reject);
  });
};

const deleteQueryBatch = async (db, query, batchSize, resolve) => {
  const snapshot = await query.get();

  if (snapshot.size === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, batchSize, resolve);
  });
};

// Usage: replace 'your-collection' with the name of the collection you want to delete.
deleteCollection('votes', 500).then(() => {
  console.log('All documents in the collection have been deleted');
}).catch((error) => {
  console.error('Error deleting collection', error);
});
