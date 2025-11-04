import {Router} from 'express';

const postsRouter = Router();

let posts = [
  {id: 1, title: "post1", content: "hello world"},
  {id: 2, title: "post2", content: "Goobye cruel world"}
];

postsRouter.get('/posts', (req, res, next) => {
  try {
    if (!posts) {
      const error = new Error('Posts data not available');
      error.status = 500;
      throw(error)
    }

    if (posts.length === 0) {
      const error = new Error('No posts found');
      error.status = 400;
      throw error
    }

    res.json(posts);
  } catch (error) {
    next(error)
  }
});

export default postsRouter;