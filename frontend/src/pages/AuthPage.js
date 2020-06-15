import React, { Component } from 'react'

import AuthContext from '../context/auth-context'

import './authPage.css'


export class AuthPage extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props)
        this.state = {
            isLogin: true
        }
        this.emailEl = React.createRef()
        this.passwordEl = React.createRef()
    }

    switchHandlerMode = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin }
        })
    }

    handlerSubmit = (e) => {
        e.preventDefault()
        const email = this.emailEl.current.value
        const password = this.passwordEl.current.value
        console.log(email, password)

        if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query {
                    login(email:"${email}", password:"${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation { 
                        createUser(userInput:{ email:"${email}", password :"${password}" }){ 
                            _id
                            email
                        } 
                    }
                `
            }
        }

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Fail Connect')
            }
            return res.json()
        }).then(resData => {
            if (this.state.isLogin) {
                if (resData.data.login.token) {
                    const { userId, token, tokenExpiration } = resData.data.login
                    this.context.login(userId, token, tokenExpiration)
                }
            }
            console.log(resData)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <form className="auth-form" onSubmit={this.handlerSubmit}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password" >Password</label>
                    <input type="password" id="password" ref={this.passwordEl} />
                </div>
                <div className="form-action">
                    <button type="button" onClick={this.switchHandlerMode}>Switch to {this.state.isLogin ? 'SignUp' : 'Login'}</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
    }
}

export default AuthPage
