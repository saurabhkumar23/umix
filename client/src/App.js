import React from 'react'
import {BrowserRouter,Route} from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar'
import Home from './components/screen/Home';
import Login from './components/screen/Login';
import Signup from './components/screen/Signup';
import Profile from './components/screen/Profile';
import CreatePost from './components/screen/CreatePost';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Navbar/>
                <Route exact path='/' component={Home}/>
                <Route path='/login' component={Login}/>
                <Route path='/signup' component={Signup}/>
                <Route path='/profile' component={Profile}/>
                <Route path='/create' component={CreatePost}/>
            </BrowserRouter>
        </>
    );
}

export default App