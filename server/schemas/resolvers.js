const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    //Query type
    Query: {
        me: async (parents, args, context) => {
            if (context.user) {
            const userData = await User.findOne({ _id: context.user.id})
            .select('-__v -password')
            return userData;
        }
        throw new AuthenticationError('You are NOT logged in');
        }
    },

    //Mutation type
    Mutation: {
        //login
        login: async (parent, { username, email, password}) => {
            const user = await User.findOne({ username });
            if(!user) {
                throw new AuthenticationError('Incorrect username');
            }

            const Email = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('Incorrect email');
            }
            
            const correctPw = await User.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }
            const token = signToken(user);
            return { token, user };
        },

        //addUser
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return user;
        },

        //saveBook
        saveBook: async (parent, { input }, { user }) =>{
            if (user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You are NOT logged in");
        },

        //removeBook
        removeBook: async (parent, { bookId }, { user }) => {
            if (user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You are NOT logged in");
        }


    }
};

module.exports = resolvers;