import React from 'react'
import {Link,useHistory} from 'react-router-dom'
import {useState,useContext} from 'react'
import AppFooter from './AppFooter'
import M from 'materialize-css'
import {UserContext} from '../../App'



const Signin=(()=>{
    const {state,dispatch}=useContext(UserContext)

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const history=useHistory()

    const postdata=()=>{
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
            {
                M.toast({html:data.error,displayLength:1000})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:data.message,displayLength:1000})
                history.push('/')
            }
        })
    }
    return(
        <div>
        <div className="sign-card"> 
            <div className="card medium mycard">
            <div className="card-content input-field">
                <h3 className="card-title">Sign in</h3>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/><br/><br/>
                <button type="submit" onClick={()=>postdata()} className="but btn-small pink lighten-1">Sign in</button><br/><br/>
                <h6 className="detail">Don't have an account ?</h6><Link to='/signup' className="link">Sign up</Link>
            </div>  
            </div>
        </div>
        <AppFooter/>
        </div>
    )
})
export default Signin;