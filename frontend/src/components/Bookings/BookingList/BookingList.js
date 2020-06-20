import React, { Component } from 'react'

import './bookingList.css'

const BookingList = props => {
    return (
        <ul className="bookings__list">
            {props.bookings.map(booking => {
                return (<li key={booking._id} className="bookings__item">
                    <div className="bookings__item-data">
                        <h1>{booking.event.title}</h1>
                        <h2>{'$'}{booking.event.price} - {' '}{new Date(booking.createdAt).toLocaleDateString()}</h2>
                    </div>
                    <div className="bookings__item-actions">
                        <button type="button" className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>)
            })}
        </ul>
    )
}

export default BookingList;