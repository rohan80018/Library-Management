import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext";


export default function Book(props) {
  const{book, setBook,setBooks, get_books} = useContext(AuthContext)
  const[edit, setEdit] = useState(false)
  const [message,setMessage] = useState(false)
  const [quantity, setQuantity] = useState({quantity:book.quantity})
  const [addQuantity, setAddQuantiy] = useState("")

  function changeQuantity(event) {
    setAddQuantiy(event.target.value)
  }
  // console.log(addQuantity)

  function handleChange(event){
    const {name,value} =event.target
    setQuantity(prev=>{return({...prev, [name]:value})})
  }

  async function handleAddClick() {
    let response = await fetch(`http://127.0.0.1:8000/api/addBook`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        "message":{...book,quantity:addQuantity}
      })
    })
    let data = await response.json()
    if (response.status===201){
      setMessage("Book Added")
      setBooks(data)
      setTimeout(()=>{
        setMessage(false)
      },2000)
    }
  }

  async function handleSubmit(event){
    event.preventDefault()
    let response = await fetch(`http://127.0.0.1:8000/api/get_book/${book.bookID}`,{
      method : "PUT",
      headers:{'Content-Type':"application/json"},
      body: JSON.stringify({quantity:quantity.quantity})
    })
    let data = await response.json()
    if (response.status === 201) {
      get_books()
      setBook(data)
      setEdit(false)
      setMessage("Book Updated")
      setTimeout(()=>{
        setMessage(false)
      },2000)
    }
  }


  return (
    <div className="main-book-outer">
      {message && <div className="book-message">{message}</div>}
      {props.type==="inventory"?<button onClick={()=>setEdit(true)} className="edit-book">Edit</button>:""}
      <p className="book-title">{book.title}</p>
      <p  id="book-content">Author: <strong>{book.authors}</strong></p>
      <p id="book-content">ISBN: <strong>{book.isbn}</strong></p>
      <p id="book-content">ISBN 13: <strong>{book.isbn13}</strong></p>
      <p id="book-content">Language Code: <strong>{book.language_code}</strong></p>
      <p id="book-content">Average Rating: <strong>{book.average_rating}</strong></p>
      <p id="book-content">Text Review Count: <strong>{book.text_reviews_count}</strong></p>
      <p id="book-content">Publisher: <strong>{book.publisher}</strong></p>
      <p id="book-content">Publish Date: <strong>{book.publication_date}</strong></p>
      {props.type === "inventory"?<form onSubmit={handleSubmit}>
      {props.type==="inventory"?<p id="book-content">Quantity: {edit ?<input className="input-quantity" onChange={handleChange} type="number" value={quantity.quantity} name="quantity"/>:<strong>{book.quantity}</strong>}</p>:""}
      {edit ? <button className="book-edit-submit">Submit</button>:""}
      </form>:
      <div id="book-content" className="add-online-div">
        <input onChange={changeQuantity} className="input-add-quantity" value={addQuantity} type="number" placeholder="0" min="1" max="5" name="addQuantity"/>
        <button onClick={handleAddClick} className="butt-add-quantity">ADD</button>
      </div>}
    </div>
  )
}