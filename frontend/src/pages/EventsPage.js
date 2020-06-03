import React, { Component, Fragment } from 'react'
import Modal from '../components/modal/Modal'

import './events.css'

export class EventsPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            creating: false
        }
    }

    onHandleCreatEvent = () => {
        this.setState({ creating: true })
    }

    modalCancelEvent = () => {
        this.setState({ creating: false })
    }

    modalConfirmEvent = () => {
        this.setState({ creating: false })
    }

    render() {
        const { creating } = this.state
        return (
            <Fragment>
                {creating &&
                    <Modal title={"Add Events"}
                        canCancel={true} canConfirm={true}
                        onCancel={this.modalCancelEvent}
                        onConfirm={this.modalConfirmEvent}
                    >
                        <p>Modal content</p>
                    </Modal>
                }
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.onHandleCreatEvent}>Create Event</button>
                </div>
            </Fragment>
        )
    }
}

export default EventsPage
