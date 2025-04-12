import { createServer, Model, Response } from 'miragejs';

// Create a mock API server
export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      post: Model,
      comment: Model,
    },

    seeds(server) {
      // Seed users
      server.create('user', {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        gender: 'male',
        profilePic: 'https://source.unsplash.com/random/100x100/?portrait',
        bio: 'Software Developer | Coffee Lover',
        followers: [],
        following: [],
        posts: []
      });
    },

    routes() {
      this.namespace = 'api';
      this.urlPrefix = 'http://localhost:5050';  // Add this line to match your API URL

      // Authentication routes
      this.post('/auth/signin', (schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody);
          const user = schema.users.findBy({ email: attrs.email });

          if (!user || user.password !== attrs.password) {
            return new Response(401, {}, { message: 'Invalid credentials' });
          }

          return new Response(200, {}, {
            token: 'mock-jwt-token',
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,
              profilePic: user.profilePic,
              bio: user.bio
            }
          });
        } catch (error) {
          return new Response(400, {}, { message: 'Invalid request format' });
        }
      });

      this.post('/auth/signup', (schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody);
          console.log('Registration request:', attrs);

          // Validate required fields
          const requiredFields = ['firstName', 'lastName', 'email', 'password'];
          for (const field of requiredFields) {
            if (!attrs[field]) {
              return new Response(400, {}, { 
                message: `${field} is required`,
                field: field
              });
            }
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(attrs.email)) {
            return new Response(400, {}, {
              message: 'Invalid email format',
              field: 'email'
            });
          }

          // Check if email already exists
          const existingUser = schema.users.findBy({ email: attrs.email });
          if (existingUser) {
            return new Response(400, {}, {
              message: 'Email already exists',
              field: 'email'
            });
          }

          // Create new user
          const user = schema.users.create({
            ...attrs,
            username: attrs.username || `${attrs.firstName.toLowerCase()}${attrs.lastName.toLowerCase()}`,
            profilePic: attrs.profilePic || 'https://source.unsplash.com/random/100x100/?portrait',
            bio: attrs.bio || '',
            followers: [],
            following: [],
            posts: []
          });

          return new Response(200, {}, {
            token: 'mock-jwt-token',
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,
              profilePic: user.profilePic,
              bio: user.bio
            }
          });
        } catch (error) {
          console.error('Registration error:', error);
          return new Response(400, {}, {
            message: 'Invalid request format',
            error: error.message
          });
        }
      });

      // User routes
      this.get('/users/profile', (schema, request) => {
        const authHeader = request.requestHeaders.Authorization;
        if (!authHeader) {
          return new Response(401, {}, { message: 'Unauthorized' });
        }

        // Mock getting the current user's profile
        const user = schema.users.first();
        return user;
      });

      // Post routes
      this.get('/posts', (schema) => {
        return schema.posts.all();
      });

      this.post('/posts', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.posts.create(attrs);
      });

      this.get('/posts/:id', (schema, request) => {
        const id = request.params.id;
        return schema.posts.find(id);
      });

      this.put('/posts/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.posts.find(id).update(attrs);
      });

      this.delete('/posts/:id', (schema, request) => {
        const id = request.params.id;
        return schema.posts.find(id).destroy();
      });

      // Like routes
      this.post('/posts/:id/like', (schema, request) => {
        const post = schema.posts.find(request.params.id);
        const likes = post.likes || [];
        const userId = 1; // Mock user ID
        
        if (likes.includes(userId)) {
          post.update({ likes: likes.filter(id => id !== userId) });
        } else {
          post.update({ likes: [...likes, userId] });
        }
        
        return post;
      });

      // Comment routes
      this.post('/posts/:id/comments', (schema, request) => {
        const post = schema.posts.find(request.params.id);
        const comment = JSON.parse(request.requestBody);
        const comments = post.comments || [];
        
        post.update({
          comments: [...comments, { ...comment, id: comments.length + 1 }]
        });
        
        return post;
      });

      // Pass through any unhandled requests
      this.passthrough();
    },
  });

  return server;
} 