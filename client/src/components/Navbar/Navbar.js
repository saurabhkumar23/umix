import React,{useContext,useEffect,useRef} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App'
import M from 'materialize-css'
import UserSearch from '../screen/Modals/UserSearch'

const Navbar = () => {

    const mobileSideNav = useRef(null)
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    // initialise side-nav 
    useEffect(() => {
        M.Sidenav.init(mobileSideNav.current)
    })

    // logout
    const onLogout = () => {
        localStorage.clear()
        dispatch({type : 'CLEAR'})
        history.push('/login')
    }

    // function setting links based on authentication
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

    const renderLinksMobile = () => {
        if(state){
            return [
                <li key="1">
                    <a class="modal-trigger" href="#modal1">Search</a>
                </li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4" onClick={onLogout} className='mobileLogoutButton'>Logout</li>,
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
    <>
        <section id='navbar'>
            <div className='navbar-fixed'>
                <nav>
                    <div class="nav-wrapper white">
                        <Link to={state ? "/" : "/login"} className="brand-logo">Umix</Link>
                        <a data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                        <ul class="right hide-on-med-and-down">
                            {renderLinks()}
                        </ul>
                    </div>
                </nav>
            </div>
            
            <ul class="sidenav" id="mobile-demo" ref={mobileSideNav}>
                {renderLinksMobile()}
            </ul>

            <UserSearch/>            
        </section>
    </>
    );
}

export default Navbar