/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

admin.initializeApp();

exports.addHabit = functions.https.onCall(async (data, context) => {
  const cleanedData = getCleanedData(data);
  // Ensure the request is authenticated
  if (!cleanedData.username) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The request does not have valid username.",
    );
  } else if (data.data.username !== "jaketo") {
    console.log("Invalid user: " + data.data.username);
    throw new functions.https.HttpsError(
        "unauthenticated",
        "Not an allowed user.",
    );
  }

  try {
    console.log("Inserting into DB: " + JSON.stringify(cleanedData));
    await admin.firestore().collection("habits").add({
      happiness: cleanedData.happiness,
      drinks: cleanedData.drinks,
      work: cleanedData.work,
      social: cleanedData.social,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true};
  } catch (error) {
    console.error("(FCF) Error inserting habit:", error);
    throw new functions.https.HttpsError("internal",
        "(FCF) Failed to add habit");
  }
});

const getCleanedData = (data) => {
  if (data.data === undefined) {
    // This is just checking becuause of the name
    // the client has for this is data.
    return {
      username: data.username,
      happiness: parseInteger(data.happiness),
      drinks: parseInteger(data.drinks),
      work: parseInteger(data.work),
      social: parseInteger(data.social),
    };
  }
  return {
    username: data.data.username,
    happiness: parseInteger(data.data.happiness),
    drinks: parseInteger(data.data.drinks),
    work: parseInteger(data.data.work),
    social: parseInteger(data.data.social),
  };
};

const parseInteger = (str) => {
  if (!str || str === undefined) {
    return 0;
  }
  return parseInt(str);
};
