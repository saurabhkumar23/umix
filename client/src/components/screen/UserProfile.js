import React,{useState,useEffect,useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'

const UserProfile = () => {

    const history = useHistory()
    const [userProfile,setUserProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()

    // api call to fetch user details
    useEffect(() => {
        //console.log('use effect chala bhai')
        fetch(`/user/${userid}`,{
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.error){
                M.toast({html: result.error,classes:"#c62828 red darken-3"})
                history.push('/')
            }
            else{
                setUserProfile(result)
            }
        })
    },[])

    return (
        <>
            {userProfile 
                ?
                <section className="profile">
                    <div className="main-profile-container">
                        <div className="profile-head">
                            <div>
                                <img src="https://images.unsplash.com/photo-1550927407-50e2bd128b81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
                            </div>
                            <div>
                                <h4>{userProfile.user.name}</h4>
                                <div className="profile-info">
                                    <h5>{userProfile.posts.length} posts</h5>
                                    <h5>20 Followers</h5>
                                    <h5>30 Following</h5>
                                </div>
                            </div>
                        </div>
                        <div className="profile-gallery">
                            {
                                userProfile.posts.map((post) => <img key={post._id} src={post.photo} alt={post.title}/>)
                            }
                        </div>
                    </div>
                </section>
                : 
                <h2>Loading...!</h2>
            }
        </>
        
    );
}

export default UserProfile







