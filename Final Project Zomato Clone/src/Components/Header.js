import React from "react";
import '../Styles/header.css';
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import GoogleLogin from 'react-google-login';
import axios from "axios";


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid 1px red',
        background: 'white',
        width: '36%'
    },
};
class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            msgModalIsOpen: false,
            message: undefined,
            userLoggedIn: false,
            userName: undefined,
            isLoggedIn: false,
            createModalIsOpen: false,
            user: undefined,
            pwd: undefined,
            fn: undefined,
            ln: undefined,
            userlog: []
        }

    }



    handleNavigate = () => {
        this.props.history.push('/');
    }
    handleLogin = () => {
        this.setState({ loginModalIsOpen: true, msgModalIsOpen: false });
    }
    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, userName: response.profileObj.name, loginModalIsOpen: false, createModalIsOpen: false });
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, userName: undefined, userLoggedIn: false });

    }
    handleCaccount = () => {
        this.setState({ createModalIsOpen: true });
    }
    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }


    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }

    handleSignup = (e) => {
        const { user, pwd, fn, ln } = this.state;
        e.preventDefault();
        const userObj = {
            user,
            pwd,
            fn,
            ln
        };
        if (!fn || !ln || !user || !pwd) {
            alert("Please fill all the field")
        }

        axios({
            method: "POST",
            url: "http://localhost:8989/usersignup",
            headers: {
                'Content-Type': 'application/json'
            },
            data: userObj
        })
            .then((response) => {
                this.setState({ message: response.data.message });

            }).catch(err => { console.log(err) })
        this.setState({
            createModalIsOpen: false, userLoggedIn: true, msgModalIsOpen: true
        });

    }

    handleSignin = (e) => {
        const { user, pwd } = this.state;
        e.preventDefault();

        if (!user || !pwd) {
            alert("please fill all the fields")
        } else {
            const userObj = {
                user,
                pwd
            };

            axios({
                method: "POST",
                url: "http://localhost:8989/userlogin",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: userObj
            }).then((response) => {
                this.setState({
                    userlog: response.data.user,
                    loginModalIsOpen: false,
                    userLoggedIn: true

                });

            }).catch(err => console.log(err))

        }
    }
    render() {
        const { loginModalIsOpen, msgModalIsOpen, userLoggedIn, userlog, isLoggedIn, userName, createModalIsOpen } = this.state;
        console.log(userlog)
        return (

            <div className="header">
                <div className="title_name" onClick={this.handleNavigate}>
                    <i>ZOMATO</i>
                </div>
                {
                    !userLoggedIn ? (!isLoggedIn ? <div className="login-group">
                        <button type="button" className="btn btn-light login " onClick={this.handleLogin}>
                            Login
                        </button>
                        <button type="button" className="btn btn-danger signup" onClick={this.handleCaccount}>
                            Create an account
                        </button>
                    </div> : <div className="login-group">
                        <button type="button" className="btn btn-light login ">
                            {userName}
                        </button>
                        <button type="button" className="btn btn-danger signup" onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>) :
                        (<div className="login-group">
                            <button type="button" className="btn btn-light login ">
                                {`${userlog[0].firstname}`}
                            </button>
                            <button type="button" className="btn btn-danger signup"
                                onClick={this.handleLogout}>
                                Logout
                            </button>
                        </div>)
                }

                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('loginModalIsOpen', false)}></div>
                        <form>
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('user', event)} />
                            <label class="form-label">Password</label>
                            <input type="password" className="form-control" onChange={(event) => this.handleInputChange('pwd', event)} />
                            <button type="submit" className="btn btn-danger" style={{ marginTop: '25px', float: 'left' }} onClick={(event) => this.handleSignin(event)}>Login</button>

                        </form>
                        <GoogleLogin
                            clientId="832901541200-4afobklqppbthf0kk6eslhi7dj97ctg2.apps.googleusercontent.com"
                            buttonText="Login with Google" className="glogin"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />

                    </div>
                </Modal>
                <Modal
                    isOpen={createModalIsOpen}
                    style={customStyles}

                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('createModalIsOpen', false)}></div>
                        <form>
                            <label className="form-label">First Name</label>
                            <input style={{ width: '100%' }} type="text" className="form-control" onChange={(event) => this.handleInputChange('fn', event)} />
                            <label className="form-label">Last Name</label>
                            <input style={{ width: '100%' }} type="text" className="form-control" onChange={(event) => this.handleInputChange('ln', event)} />
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('user', event)} />
                            <label className="form-label">Password</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('pwd', event)} />
                            <label className="form-label">Confirm Password</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('pwd', event)} />
                            <button className="btn btn-danger" style={{ marginTop: '25px', float: 'left' }} onClick={(event) => this.handleSignup(event)}>Sign Up</button>

                        
                        <GoogleLogin
                            clientId="832901541200-4afobklqppbthf0kk6eslhi7dj97ctg2.apps.googleusercontent.com"
                            buttonText="Login with Google" className="glogin"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={msgModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <h1>Account is created successfully</h1>
                        <button className='login' onClick={this.handleLogin}>Login</button>
                    </div>
                </Modal>
            </div>
        )
    }
}


export default withRouter(Header);