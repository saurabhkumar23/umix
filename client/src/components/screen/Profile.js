import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {

    const [posts,setPosts] = useState([])
    const {state,dispatch} = useContext(UserContext)

    // api call to fetch my post images
    useEffect(() => {
        fetch('/showMyPost',{
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            setPosts(result.posts)
        })
    },[])

    return (
        <section className="profile">
            <div className="main-profile-container">
                <div className="profile-head">
                    <div>
                        <img src="https://images.unsplash.com/photo-1550927407-50e2bd128b81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <div className="profile-info">
                            <h5>{posts.length}</h5>
                            <h5>20 Followers</h5>
                            <h5>30 Following</h5>
                        </div>
                    </div>
                </div>
                <div className="profile-gallery">
                    {
                        posts.map((post) => <img key={post._id} src={post.photo} alt={post.title}/>)
                    }
                </div>
            </div>
        </section>
    );
}

export default Profile







