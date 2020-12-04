import React,{useState,useEffect} from 'react'
import {Link,useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css'

const NewPass = () => {

    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()
        
    const submitData = () => {
        fetch("/newPassword",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({token,password})
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
                    <input type="password" placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Update</button>
            </div>
        </section>
    );
}

export default NewPass







