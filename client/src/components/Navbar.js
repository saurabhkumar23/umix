import React,{useContext,useEffect, useRef, useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () => {

    const searchModal = useRef(null)
    const[search,setSearch] = useState('')
    const [searchUsers,setSearchUsers] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    // initialise modal
    useEffect(() => {
        const options = {
            onCloseStart: function() {
                setSearch('')
                setSearchUsers([])
            }
        }
        M.Modal.init(searchModal.current,options)
    },[])

     // fetch seached users
    const fetchUsers = (data) => {
        setSearch(data)
        if(data){
            fetch("/searchUsers",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({data})
            })
            .then((res) => res.json())
            .then((result) => {
                console.log(result)
                setSearchUsers(result)
            })
            .catch((error) => console.log(error))
        }
    }

    // logout
    const onLogout = () => {
        localStorage.clear()
        dispatch({type : 'CLEAR'})
        history.push('/login')
    }

    const renderLinks = () => {
        if(state){
            return [
                <li>
                    <i data-target="modal1" className="large material-icons modal-trigger" style={{color:'black'}}>search</i>
                </li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <button onClick={onLogout} className="btn #ef5350 red lighten-1">Logout</button>
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

            <div id="modal1" className="modal modal-fixed-footer" ref={searchModal} style={{color:'black'}}>
                <div className="modal-content">
                    <div className="input-field">
                        <input type="text" placeholder="search user"
                            value={search}
                            onChange={(e) => fetchUsers(e.target.value)}
                        />
                    </div>
                    <ul className="collection">
                        {
                            searchUsers.map(user => 
                                <Link 
                                    to={!state ? "/login" : (user._id==state._id ? "/profile" : "/profile/"+user._id )}
                                    className = "modal-close">
                                    <li 
                                        key={user._id} 
                                        className="collection-item">
                                        {user.name}
                                        <span className="grey-text text-darken-2" style={{float:'right'}}>{user.email}</span>
                                    </li>
                                </Link>
                            )
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat">Close</button>
                </div>
            </div>

        </section>
    );
}

export default Navbar
