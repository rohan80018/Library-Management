import {createContext, useState} from "react";

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ children }) => {
    const [toggle, setToggle] = useState("dashboard")
    const [ transaction, setTransaction] = useState({})
    const [err,setErr] = useState(false)
    const [success,setSuccess] = useState(false)
    const [member, setMember] = useState({})
    const [members,setMembers] = useState([])
    const [state,setState] = useState("")

    let member_data = async()=>{
        let response = await fetch("http://127.0.0.1:8000/api/getMembers/")
        let data = await response.json()
        setMembers(data)
    }
    

    function url(){
        let url = window.location.pathname
        console.log(url)
        if (url === "/"){
            setToggle("dashboard")
        }else if (url==="/books"){
            setToggle("books")
        }else if (url.includes("/members")){
            console.log("jhs")
            setToggle("members")
        }else if (url==="/transactions"){
            setToggle("transactions")
        }
    }

    const [ details, setDetails] = useState({})
    const get_details = async() => {
        let response = await fetch("http://127.0.0.1:8000/api/get_details")
        let data = await response.json()
        setDetails(data)
    }
    // transactions.js
    const get_transaction = async() => {
        let response = await fetch("http://127.0.0.1:8000/api/transaction/")
        let data = await response.json()
        setTransaction(data)
    }

    // boooks.js
    const [books, setBooks] = useState({})
    const get_books = async() => {
        let response = await fetch("http://127.0.0.1:8000/api/getBooks")
        let data = await response.json()
        setBooks(data)
    }
    const [booksOnline,setBooksOnline] = useState({})
    async function handleOnline() {
        let response = await fetch(`http://127.0.0.1:8000/api/infinite`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                type:"infinte",
                page:1
            })
        })
        let data = await response.json()
        setBooksOnline(data)
      }  
    
    // books.js
    const [book, setBook] = useState({})

    let [issue, setIssue] = useState(0)
    let [holdBooks, setHoldBooks] = useState([])
    let [cart,setCart] = useState({})
    
    async function handleCart(){
        let response = await fetch(`http://127.0.0.1:8000/api/infinite`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
              type:"cart",
              page:holdBooks})
          })
          let data = await response.json()
        setCart(data)
    }
    
    const [isModal, setIsModal]= useState(false)

    const [returnGetBooks, setReturnGetBooks] = useState({})
    let [holdReturnBooks, setHoldReturnBooks] = useState([])
    async function returnBooks(id){
        let response = await fetch(`http://127.0.0.1:8000/api/return_book/${id}`)
        let data = await response.json()
        setReturnGetBooks(data)
        // console.log(data.books)
      }
    

    const contextData={
        url:url,
        setToggle: setToggle,
        toggle: toggle,
        get_details: get_details,
        details: details,

        get_transaction:get_transaction,
        transaction: transaction,
        state:state,
        setState:setState,

        setErr:setErr,
        err:err,
        success:success,
        setSuccess: setSuccess,
        // handleADDSubmit: handleADDSubmit,

        members:members,
        setMembers:setMembers,
        member_data:member_data,

        // id:id,
        // setId:setId,
        // get_member_data:get_member_data,
        member:member,
        setMember: setMember,

        books:books,
        setBooks:setBooks,
        get_books:get_books,
        booksOnline:booksOnline,
        setBooksOnline:setBooksOnline,
        handleOnline:handleOnline,

        book:book,
        // get_book:get_book,
        setBook:setBook,
        

        // setMemberSelect:setMemberSelect,
        // memberSelect:memberSelect,
        // memberId:memberId,
        // setMemberId:setMemberId,
        issue:issue, setIssue:setIssue,
        holdBooks:holdBooks, setHoldBooks:setHoldBooks,
        isModal:isModal, setIsModal:setIsModal, 
        handleCart:handleCart,
        cart:cart,setCart:setCart,

        returnBooks:returnBooks,
        returnGetBooks:returnGetBooks, setReturnGetBooks:setReturnGetBooks,
        holdReturnBooks:holdReturnBooks, setHoldReturnBooks:setHoldReturnBooks
        

    }
    return (
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
      );
}