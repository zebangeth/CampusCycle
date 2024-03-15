import 'dotenv/config';
import express from 'express';
import connectDB from './database';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World from CampusCycle backend!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
