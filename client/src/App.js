import React,{createContext,useEffect,useReducer,useContext} from 'react'
import {BrowserRouter,Redirect,Route,Switch,useHistory} from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar'
import Home from './components/screen/Home';
import Login from './components/screen/Login';
import Signup from './components/screen/Signup';
import Profile from './components/screen/Profile';
import CreatePost from './components/screen/CreatePost';
import EditPost from './components/screen/EditPost';
import UserProfile from './components/screen/UserProfile';
import ResetPass from './components/screen/ResetPass';
import NewPass from './components/screen/NewPass';

import {reducer,initialState} from './Reducers/userReducer'
import ErrorPage from './components/screen/ErrorPage';

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
            <Navbar/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/signup' component={Signup}/>
                <Route exact path='/profile' component={Profile}/>
                <Route exact path='/create' component={CreatePost}/>
                <Route exact path='/:postid/edit' component={EditPost}/>
                <Route exact path='/profile/:userid' component={UserProfile}/>
                <Route exact path='/resetPass' component={ResetPass}/>
                <Route exact path='/resetPass/:token' component={NewPass}/>
                <Redirect to="/notFound"/>
            </Switch>
        </>
    )
}

const App = () => {
    const [state,dispatch] = useReducer(reducer,initialState)
    return (
        <>
            <UserContext.Provider value={{state,dispatch}}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/notFound" component={ErrorPage}/>
                        <Route component={Routing}/>
                    </Switch>
                </BrowserRouter>
            </UserContext.Provider>
        </>
    );
}

export default App