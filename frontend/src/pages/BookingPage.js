import React, { Component, Fragment } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/spinner/Spinner'
import BookingList from '../components/bookings/Bookings'
export class BookingPage extends Component {

    static contextType = AuthContext

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            bookings: []
        }
    }

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query { 
                    bookings { 
                        _id
                        createdAt
                        updatedAt
                        user{
                            _id
                            email
                        }
                        event{
                            _id
                            title
                            date
                        }
                    } 
                }
            `
        }
        const token = this.context.token;
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
            const bookings = resData.data.bookings
            this.setState({ bookings: bookings, isLoading: false })
        }).catch(err => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }

    bookingDeleteHandle = bookingId => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                mutation { 
                    cancelBooking(bookingId:"${bookingId}") { 
                        _id
                        title
                    } 
                }
            `
        }
        const token = this.context.token;
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
                const updateBookings = prevState.bookings.filter(booking => { return booking._id !== bookingId })
                return { bookings: updateBookings, isLoading: false }
            })
        }).catch(err => {
            console.log(err)
            this.setState({ isLoading: false })
        })
    }

    render() {
        const { bookings, isLoading } = this.state
        return (
            <Fragment>
                {isLoading ? <Spinner />
                    : <BookingList bookings={bookings} onDelete={this.bookingDeleteHandle} />
                }
            </Fragment>

        )
    }
}

export default BookingPage
