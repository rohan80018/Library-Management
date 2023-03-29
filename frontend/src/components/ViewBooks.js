import {useEffect,useState, useContext,useRef } from "react"
import AuthContext from "../context/AuthContext"
import {nanoid} from"nanoid"
import BookDiv from "./BookDIv"

export function ViewBook(props) {
  let {books, issue, setIssue,holdBooks, setHoldBooks, setIsModal, isModal, cart,setCart} = useContext(AuthContext)
  let [div ,setDiv] = useState(newDiv)
  let [success, setSuccess] = useState(false)  
  let [ssue, setSsue] = useState(props.canIssue)
  setIssue(ssue)
  const modal = useRef()

  useEffect(()=>{
    setDiv(newDiv)
    const handler = (event) =>{
      if (!modal.current) {
        return;
      }
      if (!modal.current.contains(event.target)) {
        setIsModal(false)
      }
    }
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler)
    };
  },[books,holdBooks])
  
  async function handleIssueBook(){
    let response = await fetch(`http://127.0.0.1:8000/api/issue_books/${props.memberId}`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({"books":holdBooks})
    })
    let data = await response.json()
    setIsModal(false)
    if (response.status === 409){
      setSuccess(data)
      setTimeout(()=>{
        setSuccess(false)
      },2800)
    }
    else if (response.status===201){
      setSuccess(data)
      setTimeout(()=>{
        setSuccess(false)
        window.location.reload()
      },2000)
    }
    else if(response.status === 429){
      setSuccess(data)
      setTimeout(()=>{
        setSuccess(false)
      },2800)
    }
  }

  function deseclect( bookID){
    let index  = holdBooks.indexOf(bookID)
      if (index > -1) {
        setSsue(prev => prev+1)
        holdBooks.splice(index,1)
      }
      setDiv((oldDiv)=>
        oldDiv.map((div)=>{
        return (div.bookID === bookID ? {...div, isHeld:false}:div)
      } ))
      setCart((oldDiv)=>
      oldDiv.map((div)=>{
      return (div.bookID === bookID?"":div)
    }))
  }

  function newDiv(){
    const newDivs = []
    let ele = books.message?"": books.map((n)=>{
      newDivs.push({
        ...n,
        isHeld:holdBooks.includes(n.bookID)?true:false,
        id:nanoid()
      })
    })
    return newDivs
  }

  function holdDiv(id,bookID){
    if (ssue === 0 || holdBooks.includes(bookID)){
      setDiv((oldDiv)=>
        oldDiv.map((div)=>{
        return (div.bookID === bookID ? {...div, isHeld:false}:div)
      } ))
      let index  = holdBooks.indexOf(bookID)
      if (index > -1) {
        setSsue(prev => prev+1)
        holdBooks.splice(index,1)
      }
    }else{
        setSsue(prev =>prev-1)
        setHoldBooks([...holdBooks,bookID])
        setDiv((oldDiv) =>
          oldDiv.map((div) => {
            return (
              div.id === id ? { ...div, isHeld: !div.isHeld } : div              
            )
          })
      )
    }
  }

  let bookele =books.message?
    <div className="search-err"><h2>No Record Found</h2></div>:div.map((d)=>(
    <BookDiv 
      key={d.id}
      isHeld={d.isHeld}
      value={d}
      message={d.message}
      holdDiv={()=> holdDiv(d.id,d.bookID)}
    />
  ))
  return (
    
    <div className="view-main">
      {success && <div className="issue-book-success"><h2>{success.message}</h2></div>}
      {isModal && 
        <div className="cart-outer">
          <div className="cart-inner" ref={modal}>
            <h2>Cart</h2>
            {holdBooks.length?<div className="cart-main">
            {cart.map((c)=>c.title?(
              <div className="per-cart" onClick={()=>deseclect(c.bookID)}>
                <h4>{c.title}</h4>
                <p>auhtors: <strong>{c.authors}</strong></p>
                <p>isbn: <strong>{c.isbn}</strong></p>
              </div>
            ):"")}
            </div>:<h2>Cart is empty</h2>}
            {holdBooks.length?<button className="issue-bttn" onClick={handleIssueBook}>Issue</button>:""} 
          </div>
        </div>
      }
      {bookele}
    </div>
  )
}

export function ReturnBooks(props) {
  let {returnGetBooks, holdReturnBooks, setHoldReturnBooks} = useContext(AuthContext)

  const [ div, setDiv] = useState(newDiv)

  if (!Object.keys(returnGetBooks).length){
    return<h1>Loading</h1>
  }
  
  function newDiv() {
    const newDivs = []
    let ele = returnGetBooks.message?"":returnGetBooks.books.map((n)=>{
      newDivs.push({
        ...n,
        isHeld:holdReturnBooks.includes(n.bookID)?true:false,
        id:nanoid()
      })
    })
    return newDivs
  }

  function holdReturnDiv(id,bookID){
    if ( holdReturnBooks.includes(bookID)){
      setDiv((oldDiv)=>
        oldDiv.map((div)=>{
        return (div.bookID === bookID ? {...div, isHeld:false}:div)
        })
      )
      let index  = holdReturnBooks.indexOf(bookID)
      if (index > -1) {
        holdReturnBooks.splice(index,1)
      }
    }else{
      setHoldReturnBooks([...holdReturnBooks,bookID])
      setDiv((oldDiv) =>
        oldDiv.map((div) => {
          return (
            div.id === id ? { ...div, isHeld: !div.isHeld } : div          
          )
        })
      )
    }
  }
  
  
  let bookelem =returnGetBooks.message? <div className="search-err"><h2>{returnGetBooks.message}</h2></div>:div.map((d)=>(
    <BookDiv 
      key={d.id}
      isHeld={d.isHeld}
      value={d}
      type={"return"}
      holdDiv={()=> holdReturnDiv(d.id,d.bookID)}
    />
  ))
  return(
    <div className="view-main">
      {props.returnSuccess && <div className="issue-book-success"><h2>{props.returnSuccess.message}</h2></div>}
      {bookelem}
    </div>
  )
}