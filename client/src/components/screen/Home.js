import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'

const Home = () => {

    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    // api call to fetch all posts from DB
    useEffect(() => {
        fetch('/showAllPost',{
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            setData(result.posts)
        })
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

    return (
        <section className="home">
            {
                data.map((item) => {
                    return (
                        <div className="card" key={item._id}>
                            <h5>{item.postedBy.name}</h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons">favorite</i>
                                {
                                    item.likes.includes(state._id) 
                                    ? <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
                                    : <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                                }                                
                                <h6>{item.likes.length} Likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <input type="text" placeholder="add a comment"/>
                            </div>
                        </div>
                    )
                })
            }
        </section> 
    );
}

export default Home
