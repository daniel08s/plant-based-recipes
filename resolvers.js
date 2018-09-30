const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, { Recipe }) => {
      return await Recipe.find().sort({ createdDate: 'desc' });
    },

    getRecipe: async (root, { _id }, { Recipe }) => {
      return await Recipe.findOne({ _id });
    },

    searchRecipes: async (root, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        const searchResults = await Recipe.find({
           // $or: [
           //   { name: { '$regex': searchTerm, '$options': 'i' }},
           //   { description: { '$regex': searchTerm, '$options': 'i' }},
           //   { instructions: { '$regex': searchTerm, '$options': 'i' }}
           //  ]
           $text: { $search: searchTerm }
        },
        {
          score: { $meta: "textScore" }
        }).sort({
          score: { $meta: "textScore" }
        });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({ likes: 'desc', createdDate: 'desc' });
        return recipes;
      }
    },

    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ username: currentUser.username })
        .populate({
          path: 'favorites',
          model: 'Recipe'
        });
      return user;
    },

    getUser: async (root, args, { User }) => {
      const user = await User.findOne({ username: username })
        .populate({
          path: 'favorites',
          model: 'Recipe'
        });
      return user;
    },

    getAllUsers: async (root, args, { User }) => {
      return await User.find();
    },

    getUserRecipes: async (root, { username }, { Recipe }) => {
      return await Recipe.find({ username }).sort({ createdDate: 'desc' });
    }
  },
  Mutation: {
    addRecipe: async (root, { name, imageUrl, description, category, instructions, username }, { Recipe }) => {
      const newRecipe = await new Recipe({
        name,
        imageUrl,
        description,
        category,
        instructions,
        username
      }).save();
      return newRecipe;
    },

    likeRecipe: async (root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } }
      );
      await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } }
      );
      return recipe;
    },

    unlikeRecipe: async (root, { _id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      );
      await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: _id } }
      );
      return recipe;
    },

    updateUserRecipe: async (root, { _id, name, imageUrl, description, category }, { Recipe }) => {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id },
        { $set: { name, imageUrl,  description, category } },
        { new : true }
      );
      return updatedRecipe;
    },

    deleteUserRecipe: async (root, { _id }, { Recipe }) => {
      return await Recipe.findOneAndRemove({ _id });
    },

    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '1hr') };
    },

    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists!');
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    }
  }
};
