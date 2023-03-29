import {useContext, useState}from "react";
import AuthContext from "../context/AuthContext";

export default function Add (props) {

    let {err,setErr,success,setSuccess,setMembers,setMember,member} = useContext(AuthContext)
    let mem = member.member
    
    const [input,setInput] = useState({
        name:props.type==="edit" ? mem.name:"",
        phone:props.type==="edit"? mem.phone:"",
        address:props.type==="edit" ? mem.address:"",
        age:props.type==="edit" ? mem.age:""
    })
    

    async function handleSubmit(event){
        event.preventDefault()
        if(props.type==="add"){
        let response = await fetch("http://127.0.0.1:8000/api/getMembers/",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                name:event.target.name.value,
                phone:event.target.phone.value,
                address:event.target.address.value,
                age:event.target.age.value
            })
        })
        let data = await response.json()
        if (response.status === 400){
            setErr(data)
        }else if (response.status === 201){
            setErr({})
            setSuccess(data)
            setMembers(data.data)
        }}else if (props.type==="edit"){
            let response = await fetch(`http://127.0.0.1:8000/api/member/${props.id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                name:input.name,
                phone:input.phone,
                address:input.address,
                age:input.age
                })
            })
            let data = await response.json()
            if (response.status === 400){
                setErr(data)
            }else if (response.status === 201){
                console.log(data.member)
                setMember({...member,member:data.member})
                setSuccess(data)
                setErr({})
            }
        }
    }
    
    
    
    function handleChange(event) {
        const  {name,value} = event.target
        setInput(prev=>{
            return({
                ...prev,
            [name]:value
            })
        })
    }

    return (
            <div> 
                {success ? 
                (
                    <div className="success-member">
                        <h2>
                            {success.message}
                        </h2>
                    </div>
                ):
                    
                <form onSubmit={handleSubmit}>
                    <div className="add-div">
                    {err && <span id="err">{err.message}</span>}
                    <div className="input-group-1">
                        <input className="input-1" onChange={handleChange} type="text" value={input.name} name="name" />
                        <label className="label-1">Name</label>
                    </div>
                    {/* <input id="member-name" onChange={handleChange} type="text" value={input.name} name="name" placeholder="Name"/> */}
                    <div className="input-group-1">
                        <input className="input-1" onChange={handleChange} type="text" value={input.phone} name="phone" />
                        <label className="label-1">Phone No.</label>
                    </div>
                    <div className="input-group-1">
                        <input className="input-1" onChange={handleChange} type="text" value={input.address} name="address" />
                        <label className="label-1">Address</label>
                    </div>
                    <div className="input-group-1">
                        <input className="input-1" onChange={handleChange} type="text" value={input.age} name="age" />
                        <label className="label-1">Age</label>
                    </div>
                    {/* <input id="member-phone" onChange={handleChange} type="text" name="phone" value={input.phone} placeholder="Phone Number"/>
                    <input id="member-address" onChange={handleChange} type="text" name="address" value={input.address} placeholder="Address"/>
                    <input id="member-age" onChange={handleChange} type="number" name="age" value={input.age} placeholder="Age"/> */}
                    </div>
                    <button className="modal-addMember">{props.type==="add"?"Add Member":"Submit"}</button>
                </form>
            }
        </div>
        
    )
}