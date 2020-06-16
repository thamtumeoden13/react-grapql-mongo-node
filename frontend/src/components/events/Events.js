import React from 'react'
import EventItem from './event/Event'

import './events.css'

const Events = props => {

    const events = props.events.map((event, index) => {
        return <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            date={event.date}
            price={event.price}
            description={event.description}
            authUserId={props.authUserId}
            creatorId={event.creator._id}
            onDetail={props.onViewDetail}
            onDelete={props.onDeleteEvent}
        />
    })

    return (
        <ul className="event__list">
            {events}
        </ul>
    )
}

export default Events