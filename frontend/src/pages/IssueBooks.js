import Members from "./Members";
import { useState, useContext, useEffect } from "react";
import {Link} from "react-router-dom"
import {ReturnBooks, ViewBook } from '../components/ViewBooks';
import AuthContext from "../context/AuthContext";


export default function IssueBooks({type}){
  let {get_books,issue, holdBooks, setIsModal, handleCart, setBooks,holdReturnBooks, returnBooks} = useContext(AuthContext)
  const [memberSelect, setMemberSelect] = useState(true)
  const [memberId, setMemberId] = useState("")
  const [memberDetail, setMemberDetail] = useState({})
  const [searchValue, setSearchValue] = useState("")
  const [returnSuccess,setReturnSuccess] = useState(false)
  
  useEffect(()=>{
    get_books()
  },[])

  function cartOpen(){
    handleCart()
    setTimeout(()=>{
      setIsModal(true)
    },500)
  }

  function closeSearch(){
    setSearchValue("")
    get_books()
  }

  function handleChange(event){
    setSearchValue(event.target.value)
  }

  async function handleSubmit(event){
    if (searchValue) {
      if(event.key === "Enter" || event.type === "click") {
        let response = await fetch(`http://127.0.0.1:8000/api/search/books`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            "type":"local",
            "page":1,
            "query": searchValue
          })
        })
        if (response.status === 204){
          setBooks({"message":"No Record Found"})
        }else{
          let data = await response.json()
          setBooks(data)
        }
      }
    }
  }

  async function handleClick(id){
    setMemberId(id)
    let response = await fetch(`http://127.0.0.1:8000/api/member/${id}`)
    let data = await response.json()
    setMemberDetail(data)
    returnBooks(id)
    setTimeout(()=>{
      setMemberSelect(false)
    },200)
  }
  let canIssue = 5 - (memberDetail.books_issued - memberDetail.books_returned)
  
  async function handleReturnBook(){
    let response = await fetch(`http://127.0.0.1:8000/api/return_book/${memberId}`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({"books":holdReturnBooks})
    })
    let data = await response.json()
    if (response.status===201){
      setReturnSuccess(data)
      setTimeout(()=>{
        setMemberSelect(true)
        setReturnSuccess(false)
      },2000)
    }
  }

  return (
    <div className="issue-main-outer">

      <div className="issue-header">
        <h1>{!type?"Issue Book":"Return Book"}</h1>
      </div>

      {memberSelect?
        <div className="issue-member">

          <div id="issue-member-header">
            <h3>Select a member to {!type?"issue":"return"} book </h3>
          </div>
          <div className="issue-member-inner">
            <Members type={"issueBooks"} func={handleClick}/>
          </div>

        </div>:!Object.keys(memberDetail).length ? "Loading..":
        <div className="issue-book">
          <div className="issue-book-memberDetail">
            <h3>{memberDetail.member.name}</h3>
            {!type?<p>No. of books can be issued: <strong>{issue}</strong></p>:
            <p>No. of books issued: <strong>{memberDetail.books_issued_current}</strong></p>}
            <p>Ouststanding Dues: <strong>{memberDetail.total_outstanding}</strong></p>
            <Link to={`/members/member?id=${memberId}`}>
            <button className="profile-butt">View Profile</button>
            </Link>
          </div>

          {!type?<div className="search-issue">

            <div className="member-search">
              <input  className="search-member" onKeyDown={handleSubmit} placeholder="Search Books / Author / Publisher/ ISBN" onChange={handleChange} value={searchValue}/>
              <button  className="search-button" onClick={handleSubmit}>Search</button>
              {searchValue?<button className="close-member-search" id="close-issueBook-search" onClick={closeSearch}>×</button>:""}
            </div>

            <div className="cart-issue">
              {/* <button>Issue Books</button> */}
              <button className="cart-butt" onClick={cartOpen}>Cart {holdBooks.length}</button>
            </div>

          </div>:
          <div>
            <button className="return-butt" onClick={handleReturnBook}>Return {holdReturnBooks.length}</button>
          </div>}

          <div>
            { !type?<ViewBook memberId={memberId} canIssue={canIssue} />:
            <ReturnBooks returnSuccess={returnSuccess} memberId={memberId}/>}
          </div>

        </div>
      }
    </div>
  )
}  