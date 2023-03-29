import {useContext} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Sidebar() {
    const {setState,toggle, setToggle} = useContext(AuthContext)

    function clickHandler(mode){
        if (mode==="transactions"){
            setToggle(mode)
            setState(mode)
        }else if (mode === "members"){
            setToggle(mode)
        }
    }

    return (
    <div className="sidebar">
        <div className="main">
            <h2>Library Management</h2>
            <div className="buttons">
                <Link to="/">
                    <div onClick={()=> setToggle("dashboard")} className={toggle==="dashboard"?"sidebar-dashboard active":"sidebar-dashboard"}>
                        Dashboard
                    </div>
                </Link>
                <Link to="/books">
                    <div onClick={()=> setToggle("books")} className={toggle==="books"?"sidebar-books active":"sidebar-books"}>
                        Books
                    </div>
                </Link>
                <Link to="/members">
                    <div onClick={()=> clickHandler("members")} className={toggle==="members"?"sidebar-members active":"sidebar-members"}>
                        Members
                    </div>
                </Link>
                <Link to="/transactions">
                    <div onClick={()=>clickHandler("transactions")} className={toggle==="transactions"?"sidebar-transactions active":"sidebar-transactions"}>
                        Transactions
                    </div>
                </Link>
            </div>
        </div>
    </div>
    )
}

