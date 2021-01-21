import React,{useState,useEffect} from 'react'
import {useParams,useHistory} from 'react-router-dom';
import Loading from './Loading'
import M from 'materialize-css'

const EditPost = () => {

    const history = useHistory()
    const {postid} = useParams()

    //usestates
    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [url,setUrl] = useState('')
    const [loading,setLoading] = useState(false)

    // api call to fetch current post
    useEffect(() => {
        setLoading(true)
        fetch(`/show/${postid}`,{
            method : "get",
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
                history.push('/')
            }
            else{
                setTitle(data.post[0].title)
            }
            setLoading(false)
        })
        .catch((error) => console.log(error))
    },[])

    // api call to update the post
    useEffect(() => {
        if(url){
            fetch("/editPost",{
                method : "put",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : JSON.stringify({title,photo:url,postid})
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                    setUrl('')
                }
                else{
                    M.toast({html: `Post Updated Successfully!`,classes:"#2e7d32 green darken-3"})
                    history.push('/')
                }
                setLoading(false)
            })
            .catch((error) => console.log(error))
        }
    },[url])

    // submit image data to cloudinary and get the url back 
    const postDetails = () => {
        if(!title || !image){
            M.toast({html: 'Please fill all the fields',classes:"#c62828 red darken-3"})
            return
        }
        setLoading(true);
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

    return (
        <>
            {
            loading ? <Loading/> :
            <section className="create-post-form">
                <div className="card">
                    <h2>Umix</h2>
                    <div className="input-field">
                        <input type="text" placeholder={title} value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className="file-field input-field">
                        <div className="btn #64b5f6 blue darken-2">
                            <span>Upload</span>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                    <button onClick={postDetails} className="btn waves-effect waves-light #64b5f6 blue darken-2">Update</button>
                </div>
            </section>
        }
        </> 
    )
}

export default EditPost
