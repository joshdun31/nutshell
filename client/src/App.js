import React from 'react';
import './App.css';
import Navbar from './components/Navbar'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home';
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import Footer from './components/Footer'
import UserEdit from './components/screens/UserEdit'
import CreatePost from './components/screens/CreatePost' 
import $ from 'jquery'
import {useState,useReducer,useEffect,createContext,useContext} from 'react'
import {initialstate,reducer} from './components/reducers/userReducer'
import OthersProfile from './components/screens/OthersProfile'

export const UserContext=new createContext()

  const Routing=()=>{
    const history=useHistory()
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
      const user=JSON.parse(localStorage.getItem("user"))
      if(user)
      {
        dispatch({type:"USER",payload:user})
        // history.push('/')
      }
      else
      {
        history.push('/signin')
      }
    },[]);

    return(
      <Switch>
      <Route exact path="/"><Home/></Route>
      <Route path="/signin"><Signin/></Route>
      <Route path="/signup"><Signup/></Route>
      <Route path="/profile"><Profile/></Route>
      <Route path="/create"><CreatePost/></Route>
      <Route path="/othersprofile/:userId"><OthersProfile/></Route>
      <Route path="/edituser"><UserEdit/></Route>
      </Switch>
    )
  }

function App() {
  const [valb,setValb]=useState();
  $(window).scroll(function() {
    const val_now=$(window).scrollTop();
    if (val_now<valb ){  
      $('#navi').addClass("navbar-fixed");
    }
    else {
      $('#navi').removeClass("navbar-fixed");
    }
    setValb(val_now)
  });
  
  const [state,dispatch]=useReducer(reducer,initialstate)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter> 
    <Navbar/>
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
