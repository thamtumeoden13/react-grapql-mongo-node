const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: { $in: userIds } })
})

const transformEvent = event => {
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

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.sort((a, b) => {
            return (
                eventIds.indexOf(a._id.toString() - eventIds.indexOf(b._id.toString()))
            )
        })
        console.log(eventIds, events)
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
            createEvents: () => eventLoader.loadMany(user._doc.createEvents)
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