import React, { Component, Fragment, createRef } from 'react'
import Modal from '../components/modal/Modal'
import AuthContext from '../context/auth-context'

import './events.css'

export class EventsPage extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props)
        this.state = {
            creating: false,
            events: []
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
        this.setState({ creating: false })

    }

    modalConfirmHandler = () => {
        this.setState({ creating: false })
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
                            creator{
                                _id
                                email
                            }
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
                throw new Error('Fail Connect')
            }
            return res.json()
        }).then(resData => {
            this.fetchEvents()
        }).catch(err => {
            console.log(err)
        })
    }

    fetchEvents = () => {
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
                throw new Error('Fail Connect')
            }
            return res.json()
        }).then(resData => {
            console.log(resData)
            this.setState({ events: resData.data.events })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const { creating, events } = this.state
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
                {this.context.token &&
                    <div className="events-control">
                        <p>Share your own Events!</p>
                        <button className="btn" onClick={this.onHandleCreatEvent}>Create Event</button>
                    </div>
                }
                <ul className="events__list">
                    {events && events.length > 0 &&
                        events.map((item, index) => (
                            <li key={index} className="events__list-item">{item.title}</li>
                        ))
                    }
                </ul>
            </Fragment>
        )
    }
}

export default EventsPage
