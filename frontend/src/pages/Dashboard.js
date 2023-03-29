import {useContext, useEffect} from "react"
import { Link } from "react-router-dom"
import AuthContext from "../context/AuthContext"

export default function Dashboard(){

    const {setState,url,setToggle,get_details,details} = useContext(AuthContext)

    useEffect(() => {
        get_details()
        url()
    },[])

    return(
        <div className="dash-main">
            <div className="issue-return">
                <Link to="/issue_books">
                    <button id="issue-but">Issue Book</button>
                </Link>
                <Link to="/return_books">
                    <button id="return-but">Return Book</button>
                </Link>
            </div>
            <div className="dash-center">
                <div className="dash-center-grid-top">
                    <Link to="/books">
                    <div onClick={()=>setToggle("books")} className="total-books">
                        <h2>Total Books</h2>
                        <p id="dash-p">{details.books}</p>
                    </div>
                    </Link>
                    <Link to="/members">
                    <div onClick={()=> setToggle("members")} className="total-members">
                        <h2>Total Members</h2>
                        <p id="dash-p">{details.members}</p>
                    </div>
                    </Link>
                </div>
                
                <div className="dash-center-grid-bottom">
                    <Link to="/transactions">
                    <div onClick={()=>setState("issued")} className="issued">
                        Books Issued {details.issued_books}
                    </div>
                    </Link>
                    <Link to="/transactions">
                    <div onClick={()=>setState("returned")} className="returned">
                        Books Returned {details.returned_books}
                    </div>
                    </Link>
                    <Link to="/transactions">
                    <div onClick={()=>setToggle("transactions")} className="dash-tran">
                        Transactions
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}