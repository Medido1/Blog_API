import {Router} from 'express';
import { validatePost } from '../middleware/validatePost.js';

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
      error.status = 404;
      throw error
    }

    res.json(posts);
  } catch (error) {
    next(error)
  }
});

postsRouter.get('/posts/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error = new Error(`There is no post with the id: ${id}`);
    error.status = 404;
    return next(error); // pass to global error handler
  }

  return res.status(200).json(targetPost)
});

postsRouter.post('/posts',validatePost, (req, res, next) => {
  try {
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      content: req.body.content
    };

    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    next(error)
  }
});

postsRouter.put('/posts/:id', validatePost, (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error  = new Error(`a post with the id of ${id} not found`);
    error.status = 400;
    return next(error);
  };

  targetPost.title = req.body.title;
  targetPost.content = req.body.content;
  res.status(202).json(targetPost);
});

postsRouter.delete('/posts/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = posts.find(post => post.id === id);

  if (!targetPost) {
    const error  = new Error(`a post with the id of ${id} not found`);
    error.status = 400;
    return next(error);
  };

  posts = posts.filter(post => post.id !== id);
  res.status(200).json(posts);
});

export default postsRouter;