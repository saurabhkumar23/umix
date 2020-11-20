import React,{useState,useEffect} from 'react'

const Home = () => {

    const [data,setData] = useState([])

    // api call to fetch all posts from DB
    useEffect(() => {
        fetch('/showAllPost',{
            headers :{
                "Authorization" : `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res) => res.json())
        .then((result) => {
            setData(result.posts)
        })
    },[])

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
