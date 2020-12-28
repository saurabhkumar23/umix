import React,{useState,useEffect,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
import {UserContext} from '../../App'
import Loading from './Loading'

const Signup = () => {

    const history = useHistory()
    const {state,dispatch} = useContext(UserContext)
    const [loading,setLoading] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isPassVisible,setPassVisible] = useState(false)
    const [image, setImage] = useState('')
    const [url,setUrl] = useState('')

    useEffect(() => {
        if(state){
            history.push('/')
        }
    })

     // api call to create a user
    useEffect(() => {
        if(url){
            fetch("/signup",{
                method : "post",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({name,email,password,photo:url})
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                    setUrl('')
                }
                else{
                    M.toast({html: data.message,classes:"#2e7d32 green darken-3"})
                    history.push('/login')
                }
                setLoading(false)
            })
            .catch((error) => console.log(error))
        }
    },[url])

    // submit image data to cloudinary and get the url back for posting data to DB
    const uploadPic = () => {
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
        
    const submitData = () => {
        setLoading(true)
        if(image){
            uploadPic()
        }
        else{
            setUrl("https://res.cloudinary.com/getgrouped/image/upload/v1606821978/User-Default_mwzmy3.jpg")
        }
    }

    return (
        <>
            {
                loading ? <Loading/> :
                <section className="signup-form">
                    <div className="card">
                        <h2>Umix</h2>
                        <div className="input-field">
                            <input type="text" placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-field">
                            <input type="text" placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-field password-field">
                            <input type={isPassVisible ? "text" : "password"} placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span onClick={() => setPassVisible(!isPassVisible)}>{isPassVisible ? "Hide" : "Show"}</span>
                        </div>
                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-2">
                                <span>Upload Profile</span>
                                <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                        </div>
                        <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Register</button>
                        <h6>Have an account? <Link className="blue-text lighten-2" to="/login">Log in</Link></h6>
                    </div>
                </section>
            }
        </>
    );
}

export default Signup







