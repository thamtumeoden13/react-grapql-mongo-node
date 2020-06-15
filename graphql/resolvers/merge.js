const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
    console.log(userIds)
    return User.find({ _id: { $in: userIds } })
})

const transformEvent = event => {
    console.log(event)
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const events = async eventId => {
    try {
        const events = await Event.find({ _id: { $in: eventId } });
        return events.map(event => {
            return transformEvent(event)
        })
    } catch (error) {
        console.log({ error })
        throw error
    }
}

const user = async userId => {
    try {

        const user = await userLoader.load(userId.toString())
        return {
            ...user._doc,
            _id: user._id,
            createEvents: eventLoader.loadMany.bind(this, user._doc.createEvents)
        }
    } catch (error) {
        console.log({ error })
        throw error
    }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString())
        return event
    } catch (error) {
        throw error
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;