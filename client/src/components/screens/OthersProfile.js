import React,{ useState ,useEffect,useContext} from 'react'
import Footer from '../Footer'
import {UserContext} from '../../App'
import { Link,useHistory, useParams} from 'react-router-dom';
import $ from 'jquery'
import M from 'materialize-css';
import options from 'materialize-css';
import LoadingPage from './LoadingPage'

const Profile=(()=>{
    const {state,dispatch}=useContext(UserContext)
    const [mypics,setPics]=useState([])
    const history=useHistory()
    const [proname,setProname]=useState()
    const [probio,setProbio]=useState()
    const [propic,setPropic]=useState()
    const {userId}=useParams()
    const [userProfile,setProfile]=useState(null)
    const [followers,setFollowers]=useState([])
    const [following,setFollowing]=useState([])

    var users;
    useEffect(()=>{
        if(userId==state._id)
        {
            history.push('/profile')
        }
        else
        {

            fetch(`/otherspost/${userId}`,{
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
              setPics(result.posts)
              setProfile(result)
                setProname(result.name)
                setPropic(result.profilePic)
                setProbio(result.bio)
                setFollowers(result.followers)
                setFollowing(result.following)
                
            })
        }
    },[followers])

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
      });


      $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })


    const followProfile=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              followId:userId
            }) 
          })
          .then(res=>res.json())
          .then(result=>{
              if(result.error)
              {
                M.toast({html:result.error,displayLength:1500})
              }
              else{
                //history.push('/othersprofile/'+userId)
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem("user",JSON.stringify(result))
                setFollowers([...followers,result._id])
                //console.log(result)
                M.toast({html:"Profile followed",displayLength:1500,classes:'toast'})
              }
          }).catch(err=>{
            console.log(err)
          })
      }

      const unfollowProfile=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              followId:userId
            }) 
          })
          .then(res=>res.json())
          .then(result=>{
              if(result.error)
              {
                M.toast({html:result.error,displayLength:1500,classes:'toast'})
              }
              else{
                //history.push('/othersprofile/'+userId)
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem("user",JSON.stringify(result))
                const newFollower =followers.filter(item=>item != result._id )
                setFollowers(newFollower)
                M.toast({html:"Profile unfollowed",displayLength:1000,classes:'toast'})
                
              }
          }).catch(err=>{
            console.log(err)
            M.toast({html:"Error Occurred",displayLength:1000,classes:'toast'})
          })
      }

    return(
        <>
        {
        userProfile?
        <div>
        <div className="profile-page">
            <div style={{display:"flex",justifyContent:"space-around",backgroundColor:"#f5f5f5"}}>
                <div>
                <img className="profile-photo" src={propic}/>
                </div>
                <div>
                    <h4>{proname}</h4>
                    <h6>{probio}</h6>
                    <div style={{display:"flex",justifyContent:"space-around",width:"107%"}}>
                    <h6>{mypics.length} posts</h6>
                    <h6>{followers.length} followers</h6>
                    <h6>{following.length} following</h6>
                  </div>
                 
                  {
                    followers.includes(state._id)?<h5 class="btn pink lighten-1" onClick={()=>unfollowProfile()}>Unfollow</h5>
                    :<h5 class="btn pink lighten-1" onClick={()=>followProfile()}>Follow</h5>
                  }
                  
                </div>
            </div>
            <div className="all-posts" style={{borderTo0p:"1px solid black"}}>
            {
                mypics.map(item=>{
                    return(
                        <img className="item" src={item.photo} alt="Loading..."></img>
                    )
                })
            }   
            </div>
            </div>

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
export default Profile;