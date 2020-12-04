import React,{useState} from 'react'
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'

const ResetPass = () => {

    const history = useHistory()
    const [email, setEmail] = useState("")

    // api call to backend
    const submitData = () => {
        fetch("/resetPassword",{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email})
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
        <section className="login-form">
            <div className="card">
                <h2>Umix</h2>
                <div className="input-field">
                    <input type="text" placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button onClick={submitData} className="btn waves-effect waves-light #64b5f6 blue darken-2">Submit</button>
            </div>
        </section>
    );
}

export default ResetPass







