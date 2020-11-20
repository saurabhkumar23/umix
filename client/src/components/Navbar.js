import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'

const Navbar = () => {

    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    const renderLinks = () => {
        if(state){
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <button 
                onClick={() => {
                        localStorage.clear()
                        dispatch({type : 'CLEAR'})
                        history.push('/login')
                    }
                } 
                className="btn #ef5350 red lighten-1">Logout</button>
            ]
        }
        else{
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <section id="navbar">
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state ? "/" : "/login"} className="brand-logo left">Umix</Link>
                    <ul id="nav-mobile" className="right">
                        {renderLinks()}
                    </ul>
                </div>
            </nav>
        </section>
    );
}

export default Navbar
