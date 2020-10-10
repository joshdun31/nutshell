import React,{ useState ,useEffect,useContext} from 'react'
import Footer from '../Footer'
import {UserContext} from '../../App'
import { Link,useHistory} from 'react-router-dom';
import $ from 'jquery'
import M from 'materialize-css';
import options from 'materialize-css';
import LoadingPage from './LoadingPage'

const Profile=(()=>{
    const {state,dispatch}=useContext(UserContext)
    const [mypics,setPics]=useState([])
    const history=useHistory()
    const [load,setLoad]=useState(false)
    const [profileimage,setProfileimage]=useState('')
    const [url,setUrl]=useState('')

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
            setProfileimage(result.profilePic)
            setLoad(true)
        })
    },[])

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
      });

    return(
      <>
      {
      load?
        <div>
        <div className="profile-page">
            <div style={{display:"flex",justifyContent:"space-around",backgroundColor:"#f5f5f5"}}>
                <div>
                <img className="profile-photo" src={state.profilePic}/>
                </div>
                <div>
                    <h4>{state.name}</h4>
                    <h6>{state.bio}</h6>
                    <div style={{display:"flex",justifyContent:"space-around",width:"107%"}} class="post-followers">
                    <h6>{mypics.length} posts</h6>
                    <h6>{state.followers.length} followers</h6>
                    <h6>{state.following.length} following</h6>
                  </div>
                </div>
                <Link to="/edituser"><button style={{marginTop:"25px"}} class="btn-small pink lighten-1 modal-trigger"><i class="small material-icons edit-profile">edit</i></button></Link>
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