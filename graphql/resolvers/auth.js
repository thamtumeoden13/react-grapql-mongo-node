

const bcrypt = require('bcryptjs')

const User = require('../../models/user')

module.exports = {
    users: async () => {
        try {
            const users = await User.find()
            return users.map(user => {
                return {
                    ...user._doc,
                    _id: user.id,
                    email: user.email,
                    password: user.password,
                }
            });
        } catch (error) {
            console.log({ error })
            throw error
        }
    },
    user: async (args) => {
        try {
            const user = await User.findOne({ _id: args.id })
            return {
                ...user._doc,
                _id: user.id
            }
        } catch (error) {
            console.log({ error })
            throw error
        }
    },
    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error('Users exists already.')
            }
            const hashPassword = await bcrypt.hash(args.userInput.password, 12)
            const useNew = new User({
                email: args.userInput.email,
                password: hashPassword
            })
            const result = await useNew.save()
            return { ...result._doc, _id: result.id }
        } catch (error) {
            console.log({ error })
            throw (error)
        }
    },
}
