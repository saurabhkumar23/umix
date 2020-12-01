import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Profile = () => {

    const [posts,setPosts] = useState([])
    const [image, setImage] = useState('')
    const [url,setUrl] = useState('')
    const {state,dispatch} = useContext(UserContext)

    // api call to fetch my post images
    useEffect(() => {
        //console.log('useeffect chala bhai')
        fetch('/showMyPost',{
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.error){
                console.log(result.error)
            }
            else{
                setPosts(result.posts)
            }
        })
    },[])

    // api call to update profile pic
    useEffect(() => {
        if(url){
            fetch("/updatePhoto",{
                method : "put",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : JSON.stringify({photo:url})
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html: `Profile pic changed Successfully!`,classes:"#2e7d32 green darken-3"})
                    localStorage.setItem('user',JSON.stringify({...state,photo:data.photo}))
                    dispatch({type:"UPDATEPIC",payload:data.photo})
                }
            })
            .catch((error) => console.log(error))
        }
    },[url])

    // submit image data to cloudinary and get the url back for posting data to DB
    useEffect(() => {
        if(image){
            const data = new FormData()
            data.append('file',image)
            data.append('upload_preset','umix-app')
            data.append('cloud_name','getgrouped')
            fetch('https://api.cloudinary.com/v1_1/getgrouped/image/upload',{
                method : 'post',
                body : data
            })
            .then((res) => res.json())
            .then((data) => setUrl(data.url))
            .catch((error) => console.log(error))
        }
    },[image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <>
            {
                state && posts
                ? 
                <section className="profile">
                    <div className="main-profile-container">
                        <div className="profile-head">
                            <div>
                                <img src={state.photo}/>
                                <div className="file-field input-field">
                                    <div className="btn #64b5f6 blue darken-2">
                                        <span><i className="material-icons">add_a_photo</i></span>
                                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])}/>
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4>{state.name}</h4>
                                <h6>{state.email}</h6>
                                <div className="profile-info">
                                    <h5>{posts.length} Posts</h5>
                                    <h5>{state.followers.length} Followers</h5>
                                    <h5>{state.following.length} Following</h5>
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
                :
                <h1>Loading...!</h1>
            }
        </>
        
        
    );
}

export default Profile







