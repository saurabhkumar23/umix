import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import Loading from '../Loading'
import M from 'materialize-css'

const MemeGenerator = () => {

    const [loading,setLoading] = useState(false)
    const [memes,setMemes] = useState([])
    const [memeIndex,setMemeIndex] = useState(0)
    const [captions,setCaptions] = useState([])
    const [generatedMemeUrl,setGeneratedMemeUrl] = useState('')

    const updateCaption = (e,index) => {
        const text = e.target.value
        setCaptions(
            captions.map((caption,i) => {
                if(index===i){
                    return text;
                }
                else{
                    return caption;
                }
            })
        )
    }

    const generateMeme = () => {
        setLoading(true)
        const currentMeme = memes[memeIndex]
        const formData = new FormData()
        formData.append('username','SaurabhKumar7')
        formData.append('password','gautam@562885821')
        formData.append('template_id',currentMeme.id)
        captions.forEach((caption,index) => formData.append(`boxes[${index}][text]`,caption))
        fetch('https://api.imgflip.com/caption_image',{
            method : 'POST',
            body : formData
        })
        .then((res) => res.json())
        .then((result) => {
            if(!result.success){
                M.toast({html: 'Please fill atleast one field',classes:"#c62828 red darken-3"})
            }
            else{
                setGeneratedMemeUrl(result.data.url)
            }
            setLoading(false)
        })
        .catch((error) => console.log(error))
    }

    const shuffleMeme = (arr) => {
        for(let i=arr.length-1;i>0;i--){
            const j = Math.floor(Math.random()*i)
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }

    const skipHandler = () => {
        setMemeIndex((prevIndex) => prevIndex+1);
        setGeneratedMemeUrl('');
    }

    useEffect(() => {
        setLoading(true)
        fetch('https://api.imgflip.com/get_memes')
        .then((res) => res.json())
        .then((result) => {
            shuffleMeme(result.data.memes)
            setMemes(result.data.memes)
            setLoading(false)
        })
        .catch((error) => console.log(error))
    },[])

    useEffect(() => {
        setLoading(true)
        if(memes.length){
            setCaptions(Array(memes[memeIndex].box_count).fill(''))
            setLoading(false)
        }
    },[memes,memeIndex,generatedMemeUrl])

    return (
        <>
            {
                (loading || !memes.length) ? <Loading/> :
                <section className='meme-container'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col s12 m6 left-box'>
                                <h3 className='center-align'>GENERATE YOUR MEME!</h3>
                                <div className='col s12'>
                                    {
                                        captions.map((caption,index) => 
                                        <div className="input-field caption" key={index}>
                                            <input id={index} type="text" className="validate" value={caption} onChange={(e) => updateCaption(e,index)}/>
                                            <label htmlFor={index}>Enter caption {index+1}</label>
                                        </div>)
                                    }
                                </div>
                                <div className='input-field col s12'>
                                    <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={generateMeme}>Generate</button>
                                    <button className="btn middle-btn waves-effect waves-light #388e3c green darken-2" onClick={skipHandler}>Skip</button>
                                    <Link to='/create' className="btn waves-effect waves-light #840b3b pink darken-2">Back</Link>
                                </div>
                            </div>
                            <div className='col s12 m6 right-box'>
                                <div className='card'>
                                    <div className='card-image'>
                                        {
                                            generatedMemeUrl ? 
                                            <div>
                                                <a href={generatedMemeUrl} target='_blank'>
                                                    <img src={generatedMemeUrl} alt='meme'/> 
                                                </a>
                                            </div>
                                            : <img src={memes[memeIndex].url} alt='main'/>
                                        }
                                    </div>
                                </div>
                                {generatedMemeUrl ? <p className='center-align'>Click the Image for Download</p> : null}
                            </div>
                        </div>
                    </div>
                </section>
            }
        </>
        
    )
}

export default MemeGenerator
