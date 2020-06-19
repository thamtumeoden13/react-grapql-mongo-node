import React, { Fragment } from 'react'
import Backdrop from '../Backdrop/Backdrop'

import './modal.css'

const modal = (props) => (
    <Fragment>
        <Backdrop />
        <div className="modal">
            <header className="modal__header"><h1>{props.title}</h1></header>
            <section className="modal__content">{props.children}</section>
            <section className="modal__actions">
                {props.canCancel &&
                    <button className="btn" onClick={props.onCancel}>Cancel</button>
                }
                {props.canConfirm &&
                    <button className="btn" onClick={props.onConfirm}>
                        {props.confirmText ? props.confirmText : "Confirm"}
                    </button>
                }
            </section>
        </div>
    </Fragment>
)

export default modal;