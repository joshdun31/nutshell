import React from 'react'
import AppFooter from './AppFooter'
import {useState,useEffect} from 'react'
import M from 'materialize-css'
import {Link,useHistory} from 'react-router-dom'
import Footer from '../Footer'

const CreatePost=()=>{
    const [body,setBody]=useState('')
    const [image,setImage]=useState('')
    const [url,setUrl]=useState('')
    const history=useHistory()

    useEffect(()=>{
        if(url)
        {
            console.log("inside")
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    body,
                    photo:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error)
                {
                    M.toast({html:data.error,displayLength:1000})
                }
                else{
                    M.toast({html:"Posted successfully",displayLength:1000})
                    history.push('/')
                }
            })
        }
    },[url]);

    const posdata=()=>{
        console.log("Image uploading")
        const filedata=new FormData()
        filedata.append("file",image)
        filedata.append("upload_preset","insta-clone")
        filedata.append("cloud_name","dkmxj6hie")
        fetch("	https://api.cloudinary.com/v1_1/dkmxj6hie/image/upload",{
            method:"post",
            body:filedata
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    return(
        <div>
        <div style={{position:"relative"}}>
            <div className="create-post">
            {(()=>{if(image){
                const imgsrc=URL.createObjectURL(image)
                    return(<img className="create-image" style={{maxWidth:"430px",maxHeight:"400px",display:"flex",border:"1px solid #999",marginBottom:"10px"}} src={imgsrc}></img>
                    )
            }})()}
            {(()=>{if(body){
                    return(<h6 style={{marginBottom:"10px",marginTop:"0"}}>{body}</h6>
                    )
            }})()}
            <div class="file-field input-fieeld">
              <div class="btn but-hover">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>  
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text" placeholder="Upload file"/>
              </div>
            </div>
            <input type="text" value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Description"></input>
            <button className="btn" style={{margin:"10px 0"}} onClick={()=>posdata()} type="submit">Post</button>
            </div>
        </div>
        </div>
    )
}

export default CreatePost