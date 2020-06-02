const Event = require('../../models/event')
const User = require('../../models/user')
const { transformEvent } = require('./merge')

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event)
            });
        } catch (error) {
            console.log({ error })
            throw error
        }
    },
    createEvent: async (args) => {
        try {
            const event = await new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5ecbf556687c4c069db50e31'
            })
            const result = await event.save();
            let createEvent = transformEvent(result)
            const creator = await User.findById("5ecbf556687c4c069db50e31")
            if (!creator) {
                throw new Error('User not found');
            }
            creator.createEvents.push(event);
            await creator.save();
            return createEvent
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}