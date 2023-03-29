import {useContext, useEffect, useState, useRef} from "react"
import {Link} from "react-router-dom"
import Add from "../components/add"
import AuthContext from "../context/AuthContext"

export default function Members(props){

    const {url,setSuccess,setErr, members,setMembers, member_data, } = useContext(AuthContext)
    const [ searchValue, setSearchValue] = useState("")
    const [isModal,setIsModal] =useState(false)
    const modal = useRef()

    function handleAdd() {
        setIsModal(true)
    }

    useEffect(()=>{
        url()
        member_data()
        const handler = (event) => {
            if (!modal.current) {
                return;
            }
            if (!modal.current.contains(event.target)) {
                setIsModal(false);
                setSuccess(false)
                setErr(false)
            }
        };
        document.addEventListener("click", handler, true);
        return () => {
            document.removeEventListener("click", handler);
        };
    },[])

    function closefunction(){
        setIsModal(false)
        setErr(false)
        setSuccess(false)
    }

    function handleChange(event){
        setSearchValue(event.target.value)
    }
    
    async function handleSubmit(event){
        if (searchValue){
            if (event.key === "Enter" || event.type === "click") {
                let response = await fetch(`http://127.0.0.1:8000/api/search/member/${searchValue}`)
                if (response.status === 204){
                    setMembers({"message":"No Record Found"})
                }else{
                    let data = await response.json()
                    setMembers(data)
                } 
            }   
        }
    }
    
    function handleCloseSearch(){
        setSearchValue("")
        member_data()
    }

    if (!Object.keys(members).length) {
        return (
            <h1>Loading...</h1>
        )
    }

    let memberEle = ""
    if (members.message){
        memberEle=<div id="member-err"><h2>No Record Found</h2></div>
    }else{
        if (props.type==="issueBooks"){
            memberEle = members.map((mem)=>(
                <div key={mem.id} className="per-member" onClick={()=>props.func(mem.id)}>
                    <h2>{mem.name}</h2>
                    <p>Phone: <strong>{mem.phone}</strong></p>
                    <p>Address: <strong>{mem.address}</strong></p>
                    <p>Age: <strong>{mem.age}</strong></p>
                </div>
            ))
        }else{
            memberEle = members.map((mem)=>(
                <Link to={`/members/member?id=${mem.id}`}>
                <div key={mem.id} className="per-member">
                    <h2>{mem.name}</h2>
                    <p>Phone: <strong>{mem.phone}</strong></p>
                    <p>Address: <strong>{mem.address}</strong></p>
                    <p>Age: <strong>{mem.age}</strong></p>
                </div>
                </Link>
            ))
        }
    }
    
    return(
        <div className="member-main">
            {isModal &&<div className="add-member-outer"> <div className="add-member-div" ref={modal}>
                <button onClick={closefunction} className="add-close">×</button>
                    <Add type={"add"}/>
                </div></div>}
            <div className="member-header">
            
                <div className="member-search">
                    <input value={searchValue} onChange={handleChange} onKeyDown={handleSubmit} className="search-member" placeholder="Search Member" />
                    {searchValue?<button className="close-member-search" onClick={handleCloseSearch}>×</button>:""}
                    <button onClick={handleSubmit} className="search-button">Search</button>
                    
                </div>

                {props.type ?"":<button className="add-member"  onClick={handleAdd}>Add Member</button>}
            </div>
            
            <div className="member-body" >    
                {memberEle}
            </div>
        </div>
    )
}