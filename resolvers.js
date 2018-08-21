exports.resolvers = {
  Query: {
    getAllRecipes: async (rooot, args, { Recipe }) => {
      return await Recipe.find();
    }
  },
  Mutation: {
    addRecipe: async (root, { name, description, category, instructions, username}, { Recipe }) => {
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username
      }).save();
      return newRecipe;
    }
  }
};
