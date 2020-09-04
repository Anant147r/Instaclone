import React,{useEffect,useState,useContext} from "react"
import {useParams} from "react-router-dom"
import {UserContext} from "../../App"
const UserProfile=()=>{
    const[userProfile,setProfile]=useState(null);
    const {state,dispatch} = useContext(UserContext)
    const {userid} =useParams()
    const [showfollow,setShowFollow]=useState(true);
    //console.log(userid)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setProfile(result)
        })
    },[])

    const followUser=()=>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            dispatch({type:"UPDATE",payload:{
                following:data.following,
                followers:data.followers
            }})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[
                            ...prevState.user.followers,data.id
                        ]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUser=()=>{

        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            dispatch({type:"UPDATE",payload:{
                following:data.following,
                followers:data.followers
            }})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                
                const newFollower=prevState.user.followers.filter(item=>item!=data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return(
        <>
        {userProfile?     
        
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{
                        width:"160px",
                        height:"160px",
                        borderRadius:"80px"
                        }}
                        src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=335&q=80"/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"109%"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} followings</h6>
                    </div>

                    {
                        showfollow
                        ?
                        <button 
                            className="btn waves-effect waves-light #6a1b9a purple darken-3"
                            onClick={()=>followUser()}
                        >
                        Follow
                        </button>
                        :
                        <button 
                            className="btn waves-effect waves-light #6a1b9a purple darken-3"
                            onClick={()=>unfollowUser()}
                        >
                        Unfollow
                        </button>
                    }
                   

                    

                </div>
            </div>
            
            <div className="gallary">

                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }

                

            </div>
        </div>
            :
            <h2>Loading .....</h2>}
        
        </>
    )
}

export default UserProfile