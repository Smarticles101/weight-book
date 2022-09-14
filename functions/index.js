const functions = require("firebase-functions");
const Firestore = require("@google-cloud/firestore");

const firestore = new Firestore.Firestore(functions.firebaseConfig);

exports.createExercise = functions.https.onRequest((request, response) => {
  const name = (request.query["exercise"] || request.body.data.exercise)
    .toLowerCase()
    .trim();

  firestore
    .collection("exercises")
    .doc(name)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data) {
          doc.ref.update({
            count: data.count + 1,
          });
        }
        response.send("Exercise already exists");
      } else {
        firestore
          .collection("exercises")
          .doc(name)
          .set({
            count: 1,
            // approved label to filter out exercises that are not approved,
            // I will manually approve them
            approved: false,
          })
          .then(() => {
            response.send("Exercise created");
          })
          .catch(() => {
            response.send("Error creating exercise");
          });
      }
    })
    .catch(() => {
      response.send("Error getting exercise");
    });
});
