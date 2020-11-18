import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'

const CreatePost = () => {

    const history = useHistory()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url,setUrl] = useState('')

    useEffect(() => {
        if(url){
            fetch("/createPost",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : JSON.stringify({title,body,photo:url})
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html: `Post created Successfully!`,classes:"#2e7d32 green darken-3"})
                    history.push('/')
                }
            })
            .catch((error) => console.log(error))
        }
    },[url])

    const postDetails = () => {
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
        <section className="create-post-form">
            <div className="card">
                <h2>Umix</h2>
                <div className="input-field">
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="input-field">
                    <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)}/>
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
                <button onClick={postDetails} className="btn waves-effect waves-light #64b5f6 blue darken-2">Submit Post</button>
            </div>
        </section>
    )
}

export default CreatePost
