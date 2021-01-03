import React,{useContext,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'
import UserSearch from './screen/Modals/UserSearch'

const Navbar = () => {

    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    // logout
    const onLogout = () => {
        localStorage.clear()
        dispatch({type : 'CLEAR'})
        history.push('/login')
    }

    const renderLinks = () => {
        if(state){
            return [
                <li key="1">
                    <i data-target="modal1" className="large material-icons modal-trigger" style={{color:'black'}}>search</i>
                </li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <button key="4" onClick={onLogout} className="btn #ef5350 red lighten-1">Logout</button>
            ]
        }
        else{
            return [
                <li key="5"><Link to="/login">Login</Link></li>,
                <li key="6"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <section id="navbar">
            <div className='navbar-fixed'>
                <nav>
                    <div className="nav-wrapper white">
                        <Link to={state ? "/" : "/login"} className="brand-logo left">Umix</Link>
                        <ul id="nav-mobile" className="right">
                            {renderLinks()}
                        </ul>
                    </div>
                </nav>
            </div>
            <UserSearch/>
        </section>
    );
}

export default Navbar