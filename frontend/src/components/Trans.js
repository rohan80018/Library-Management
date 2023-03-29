import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Trans(props) {
    const {setMember} = useContext(AuthContext)
    const style = {
        border: props.tran.returned === true ? "2px solid green":"2px solid red" ,
        backgroundColor: props.tran.returned === true ? "#d5ffc9":"#ffc9c9",
        borderRadius: "9px",
    }
    const spanStyle = {
        color:props.tran.returned === true?"green":"red",
        fontWeight:"700",
    }
    let date = props.tran.book_issue_date.split("T")

    

    // console.log(props.id)
    console.log(props.tran)
    return (
        <div className="trans-main">
            <div className="trans-div" style={style}>
                <div className="trans-inner">{props.tran.return_date?`${date[0]} to ${props.tran.return_date.split("T")[0]}`:date[0]}</div>
                <div className="trans-inner">{props.tran.title}</div>
                {!props.type  && <div className="trans-inner" >
                    <Link id="member-link" to={`/members/member?id=${props.tran.member_id_id}`}>
                        {props.tran.name}
                    </Link>
                    </div>}
                <div className="trans-inner">{props.tran.returned === true? "Returned": "Issued"}</div>
                <div className="trans-inner"><span style={spanStyle}>{props.tran.returned === true ? `+${props.tran.paid_balance}`:`-${props.tran.outstanding_balance}`}</span></div>
            </div>
            <br></br>
        </div>
    )
}