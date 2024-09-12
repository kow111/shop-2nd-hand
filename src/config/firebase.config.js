const admin = require("firebase-admin");
const serviceAccount = require("../../shop-2nd-hand-firebase-adminsdk-rtb40-201428c818.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://shop-2nd-hand.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
