import React,{useState,useEffect} from 'react'
import {Link,useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css'
import Loading from './Loading'

const NewPass = () => {

    const history = useHistory()
    const [loading,setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [isPassVisible,setPassVisible] = useState(false)
    const {token} = useParams()
        
    const submitData = () => {
        setLoading(true)
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
            setLoading(false)
        })
        .catch((error) => console.log(error))
    }

    return (
        <>
            {
                loading ? <Loading/> :
                <section className="new-password-form">
                    <div className="card">
                        <h2>Umix</h2>
                        <div className="input-field password-field">
                            <input type={isPassVisible ? "text" : "password"} placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span onClick={() => setPassVisible(!isPassVisible)}>{isPassVisible ? "Hide" : "Show"}</span>
                        </div>
                        <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Update</button>
                    </div>
                </section>
            }
        </>
        
    );
}

export default NewPass







