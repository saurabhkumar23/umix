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
                                    <div className='main-head'>
                                        <div className='profile-link'>
                                            <img className='side-image' src={item.postedBy.photo} alt='pic'/>
                                            <h5>
                                                {item.postedBy.id === state._id ? 
                                                <Link to="/profile">{item.postedBy.name}</Link> : 
                                                <Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link>}
                                            </h5>
                                        </div>
                                        <div>
                                            {item.postedBy._id === state._id ? <i style={{float:'right'}} className="material-icons" onClick={() => deletePost(item._id)}>delete</i> : null}
                                        </div>
                                    </div>
                                    <div className="card-image">
                                        <img src={item.photo}/>
                                    </div>
                                    <div className="card-content">
                                        {
                                            item.likes.includes(state._id) 
                                            ? <i className="material-icons heart-icon" onClick={() => unlikePost(item._id)}>favorite</i>
                                            : <i className="material-icons heart-icon" onClick={() => likePost(item._id)}>favorite_border</i>
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

