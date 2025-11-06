import prisma from '../prismaClient.js';


export const getPosts = async (req, res, next) => {
  let posts = [];
  try {
    posts = await prisma.post.findMany();

    if (posts.length === 0) {
      const error = new Error('No posts found');
      error.status = 404;
      throw error
    }

    res.json(posts);
  } catch (error) {
    next(error)
  }
};

export const getPostById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const targetPost = await prisma.post.findUnique({
    where: {id}
  })
  if (!targetPost) {
    const error = new Error(`There is no post with the id: ${id}`);
    error.status = 404;
    return next(error); // pass to global error handler
  }
  return res.status(200).json(targetPost)
};

export const submitPost = async (req, res, next) => {
  try {
    const {title, content} = req.body;
    const newPost = await prisma.post.create({
     data: {
      title,
      content,
      userId : 1 //to be changed
     }
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error)
  }
};

export const updatePost = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const {title, content} = req.body;

  try {
    const targetPost = await prisma.post.findUnique({
      where: {id}
    });
  
    if (!targetPost) {
      const error  = new Error(`a post with the id of ${id} not found`);
      error.status = 404;
      return next(error);
    };
  
    const updatedPost = await prisma.post.update({
      where: {id},
      data: {
        title,
        content
      }
    });
  
    res.status(202).json(updatedPost);
  } catch (error) {
    next(error)
  }
};

export const deletePost = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const targetPost = await prisma.post.findUnique({
      where: {id}
    });

    if (!targetPost) {
      const error  = new Error(`a post with the id of ${id} not found`);
      error.status = 404;
      throw error;
    };
    
    const deleted = await prisma.post.delete({
      where: {id}
    });
    res.status(200).json({
      message: `Post ${id} deleted successfully`,
      deletedPost: deleted
    });
  } catch (error) {
    next(error)
  }
};