import React, { Fragment } from 'react'

import './bookingsControl.css'

const BookingsControl = props => {
    return (
        <div className="bookings-control">
            <button
                className={props.activeButtonType === 'list' ? 'active' : ''}
                onClick={() => props.handlerOutputType('list')}
            >
                List
            </button>
            <button
                className={props.activeButtonType === 'chart' ? 'active' : ''}
                onClick={() => props.handlerOutputType('chart')}
            >
                Chart
            </button>
        </div>
    )
}

export default BookingsControl