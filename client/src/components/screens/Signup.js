import React from 'react'
import {Link,useHistory} from 'react-router-dom'
import {useState} from 'react'
import M from 'materialize-css';
import AppFooter from './AppFooter';


const Signup=(()=>{
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [failure,setFailure]=useState(false) 
    const [failcontent,setFailcontent]=useState()
    const history=useHistory()

    const postdata=()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
            {
                setFailcontent(data.error)
                setFailure(true)
                M.toast({html:data.error,displayLength:1000})
            }
            else{
                M.toast({html:data.message,displayLength:1000})
                history.push('/signin')
            }
        })
    }

    // {(()=>{if(failure){
    //     return(<div class="alert alert-danger alert-dismissible fade in">
    //     <a href="#" class="close" onClick={()=>setFailure(false)} data-dismiss="alert" aria-label="close">&times;</a>
    //     <strong>{failcontent}</strong>
    //     </div>)
    // }})()}

    return(
        <div>
       
        <div className="sign-card">
            <div className="card medium mycard">
            <div className="card-content input-field">
                <h3 className="card-title">Sign up</h3>
                <input type="text" className="" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
                <input type="text" className="" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/><br/><br/>
                <button type="submit" onClick={()=>postdata()} className="btn-small pink lighten-1 but" name="action">Sign up</button><br/><br/>
                <h6 className="detail">Already have an account ?</h6><Link to='/signin' className="link">Sign in</Link>
            </div>  
            </div>
        </div>
        <AppFooter/>
        </div>
    )
})
export default Signup;