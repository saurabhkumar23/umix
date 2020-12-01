import React,{useState,useEffect,useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'

const UserProfile = () => {

    const history = useHistory()
    const [userProfile,setUserProfile] = useState(null)
    const [showFollow,setShowFollow] = useState(true)
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
                console.log(state)
            }
        })
    },[])

    // api call to follow event
    const followUser = () => {
        fetch("/follow",{
            method : "put",
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({followId : userid})
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.error){
                M.toast({html: result.error,classes:"#c62828 red darken-3"})
            }
            else{
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem("user",JSON.stringify(result))
                setUserProfile((prevstate) => {
                    return {...prevstate,user:{...prevstate.user,followers:[...prevstate.user.followers,result._id]}}
                })
                setShowFollow(false)
            }
        })
        .catch((error) => console.log(error))
    }

    // api call to unfollow event
    const unfollowUser = () => {
        fetch("/unfollow",{
            method : "put",
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({unfollowId : userid})
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.error){
                M.toast({html: result.error,classes:"#c62828 red darken-3"})
            }
            else{
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem("user",JSON.stringify(result))
                setUserProfile((prevstate) => {
                    const newFollowerList = prevstate.user.followers.filter(item => item!== result._id)
                    return {...prevstate,user:{...prevstate.user,followers:newFollowerList}}
                })
            }
        })
        .catch((error) => console.log(error))
    }

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
                                <h6>{userProfile.user.email}</h6>
                                <div style={{marginTop:'20px'}}>
                                    {
                                        showFollow
                                        ?   <button onClick={followUser} className="btn waves-effect waves-light #64b5f6 blue darken-2">Follow</button>
                                        :   <button onClick={unfollowUser} className="btn waves-effect waves-light #64b5f6 blue darken-2">unFollow</button>  
                                    }
                                </div>
                                <div className="profile-info">
                                    <h5>{userProfile.posts.length} Posts</h5>
                                    <h5>{userProfile.user.followers.length} Followers</h5>
                                    <h5>{userProfile.user.following.length} Following</h5>
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






