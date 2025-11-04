import express from 'express';
import postsRouter from './routes/postsRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  })
});

app.use('/', postsRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.log(error)
  }
  console.log(`server running on port ${PORT}`)
});