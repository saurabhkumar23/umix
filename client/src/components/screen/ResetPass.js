import React,{useState} from 'react'
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'

const ResetPass = () => {

    const history = useHistory()
    const [email, setEmail] = useState("")

    // api call to reset the password
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
                <section className='form-main-container'>
                    <section>
                        <img src='https://res.cloudinary.com/getgrouped/image/upload/v1609421382/White_and_Pink_Strikeout_Cosmetics_Beauty_Logo_ymim3g.png'
                            alt='main-logo'
                        />
                    </section>
                    <section className="reset-password-form">
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
                </section>
    );
}

export default ResetPass







