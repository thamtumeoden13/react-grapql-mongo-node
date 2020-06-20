import React, { Component, Fragment } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart'
import BookingsControl from '../components/Bookings/BookingsControl/BookingsControl'

export class BookingPage extends Component {

    static contextType = AuthContext

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            bookings: [],
            outputType: 'list'
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
                            price
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
                mutation CancelBooking($id: ID!) { 
                    cancelBooking(bookingId: $id) { 
                        _id
                        title
                    } 
                }
            `,
            variables: {
                id: bookingId
            }
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

    handlerOutputType = outputType => {
        console.log("handlerOutputType")
        this.setState({ outputType })
    }

    render() {
        const { bookings, isLoading, outputType } = this.state
        let content = <Spinner />
        if (!isLoading) {
            content = (
                <Fragment>
                    <BookingsControl
                        handlerOutputType={this.handlerOutputType}
                        activeButtonType={outputType}
                    />
                    <div>
                        {outputType === 'list'
                            ? <BookingList
                                bookings={bookings}
                                onDelete={this.bookingDeleteHandle}
                            />
                            : <BookingsChart
                                bookings={bookings}
                            />
                        }
                    </div>
                </Fragment>

            )
        }

        return (
            <Fragment>
                {content}
            </Fragment>

        )
    }
}

export default BookingPage
