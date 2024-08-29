const mongoose = require("mongoose");
const dbState = [
  {
    value: 0,
    label: "disconnected",
  },
  {
    value: 1,
    label: "connected",
  },
  {
    value: 2,
    label: "connecting",
  },
  {
    value: 3,
    label: "disconnecting",
  },
];

const connection = async () => {
  await mongoose.connect(
    "mongodb+srv://Nam:0123456789@cluster0.ayj6j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  const state = Number(mongoose.connection.readyState);
  console.log(dbState.find((f) => f.value == state).label, "to db"); // connected to db
};

module.exports = connection;
