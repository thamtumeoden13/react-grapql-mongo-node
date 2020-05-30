

const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const events = async eventId => {
    try {
        const events = await Event.find({ _id: { $in: eventId } });

        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                // date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    } catch (error) {
        console.log({ error })
        throw error
    }
}

const user = async userId => {
    try {

        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user._id,
            createEvents: events.bind(this, user._doc.createEvents)
        }
    } catch (error) {
        console.log({ error })
        throw error
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            });
        } catch (error) {
            console.log({ error })
            throw error
        }
    },
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
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        } catch (error) {
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
    createEvent: async (args) => {
        try {
            const event = await new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5ecbf556687c4c069db50e31'
            })
            let createEvent;
            const result = await event.save();
            createEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
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
    bookEvent: async (args) => {
        try {
            const fetchedEvent = Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: '5ecbf556687c4c069db50e31',
                event: '5ecbf59293ddef07b6bb56ff'
            })
            const result = await booking.save()
            console.log({ result })
            return {
                ...result._doc,
                _id: result.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }
        } catch (error) {
            console.log({ error })
            throw error
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (error) {
            throw error
        }
    }
}