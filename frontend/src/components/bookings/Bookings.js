import React, { Component } from 'react'

import './bookings.css'

const Bookings = props => {
    return (
        <ul className="bookings__list">
            {props.bookings.map(booking => {
                return (<li key={booking._id} className="bookings__item">
                    <div className="bookings__item-data">
                        {booking.event.title} - {' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div className="bookings__item_actions">
                        <button type="button" className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>)
            })}
        </ul>
    )
}

export default Bookings;