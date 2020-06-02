const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { transformBooking, transformEvent } = require('../resolvers/merge')

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (error) {
            throw error
        }
    },
    bookEvent: async (args) => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: '5ecbf556687c4c069db50e31',
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
    cancelBooking: async (args) => {
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
