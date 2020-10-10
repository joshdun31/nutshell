import React from 'react';
import M from 'materialize-css';
import options from 'materialize-css';
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import {useContext,useRef,useEffect,useState} from 'react'

const Navbar=(()=>{
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, options);
      });

      const searchModal=useRef(null)
      const [searchResult,setSearchResult]=useState([])
      useEffect(()=>{
        M.Modal.init(searchModal.current)
      },[])
      const [search,setSearch]=useState('')

      const {state,dispatch}=useContext(UserContext)
      const history=useHistory()

        

      const logout=()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        M.toast({html:"Logged out successfully",displayLength:1000})
        history.push('/signin')
      }

      const render=()=>{
          if(state)
          {
              return[
                  <div>
                  <li><Link to="/" className="text-link"><i class="large material-icons">home</i></Link></li>
                  <li><Link><i class="large material-icons modal-trigger" data-target="modal1">search</i></Link></li>
                  <li><Link to="/profile" className="text-link"><i class="large material-icons">account_circle</i>
                  </Link></li>
                  <li onClick={()=>logout()} className="text-link logout">Log Out</li>
                </div>
              ]
          }
          else{
              return[
                  <div>
                <li><Link to="/signin" className="text-link">Sign in</Link></li>
                <li><Link to="/signup" className="text-link">Sign up</Link></li>
                </div>
              ]
          }
      }
      const sidenav=()=>{
        if(state)
        {
            return[
                <div><li><Link to="/" className="text-link"><i class="small material-icons">home</i>Home</Link></li>
                <li><Link className="text-link  modal-trigger" data-target="modal1"><i class="small material-icons"  >search</i>Search</Link></li>
                <li><Link to="/profile" className="text-link"><i class="small material-icons">account_circle</i>Profile</Link></li>
                <li><Link to="/signin" onClick={()=>logout()} className="text-link"><i class="small material-icons">person</i>Log out</Link></li>
                </div>
            ]
        }
        else{
            return[
                <div>
                <li><Link to="/signin" className="text-link"><i class="small material-icons">person</i>Sign in</Link></li>
                <li><Link to="/signup" className="text-link"><i class="small material-icons">person_outline</i>Sign up</Link></li>
              </div>
            ]
        }
      }

      const fetchuser=(query)=>{
        setSearch(query)
        if(query)
        {
        fetch('/search-user',{
          method:"post",
            headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(result=>{
          setSearchResult(result)
        })
      }
      else{
        setSearchResult([])
      }
      }

    return(
        <div>
        <div className="" id="navi">
        <nav className="nav-color" >
        <div className="nav-wrapper pink lighten-1 z-depth-2 ">
            <Link to={state?"/":"/signin"} className="brand-logo text-link">Nutshell</Link>
           
            <a href="#" data-target="mobile" className="sidenav-trigger text-link"><i className="material-icons">menu</i></a>
            <ul className="right hide-on-med-and-down">
            {render()}
            </ul>
        </div>
        </nav>
        </div>
        
        <div id="modal1" className="modal" ref={searchModal}>
          <div className="modal-content input-field modal-fixed-footer">
            <input type="text" placeholder="Search users" value={search} onChange={(e)=>{
              fetchuser(e.target.value)}}></input>
              
              {searchResult.map(res=>{
                return(
                  <ul class="collection">
                  <Link to={'/othersprofile/'+res._id} className="black-text" onClick={()=>{
                    M.Modal.getInstance(searchModal.current).close()
                    setSearchResult([])
                    setSearch('')
                  }}><li class="collection-item" style={{padding:"2px"}}><img src={res.profilePic} style={{width:"25px",height:"25px",borderRadius:"12.5px",margin:"auto 10px",border:"0.2px solid #ddd"}}></img><p style={{fontSize:"15px",display:"inline-flex"}}>{res.name}</p></li></Link>
                  </ul>
                )
              })

              }
              
          </div>
          <div className="modal-footer">
            <button className="modal-close btn-flat" onClick={()=>{
              setSearchResult([])
              setSearch('')}}>Close</button>
          </div>
        </div>

        <ul className="sidenav sidenav-close" id="mobile"><br/>
        <Link to={window.location}><i class="small material-icons text-link">arrow_back</i></Link>
        {sidenav()}
        </ul>
        </div>
    )
})

export default Navbar;