const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { transformBooking, transformEvent } = require('../resolvers/merge')

module.exports = {
    bookings: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }

        try {
            const bookings = await Booking.find()
            const filterBookings = bookings.filter(booking => { return booking._doc.event })
            console.log("bookings", bookings)
            console.log("filterBookings", filterBookings)
            return filterBookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (error) {
            throw error
        }
    },
    bookEvent: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }

        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent // '5ecbf59293ddef07b6bb56ff'
            })
            const result = await booking.save()
            console.log({ result })
            return transformBooking(result)
        } catch (error) {
            console.log({ error })
            throw error
        }
    },
    cancelBooking: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }

        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (error) {
            throw error
        }
    }
}
