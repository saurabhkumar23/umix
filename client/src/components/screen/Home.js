import React,{useState,useEffect,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../App'
import Loading from './Loading'
import M from 'materialize-css'
import Pagination from './Pagination'

const Home = () => {

    const [loading,setLoading] = useState(false)
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    const [data,setData] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const postsPerPage = 5
    const indexOfLastPost = currentPage*postsPerPage
    const indexOfFirstPost = indexOfLastPost-postsPerPage
    const currentPosts = data.slice(indexOfFirstPost,indexOfLastPost)

    // api call to fetch all posts from DB
    useEffect(() => {
        setLoading(true)
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
            setLoading(false)
        })
        .catch((error) => console.log(error))
    },[])

    //function for pagination 
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
    const commentPost = (e,postId) => {
        e.preventDefault()
        if(!e.target[0].value.trim()){
            return 
        }
        const text = e.target[0].value
        e.target[0].value = ''
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

    //api call to delete a comment
    const deleteComment = (commentId,commentText,commentPostedBy,postId) => {
        fetch(`/deleteComment`,{
            method : 'put',
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({commentId,commentText,commentPostedBy,postId})
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
        <>
            {
                loading || !state ? <Loading/> :
                <section className="home">
                    {
                        currentPosts.map((item) => {
                            return (
                                <div className="card" key={item._id}>
                                    <div className='main-head'>
                                        <div className='profile-link'>
                                            <img className='side-image' src={item.postedBy.photo} alt='pic'/>
                                            <h5>
                                                {item.postedBy._id === state._id ? 
                                                <Link to="/profile">{item.postedBy.name}</Link> : 
                                                <Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link>}
                                            </h5>
                                        </div>
                                        <div>
                                        {
                                            item.postedBy._id !== state._id ? null :
                                            <div>
                                                <i style={{float:'right'}} className="material-icons"><Link to={`/${item._id}/edit`}>create</Link></i>
                                                <i style={{float:'right'}} className="material-icons" onClick={() => deletePost(item._id)}>delete</i>
                                            </div>
                                        }
                                        </div>
                                    </div>
                                    <div className="card-image">
                                        <img src={item.photo}/>
                                    </div>
                                    <div className="card-content">
                                        <div className='post-details'>
                                            {
                                                item.likes.includes(state._id) 
                                                ? <i className="material-icons heart-icon" onClick={() => unlikePost(item._id)}>favorite</i>
                                                : <i className="material-icons heart-icon" onClick={() => likePost(item._id)}>favorite_border</i>
                                            }                                
                                            <h6>{item.likes.length} Likes</h6>
                                            <h6>{item.title}</h6>
                                        </div>
                                        <div className='comment-box'>
                                            {
                                                item.comments.map((comment) => 
                                                <p key={comment._id}>
                                                    <span>
                                                    <Link to={comment.postedBy._id===state._id ? "/profile" : "/profile/"+comment.postedBy._id}>
                                                        {comment.postedBy.name} 
                                                    </Link>
                                                    </span> 
                                                    {comment.text}
                                                    {comment.postedBy._id === state._id ? 
                                                    <i style={{float:'right'}} className="material-icons" 
                                                    onClick={() => deleteComment(comment._id,comment.text,comment.postedBy,item._id)}>
                                                    delete
                                                    </i> : null}
                                                </p>
                                                )
                                            }
                                        </div>
                                        <div>
                                            <form onSubmit={(e) => commentPost(e,item._id)}> 
                                                <input type="text" placeholder="Add a comment..."/>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Pagination postsPerPage={postsPerPage} totalPosts={data.length} paginate={paginate} currentPage={currentPage}/>
                </section> 
            }
        </>
        
    );
}

export default Home

