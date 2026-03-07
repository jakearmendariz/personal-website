const admin = require("firebase-admin");
const serviceAccount = require("../firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function backfill() {
  const db = admin.firestore();
  const snapshot = await db.collection("habits").get();

  const batch = db.batch();
  let count = 0;

  snapshot.forEach((doc) => {
    const { happiness } = doc.data();
    if (happiness !== undefined) {
      batch.update(doc.ref, { happiness: happiness * 2 });
      count++;
    }
  });

  await batch.commit();
  console.log(`Updated ${count} documents.`);
}

backfill().catch(console.error);
