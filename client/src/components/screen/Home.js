import React,{useState,useEffect,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App'
import M from 'materialize-css'

const Home = () => {

    const history = useHistory()
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    // api call to fetch all posts from DB
    useEffect(() => {
        //console.log('HOME use-effect chala!')
        fetch('/showAllPost',{
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.error){
                M.toast({html: result.error,classes:"#c62828 red darken-3"})
                history.push('/login')
            }
            else{
                setData(result.posts)
            }
        })
        .catch((error) => console.log(error))
    },[])

    // api call to update likes on a post
    const likePost = (id) => {
        fetch('/like',{
            method : 'put',
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({postId : id})
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id==result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike',{
            method : 'put',
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({postId : id})
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id==result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        })
    }

    // api call to update comments on a post
    const commentPost = (text,postId) => {
        fetch('/comment',{
            method : 'put',
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({text,postId})
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.map((item) => {
                if(item._id==result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        })
    }

    // api call to delete a post
    const deletePost = (id) => {
        fetch(`/deletePost/${id}`,{
            method : 'delete',
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            const newData = data.filter((item) => {
                return item._id!==result._id
            })
            setData(newData)
        })
    }

    return (
        <>
            {
                data
                ? <section className="home">
                    {
                        data.map((item) => {
                            return (
                                <div className="card" key={item._id}>
                                    <h5 style={{padding:"6px"}}>
                                        {item.postedBy._id === state._id 
                                        ? 
                                            <div>
                                                <Link to="/profile">{item.postedBy.name}</Link>
                                                <i style={{float:'right'}} className="material-icons" onClick={() => deletePost(item._id)}>delete</i> 
                                            </div>
                                        : 
                                            <div>
                                                <Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link>
                                            </div>
                                        }
                                    </h5>
                                    <div className="card-image">
                                        <img src={item.photo}/>
                                    </div>
                                    <div className="card-content">
                                        <i className="material-icons heart-icon">favorite</i>
                                        {
                                            item.likes.includes(state._id) 
                                            ? <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
                                            : <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                                        }                                
                                        <h6>{item.likes.length} Likes</h6>
                                        <h6>{item.title}</h6>
                                        <p>{item.body}</p>
                                        {
                                            item.comments.map((record) => <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>)
                                        }
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            commentPost(e.target[0].value,item._id)
                                        }}> 
                                            <input type="text" placeholder="add a comment"/>
                                        </form>
                                    </div>
                                </div>
                            )
                        })
                    }
                </section> 
                : <h2>Loading....!</h2>
            }
        </>
        
    );
}

export default Home

