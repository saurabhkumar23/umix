import React,{useContext,useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom';
import {UserContext} from '../../../App'
import M from 'materialize-css'

const UserSearch = () => {

    const {state,dispatch} = useContext(UserContext)
    const searchModal = useRef(null)
    const[search,setSearch] = useState('')
    const [searchUsers,setSearchUsers] = useState([])

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
                setSearchUsers(result)
            })
            .catch((error) => console.log(error))
        }
    }

    return (
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
                                    to={!state ? "/login" : (user._id===state._id ? "/profile" : "/profile/"+user._id )}
                                    className = "modal-close"
                                    key={user._id}>
                                    <li  
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
    )
}

export default UserSearch
