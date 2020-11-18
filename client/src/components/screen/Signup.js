import React,{useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitData = () => {
        fetch("/signup",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({name,email,password})
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: data.message,classes:"#2e7d32 green darken-3"})
                history.push('/login')
            }
        })
        .catch((error) => console.log(error))
    }

    return (
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
                <div className="input-field">
                    <input type="text" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Register</button>
                <h6>Have an account? <Link className="blue-text lighten-2" to="/login">Log in</Link></h6>
            </div>
        </section>
    );
}

export default Signup







