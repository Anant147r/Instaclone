import React,{useState,useContext} from "react"
import {Link,useHistory} from "react-router-dom"
import {UserContext} from "../../App"
import M from "materialize-css"

const Login=()=>{
    const{state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const[password,setPassword]=useState("");
    const[email,setEmail]=useState("");
    
    const PostData=()=>{
        // if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        // {
        //     M.toast({html:"Enter valid email",classes:"#b71c1c red darken-4"});
        //     return;
        // }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error)
                {
                    M.toast({html:data.error,classes:"#b71c1c red darken-4"})
                }
                else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"signed in",classes:"#388e3c green darken-2"})
                    history.push("/");
                }
        }).catch(err=>{
            console.log(err);
        })
    }

    return(
       <div className="mycard">
           <div className="card auth-card">
            <h2>Instagram</h2>
            <input 
                type="text" 
                placeholder="email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
            />
            <input 
                type="password" 
                placeholder="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
            />
            <button 
                className="btn waves-effect waves-light #6a1b9a purple darken-3"
                onClick={()=>PostData()}
                >Login</button>
            <h5>
                <Link to="/signup">Don't have an accout</Link>
            </h5>
            </div>
       </div>
    )
}

export default Login