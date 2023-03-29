import {useState, useEffect, useRef, useContext} from "react"
import { useSearchParams, useNavigate } from "react-router-dom";
import Add from "./add";
import AuthContext from "../context/AuthContext";
import  Dough  from "./DoughnutChart";
import Chart from "./VerticalChart";
import Trans from "./Trans";

export default function Member(){
    const {member,setMember, setSuccess,setErr,setToggle} = useContext(AuthContext)
    const [isModal,setIsModal] =useState(false)
    const [del,setDelete] = useState(false)
    const [searchParams] = useSearchParams();
    const modal = useRef()
    const delModal = useRef()
    const [isDelModal, setIsDelModal] = useState(false)
    const id = searchParams.get("id");
    const navigate = useNavigate();
    const [mode, setMode] = useState("chart")

    
    const get_member_data = async() => {
        let response = await fetch(`http://127.0.0.1:8000/api/member/${id}`)
        let data = await response.json()
        setMember(data)
        console.log(data)
    }

    function handleClick() {
        setIsModal(true)
    }
    function handleDeleteClick() {
        setIsDelModal(true)
    }

    useEffect(()=>{
        setToggle("members")
        get_member_data()
        const delHandler = (event)=>{
            if (!delModal.current){
                return
            }
            if (!delModal.current.contains(event.target)) {
                setIsDelModal(false)
            }
        }
        document.addEventListener("click", delHandler, true)
        
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
        document.removeEventListener("click", delHandler);
    };
    },[])

    function closefunction(){
        setIsModal(false)
        setErr(false)
        setSuccess(false)
        setIsDelModal(false)
    }

    async function handleDelete(){
        setIsDelModal(false)
        let response = await fetch(`http://127.0.0.1:8000/api/member/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        })
        let data = await response.json()
        setDelete(data)
        setTimeout(()=>{
            setDelete(false)
            navigate('/members');
        },2000)
    }

    if (!Object.keys(member).length) {
        return (
            <h1>Loading...</h1>
        )
    }
    const ele = !member.err?member.trans.map((tran)=>(
        <Trans key={tran.id} tran={tran} type={"member"} /> 
    )):
    <h1>No Transaction yet</h1>
    return(
        <div className="s-member-main">
            {isModal &&<div className="member-outer"> 
                <div className="add-member-div" ref={modal}>
                <button onClick={closefunction} className="add-close">×</button>
                <Add type={"edit"} id={member.member.id} />
                </div>
            </div>}
            {isDelModal && 
                <div className="member-outer">
                    <div className="add-member-div" id="delete-confirmation" ref={delModal}>
                        <h2>Are you sure to Delete</h2>
                        <div className="delete-butts">
                            <button className="del-butt-confirm" onClick={handleDelete}>
                                Delete
                            </button>
                            <button className="del-butt-cancel" onClick={closefunction}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
            {del && <div className="delete">
                <h2>{del}</h2>
            </div>}
                
            <div className="member-details-div">
                
                <div className="member-details">
                    <h2>{member.member.name}</h2>
                    <p>Phone: {member.member.phone}</p>
                    <p>Address: {member.member.address}</p>
                    <p>Age: {member.member.age}</p>
                </div>
                <div className="books-detail">
                    <div className="books-issue-count">
                        <h3>Total Books Issued: <span id="count">{member.books_issued}</span></h3>
                    </div>
                    <div className="books-return-count">
                        <h3>Total Books Returned: <span id="count">{member.books_returned}</span></h3>
                    </div>
                </div>
                <div className="butt-div">         
                    <button id="member-edit" onClick={handleClick}>EDIT</button>
                    <button id="member-delete" onClick={handleDeleteClick}>DELETE</button>
                </div>
                
            </div>
            <div className="member-bottom-div">
                <div className="member-bottom">
                <div className="member-bottom-header">
                    <div onClick={()=>setMode("chart")} className={mode === "chart"?"button-chart active-button":"button-chart"}>Chart</div>
                    <div onClick={()=>setMode("trans")} className={mode === "trans"?"button-trans active-button":"button-trans"}>Transaction</div>
                </div>
                {mode === "chart"? 
                (<div className="member-bottom-chart-inner"> 
                    <div className="line-chart-div">
                        <Chart data={member.chart}/>
                    </div>
                    <div className="pie-chart-div">
                        <Dough issue={member.books_issued} return={member.books_returned}/>
                    </div>
                </div>) :
                (<div className="member-bottom-trans-inner">
                    {ele}
                </div>)
                }
                </div>
            </div>
        </div>
    )
}