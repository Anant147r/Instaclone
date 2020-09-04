import React,{useState} from "react"
import {Link,useHistory} from "react-router-dom"
import M from "materialize-css"

const Signup=()=>{
    const history=useHistory();
    const[name,setName]=useState("");
    const[password,setPassword]=useState("");
    const[email,setEmail]=useState("");
    
    const PostData=()=>{
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            M.toast({html:"Enter valid email",classes:"#b71c1c red darken-4"});
            return;
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email
            })
            }).then(res=>res.json())
            .then(data=>{
                //console.log(data)
                if(data.error)
                {
                    M.toast({html:data.error,classes:"#b71c1c red darken-4"})
                }
                else{
                    M.toast({html:data.message,classes:"#388e3c green darken-2"})
                    history.push("/login");
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
            placeholder="name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
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
            onClick={()=>{PostData()}}
            >Signup</button>
            <h5>
                <Link to="/login">Already have an account</Link>
            </h5>
            </div>
       </div>
    )
}

export default Signup