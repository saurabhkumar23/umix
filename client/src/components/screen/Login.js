import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
import {UserContext} from '../../App'

const Login = () => {

    const {state,dispatch} = useContext(UserContext)

    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // api call to backend
    const submitData = () => {
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
        })
        .catch((error) => console.log(error))
    }

    return (
        <section className="login-form">
            <div className="card">
                <h2>Umix</h2>
                <div className="input-field">
                    <input type="text" placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Login</button>
                <h6>Don't have an account? <Link className="blue-text lighten-2" to="/signup">Sign up</Link></h6>
            </div>
        </section>
    );
}

export default Login







