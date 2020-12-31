import React,{useState,useEffect,useContext} from 'react'
import {useParams,Link} from 'react-router-dom'
import {UserContext} from '../../App'
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'
import Loading from './Loading'

const UserProfile = () => {

    const history = useHistory()
    const [userProfile,setUserProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [loading,setLoading] = useState(false)

    // api call to fetch user details
    useEffect(() => {
        setLoading(true)
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
            setLoading(false)
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
            { loading || !userProfile ? <Loading/> : 
                <section className="profile">
                    <div className="main-profile-container">
                    <div className="profile-head">
                            <div className='pic-container'>
                                <div className='pic'>
                                    <img src={userProfile.user.photo} alt="profile-image"/>
                                </div>
                            </div>
                            <div className='profile-info'>
                                <h4>{userProfile.user.name}</h4>
                                <h6>{userProfile.user.email}</h6>
                                <div style={{marginTop:'20px'}}>
                                    {
                                        !state.following.includes(userid)
                                        ?   <button onClick={followUser} className="btn waves-effect waves-light #64b5f6 blue darken-2">Follow</button>
                                        :   <button onClick={unfollowUser} className="btn waves-effect waves-light #64b5f6 blue darken-2">unFollow</button>  
                                    }
                                </div>
                                <div className="profile-sub-details">
                                    <h5><span>{userProfile.posts.length}</span> Posts</h5>
                                    <h5><span>{userProfile.user.followers.length}</span> Followers</h5>
                                    <h5><span>{userProfile.user.following.length}</span> Following</h5>
                                </div>
                            </div>
                        </div>
                        <div class="row profile-gallery">
                                {
                                    userProfile.posts.map((post) => <div class="col xl4 m6">
                                        <img key={post._id} src={post.photo} alt={post.title}/>
                                        </div>)
                                }
                        </div>
                    </div>
                </section>
            }
        </>
        
    );
}

export default UserProfile







