const postdata=()=>{
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

<button style={{margin:"25px auto 10px auto",display:"flex"}} type="submit" onClick={()=>posdata()} className="btn-small pink lighten-1 but">Post</button>