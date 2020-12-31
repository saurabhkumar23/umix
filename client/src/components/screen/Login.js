import React,{useState,useContext, useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
import {UserContext} from '../../App'
import Loading from './Loading'

const Login = () => {

    const {state,dispatch} = useContext(UserContext)
    const [loading,setLoading] = useState(false)

    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isPassVisible,setPassVisible] = useState(false)

    useEffect(() => {
        if(state){
            history.push('/')
        }
    })

    // api call to backend
    const submitData = () => {
        setLoading(true)
        fetch("/signin",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email,password})
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:'USER',payload:data.user})                //update user state from null to user's data
                M.toast({html: `Welcome ${data.user.name}`,classes:"#2e7d32 green darken-3"})
                history.push('/')
            }
            setLoading(false)
        })
        .catch((error) => console.log(error))
    }

    return (
        <>
            {
                loading ? <Loading/> :
                <section className='form-main-container'>
                    <section>
                        <img src='https://res.cloudinary.com/getgrouped/image/upload/v1609421382/White_and_Pink_Strikeout_Cosmetics_Beauty_Logo_ymim3g.png'
                            alt='main-logo'
                        />
                    </section>
                    <section className="login-form">
                        <div className="card">
                            <h2>Umix</h2>
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
                            <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Login</button>
                            <hr style={{marginTop:'20px', width:'50%'}}/>
                            <Link to='/resetPass' className='blue-text text-darken-4'>Forgot Password?</Link>
                            <h6>Don't have an account? <Link className="blue-text lighten-2" to="/signup">Sign up</Link></h6>
                        </div>
                    </section>
                </section>
                
            }
        </>
        
    );
}

export default Login







