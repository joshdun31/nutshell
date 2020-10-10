import React, { useState ,useEffect, useContext} from 'react'
import { Link } from 'react-router-dom';
import {UserContext} from '../../App'
import M from 'materialize-css';
import options from 'materialize-css';
import LoadingPage from './LoadingPage'
 
const Home=(()=>{
    const [fav,setFav]=useState('favorite_border')
    const [favprev,setFavprev]=useState('favorite_border')
    const [data,setData]=useState([])
    const [load,setLoad]=useState(false)
    const {state,dispatch}=useContext(UserContext)

      var elems = document.querySelectorAll('.dropdown-trigger');
      var instances = M.Dropdown.init(elems, options);
      
    const favclick=()=>{
        if(fav=='favorite_border')
        {
            setFavprev(fav)
            setFav('favorite')
        }
        else
        {
            setFavprev(fav)
            setFav('favorite_border')
        }
        
    }

    useEffect(()=>{
        fetch('/allpost',{
          headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
          setData(result.posts)
          setLoad(true)
        })
    },[data])

    const likepost=(id)=>{
      fetch('/like',{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          postId:id
        }) 
      })
      .then(res=>res.json())
      .then(result=>{
        const newData=data.map(item=>{
          if(item._id==result._id)
          {
            return result
          }
          else{
            return item
          }
        })
        setData(newData)
      }).catch(err=>{
        console.log(err)
      })
    }

    const unlikepost=(id)=>{
      fetch('/unlike',{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          postId:id
        }) 
      }).then(res=>res.json())
      .then(result=>{
        const newData=data.map(item=>{
          if(item._id==result._id)
          {
            return result
          }
          else{
            return item
          }
        })
        setData(newData)
      }).catch(err=>{
        console.log(err)
      })
    }
      const makecomment=(text,postId)=>{
        fetch("/comment",{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                text:text,
                postId:postId
            })
        }).then(res=>res.json())
        .then(result=>{
          console.log(result)
            const newData=data.map(item=>{
              if(item._id==result._id)
              {
                return result
              }
              else{
                return item
              }
            })
            setData(newData)
        }).catch(err=>{
          console.log(err)
        })
      }

      const deletepost=(postid)=>{
        fetch('/deletepost/'+postid,{
          method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
          const newData=data.filter(item=>{
            return item._id!=result._id
          })
          setData(newData)
          M.toast({html:result.message,displayLength:1500,classes:'toast'})
        })
      }
      const deletecomment=(commentId,postId)=>{
        fetch('/deletecomment',{
          method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
              commentId,
              postId
          })
        }).then(res=>res.json())
        .then(result=>{
          const newData=data.filter(item=>{
            return item._id!=result._id
          })
          setData(newData)
          M.toast({html:"Comment deleted",displayLength:1500,classes:'toast'})
        })
      }   

    return(
      <>
      {
        load?
        <div>
            {data.map(item=>{
              return(
                <div>
                <div className="post-layout">
                <div>
                  <div className="post">
                    <div className="profile">
                      <img src={item.postedby.profilePic}/>
                      <Link to={'/othersprofile/'+item.postedby._id} style={{color:"black"}}><p>{item.postedby.name}</p></Link>
                      {(()=>{if(item.postedby._id==state._id){
                        return(
                          <i class="small material-icons" onClick={()=>deletepost(item._id)}>delete</i>
                        )
                      }})()}
                      
                    </div>
                  </div>
                    <div>
                      <img onDoubleClick={()=>{item.likes.includes(state._id)?unlikepost(item._id):likepost(item._id)}} alt="No photo" className="post-image" src={item.photo}/>
                    </div>
                    <div class="post-content">
                      <div className="post-content1">
                      {
                        item.likes.includes(state._id)?<i class="small material-icons pink-text favorite" onClick={()=>unlikepost(item._id)}>favorite</i>
                        :<i class="small material-icons pink-text favorite" onClick={()=>likepost(item._id)}>favorite_border</i>
                      }
                        
                        <h6>{item.likes.length} likes</h6>
                      </div>
                      <h6 className="post-content2">{item.body} </h6>
                    </div>
                    <div class="comments input-field">
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        makecomment(e.target[0].value,item._id);
                        e.target[0].value='';
                    }}>
                      <input type="text" placeholder="Add a comment"></input>
                      <button type="submit" className="btn-small but-post white pink-text"><i class="large material-icons">send</i></button>
                      </form>
                      <div className="comment-profile">
                      {
                        item.comments.map(record=>{
                          return(<div>
                            <p className="profile-name" style={{fontSize:"17px",margin:"auto 3px",fontWeight:"bold"}}>{record.commentBy.name}</p>
                            <p class="comment-text" style={{fontSize:"14px",display:"flex-inline",maxWidth:"380px",margin:"auto 4px"}}>{record.text}</p>
                            {(()=>{if(record.commentBy._id==state._id){
                              return(
                                <i class="small material-icons" style={{fontSize:"17px",position:"absolute",right:"32px",marginTop:"5px",cursor:"pointer"}} onClick={()=>deletecomment(record._id,item._id)}>delete</i>
                              )
                            }})()}
                            </div>
                          )
                        })
                      }
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )
            })
            }
            <div class="fixed-action-btn">
            <Link to="/create" class="btn-floating btn-large pink lighten-1" >
                <i class="large material-icons">add</i>
            </Link>
        </div>  
  
        </div>
        :
        <LoadingPage/>
          }
          </>
    )
})
export default Home;