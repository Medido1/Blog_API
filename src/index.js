import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('hello world')
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`server running on port ${PORT}`)
});