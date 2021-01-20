import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import Loading from './Loading'
import M from 'materialize-css'

const Profile = () => {

    const [posts,setPosts] = useState([])
    const [image, setImage] = useState('')
    const [url,setUrl] = useState('')
    const [loading,setLoading] = useState(false)
    const {state,dispatch} = useContext(UserContext)

    // api call to fetch my post images
    useEffect(() => {
        setLoading(true)
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
            setLoading(false)
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
                setLoading(false)
            })
            .catch((error) => console.log(error))
        }
    },[url])

    // submit image data to cloudinary and get the url back for posting data to DB
    useEffect(() => {
        if(image){
            setLoading(true)
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
                loading || !state ? <Loading/> :
                <section className="profile">
                    <div className="main-profile-container">
                        <div className="profile-head">
                            <div>
                                <div className='pic-container'>
                                    <div className='pic'>
                                        {loading ? <Loading/> : <img src={state.photo} alt="profile"/> }
                                    </div>
                                </div>
                                <div className="file-field input-field">
                                        <div className="btn #64b5f6 blue darken-2">
                                            <span><i className="material-icons">add_a_photo</i></span>
                                            <input type="file" value="" onChange={(e) => updatePhoto(e.target.files[0])}/>
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text"/>
                                        </div>
                                </div>
                            </div>
                            <div className='profile-info'>
                                <h4>{state.name}</h4>
                                <h6>{state.email}</h6>
                                <div className="profile-sub-details">
                                    <h5><span>{posts.length}</span> Posts</h5>
                                    <h5><span>{state.followers.length}</span> Followers</h5>
                                    <h5><span>{state.following.length}</span> Following</h5>
                                </div>
                            </div>
                        </div>
                        <div className="row profile-gallery">
                                {
                                    posts.map((post) => <div key={post._id} className="col xl4 m6">
                                        <img src={post.photo} alt={post.title}/>
                                        </div>)
                                }
                        </div>
                    </div>
                </section>
            }
        </>
    );
}

export default Profile







