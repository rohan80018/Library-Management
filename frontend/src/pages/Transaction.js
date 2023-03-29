import {useContext, useEffect} from "react"
import AuthContext from "../context/AuthContext"
import Trans from "../components/Trans"

export default function Transactions(){
    const {state, setState,url, details,get_transaction, transaction} = useContext(AuthContext)

    useEffect(()=>{
        get_transaction()
        url()
    },[])

    if (!Object.keys(transaction).length) {
        return (
            <h1>Loading...</h1>
        )
    }
    // console.log(transaction)
    const ele = transaction.trans.map((tran) => ( 
        <Trans key={tran.id} tran={tran} id={tran.member_id_id} err={transaction.err}/>
    ))

    const issued_page = transaction.trans.filter(tran => tran.returned === false).map((tran)=>(
        <Trans key={tran.id} id={tran.member_id_id} tran={tran} err={transaction.err}/>
    )) 
    
    const return_page = transaction.trans.filter(tran => tran.returned === true).map((tran)=>(
        <Trans key={tran.id} id={tran.member_id_id} tran={tran} err={transaction.err}/>
    )) 
    

    return(
        <div className="transactions">
            <div className="transaction-header">
                {state ==="issued"?
                    <div className="all-transaction" onClick={()=>setState("")}>
                        All Transactions
                    </div>:
                    <div onClick={()=>setState("issued")} className="issued">
                        Books Issued {details.issued_books}
                    </div>
                }
                {state === "returned"?
                    <div className="all-transaction" onClick={()=>setState("")}>
                        All Transactions
                    </div>:
                    <div onClick={()=>setState("returned")} className="returned">
                        Books Returned {details.returned_books}
                    </div> 
                }   
            </div>
            <h2>{state === "issued"? "Books Issued": state==="returned"? "Books Returned": "All Transaction"}</h2>
            
            {state === "issued"? 
                <div className="outstanding">
                    Total Oustanding: {transaction.total_outstanding}
                </div>: state ==="returned"?
                <div className="paid">
                    Total Paid Off: {transaction.total_paid}
                </div>:
                <div className="total">
                <div className="outstanding">
                    Total Oustanding: {transaction.total_outstanding}
                </div>
                <div className="paid">
                    Total Paid Off: {transaction.total_paid}
                </div>
                </div>
                }
            
            <div className="transaction-bottom">
                {state === "issued"? issued_page: state==="returned"? return_page:ele}
            </div>
        </div>
    )
}