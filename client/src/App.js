import React,{createContext,useEffect,useReducer,useContext} from 'react'
import {BrowserRouter,Route,useHistory} from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar'
import Home from './components/screen/Home';
import Login from './components/screen/Login';
import Signup from './components/screen/Signup';
import Profile from './components/screen/Profile';
import CreatePost from './components/screen/CreatePost';
import UserProfile from './components/screen/UserProfile';
import ResetPass from './components/screen/ResetPass';
import NewPass from './components/screen/NewPass';

import {reducer,initialState} from './Reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {

    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    // initial user configuration on App refresh
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        if(user){
            dispatch({type:"USER",payload:user})
        }
        else{
            if(!history.location.pathname.startsWith('/resetPass'))
                history.push('/login')
        }
    },[])

    return (
        <>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={Login}/>
        <Route path='/signup' component={Signup}/>
        <Route exact path='/profile' component={Profile}/>
        <Route path='/create' component={CreatePost}/>
        <Route path='/profile/:userid' component={UserProfile}/>
        <Route exact path='/resetPass' component={ResetPass}/>
        <Route path='/resetPass/:token' component={NewPass}/>
        </>
    )
}

const App = () => {
    const [state,dispatch] = useReducer(reducer,initialState)
    return (
        <>
            <UserContext.Provider value={{state,dispatch}}>
                <BrowserRouter>
                    <Navbar/>
                    <Routing/>
                </BrowserRouter>
            </UserContext.Provider>
        </>
    );
}

export default App