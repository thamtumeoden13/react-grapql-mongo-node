import React, { Component, Fragment, createRef } from 'react'
import Modal from '../components/modal/Modal'
import AuthContext from '../context/auth-context'
import EventList from '../components/events/Events'
import Spinner from '../components/spinner/Spinner'

import './eventsPage.css'

export class EventsPage extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props)
        this.state = {
            creating: false,
            events: [],
            isLoading: false,
            selectedEvent: null
        }
        this.titleElRef = createRef()
        this.priceElRef = createRef()
        this.dateElRef = createRef()
        this.descriptionElRef = createRef()
    }

    componentDidMount() {
        this.fetchEvents()
    }

    onHandleCreatEvent = () => {
        this.setState({ creating: true })
    }

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null })

    }

    modalConfirmHandler = () => {
        this.setState({ creating: false, isLoading: true })
        const title = this.titleElRef.current.value
        const price = +this.priceElRef.current.value
        const date = this.dateElRef.current.value
        const description = this.descriptionElRef.current.value

        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }
        const event = { title, price, date, description }
        console.log(event)

        const requestBody = {
            query: `
                    mutation { 
                        createEvent(eventInput: {title: "${title}", description:"${description}", price: ${price}, date:"${date}"}){ 
                            _id
                            title
                            price
                            date
                            description
                        } 
                    }
                `
        }

        const token = this.context.token;
        console.log(token, requestBody)

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                this.setState({ isLoading: false })
                throw new Error('Fail Connect')
            }
            return res.json()
        }).then(resData => {
            console.log(resData)
            this.setState(prevState => {
                let updateEvents = [...prevState.events]
                updateEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    price: resData.data.createEvent.price,
                    date: resData.data.createEvent.date,
                    description: resData.data.createEvent.description,
                    creator: {
                        _id: this.context.userId
                    }
                })
                return { events: updateEvents, isLoading: false }
            })
        }).catch(err => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }

    fetchEvents = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query { 
                    events { 
                        _id
                        title
                        price
                        date
                        description
                        creator{
                            _id
                            email
                        }
                    } 
                }
            `
        }

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                this.setState({ isLoading: false })
                throw new Error('Fail Connect')
            }
            return res.json()
        }).then(resData => {
            console.log(resData)
            const events = resData.data.events
            this.setState({ events: events, isLoading: false })
        }).catch(err => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }

    handlerShowDetail = (eventId) => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            return { selectedEvent: selectedEvent }
        })
    }

    handlerDeleteEvent = (eventId) => {
        console.log("handlerDeleteEvent")
    }

    bookEventHandler = () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null })
            return;
        }
        const requestBody = {
            query: `
                mutation { 
                    bookEvent(eventId:"${this.state.selectedEvent._id}") { 
                        _id
                        createdAt
                        updatedAt
                    } 
                }
            `
        }

        const token = this.context.token;
        console.log(token, requestBody)

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                this.setState({ isLoading: false })
                throw new Error('Fail Connect')
            }
            return res.json()
        }).then(resData => {
            console.log(resData)
            this.setState({ selectedEvent: null })
        }).catch(err => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }

    render() {
        const { creating, events, isLoading, selectedEvent } = this.state
        return (
            <Fragment>
                {creating &&
                    <Modal title={"Add Events"}
                        canCancel={true} canConfirm={true}
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title" >Title</label>
                                <input type="text" id="title" ref={this.titleElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price" >Price</label>
                                <input type="number" id="price" ref={this.priceElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date" >Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description" >Description</label>
                                <textarea type="text" id="description" rows={4} ref={this.descriptionElRef} />
                            </div>
                        </form>
                    </Modal>
                }
                {selectedEvent &&
                    <Modal title={selectedEvent.title}
                        canCancel={true} canConfirm={true}
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}
                        confirmText={this.context.token ? "Book" : "confirm"}
                    >
                        <h1> {selectedEvent.title} </h1>
                        <h2>$ {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{selectedEvent.description}</p>
                    </Modal>
                }
                {this.context.token &&
                    <div className="events-control">
                        <p>Share your own Events!</p>
                        <button className="btn" onClick={this.onHandleCreatEvent}>Create Event</button>
                    </div>
                }
                {isLoading
                    ? <Spinner />
                    :
                    <EventList
                        events={events}
                        authUserId={this.context.userId}
                        onViewDetail={this.handlerShowDetail}
                        onDeleteEvent={this.handlerDeleteEvent}
                    />
                }
            </Fragment>
        )
    }
}

export default EventsPage
