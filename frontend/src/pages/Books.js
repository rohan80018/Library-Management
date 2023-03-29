import {useContext, useState, useEffect, useRef} from "react"
import AuthContext from "../context/AuthContext"
import Book from "../components/book"
import InfiniteScroll from "react-infinite-scroll-component";

export default function Books(){
  const {url, books, setBooks, get_books, setBook, handleOnline, setBooksOnline, booksOnline} = useContext(AuthContext)
  const [mode,setMode] = useState("inventory")
  const [search, setSearch] = useState(false)
  const [searchScreen, setSearchScreen] = useState(false)
  const [ searchValue, setSearchValue] = useState("")
  const [ bookModal, setBookModal] = useState(false)
  const [randomSuccess, setRandomSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  let [page, setPage] = useState(2);
  const modal = useRef()
  

  function handleBookModal(id) {
    setBook(id)
    setBookModal(true)
  }
  function closefunction(){
    setBookModal(false)
  }
  
  async function handleRandomImport (){
    setLoading(true)
    let randomPage =  Math.floor(Math.random() * 4000)
    let response = await fetch(`http://127.0.0.1:8000/api/infinite`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        type:"random",
        page: randomPage,
      })
    })
    let data= await response.json()
    if (response.status === 201){
      setBooks(data)
      setRandomSuccess(true)
      setTimeout(()=>{
        setLoading(false)
        setRandomSuccess(false)
      },1500)
    } 
  }

  
  function moreOnlineBooks(){
    console.log("new")
    let getMoreData = async () => {
      if (search){
        let res = await fetch(`http://127.0.0.1:8000/api/search/books`,{
          method : "POST",
          headers:{'Content-Type':"application/json"},
          body:JSON.stringify({
            "type": "online",
            "page": page,
            "query":searchValue
          })
        })
        let data = await res.json()
        setBooksOnline([...booksOnline,...data])
        setPage(prev=> prev+1)
      }else{
      let res = await fetch(`http://127.0.0.1:8000/api/infinite`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          type:"infinite",
          page:page
        })
      });
      let data = await res.json();
      setBooksOnline([...booksOnline, ...data]);
      setPage(page + 1);
    };
  }
    getMoreData();
  }

  useEffect(()=>{
    url()
    get_books()
    handleOnline()
    const handler = (event) =>{
      if(!modal.current){
        return
      }
      if (!modal.current.contains(event.target)) {
        setBookModal(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  },[])

  function handleCloseSearch(){
    setSearchValue("")
    get_books()
    setBooksOnline({})
    handleOnline()
    setSearchScreen(false)
  }

  function handleChange(event) {
    setSearchValue(event.target.value)
  }
  
  async function handleSubmit( event){
    
    if (searchValue){
      
      if (event.key === "Enter"||event.type==="click"){
        setSearchScreen(true)
        setSearch(true)
        let response = await fetch(`http://127.0.0.1:8000/api/search/books`,{
          method :"POST",
          headers :{"Content-Type":"application/json"},
          body: JSON.stringify({
            "type":mode === "inventory"?"local":"online",
            "page":1,
            "query":searchValue
          })
        })
        
        if (response.status === 204){
            setBooks({"message":"No Record Found"})
        }else{
            let data = await response.json()
            console.log(data)
            {mode === "inventory"?setBooks(data):setBooksOnline(data)}
            setSearchScreen(false)
        } 
      }   
    }
  }

  if(!Object.keys(books).length){
    return (<h1>Loading</h1>)
  }
  
  if(mode ==="online" && !Object.keys(booksOnline).length ){
    return (<h1>Loading</h1>)
  }

  let onlineBooksEle = mode ==="online"? booksOnline.map((book)=>(
    <div key={book.bookID} onClick={()=>handleBookModal(book)} className="per-book-outer">
          <h3>{book.title}</h3>
          <p>Auhtor: <strong>{book.authors}</strong></p>
          <p>Average Rating: <strong>{book.average_rating}</strong></p>
          <p>Publisher: <strong>{book.publisher}</strong></p>
    </div>
  )):""
  
  let booksEle = ""
  if (books.message){
    booksEle = <div id="member-err"><h2>No Record Found</h2></div>
  }else{
    booksEle = books.map((book)=>(
      <div key={book.bookID} onClick={()=>handleBookModal(book)} className={book.quantity?"per-book-outer":"per-book-outer quantity"}>
        <h3>{book.title}</h3>
        <p>Auhtor: <strong>{book.authors}</strong></p>
        <p>Average Rating: <strong>{book.average_rating}</strong></p>
        <p>Publisher: <strong>{book.publisher}</strong></p>
        <div className="book-quantity" >Quantity: <strong>{book.quantity}</strong></div>
      </div>
    ))
  }

  return(
    <div className="books-main-div">

      {bookModal && <div className="book-outer">
        <div className="book-inner" ref={modal}>
          <button onClick={closefunction} className="book-close">×</button>
            <Book type={mode === "online"?"online":"inventory"} />
          </div>
        </div>
      }

      {loading &&<div className="importing-books">
          <h1>{!randomSuccess ?"Importing Books ...":"Books Imported"}</h1>
        </div>
      }

      <div className="member-header">

        <div className="member-search">
          <input value={searchValue} onChange={handleChange} onKeyDown={handleSubmit} className="search-member" placeholder="Search Books / Author / Publisher / ISBN" />
          <button onClick={handleSubmit}  className="search-button">Search</button>
          {searchValue?<button className="close-member-search" id="close-book-search"onClick={handleCloseSearch}>×</button>:""}
        </div>

        <button onClick={handleRandomImport} className="add-member">Add Random Books</button>
      </div>

      <div className="books-bottom-main">

        <div className="books-bottom-header">
          <div onClick={()=>setMode("inventory")} className={mode === "inventory"?"but-inventory active-book-but":"but-inventory"}>
            Inventory
          </div>
          <div onClick={()=>setMode("online")} className={mode === "online"?"but-online active-book-but":"but-online"}>
            Online
          </div>
        </div>

        {mode === "inventory"?
          <div className="books-bottom-inventory">
            
            {booksEle}
          </div>:
          <div className="scroll" id="scrolldiv">
            <InfiniteScroll  dataLength={booksOnline.length} next={moreOnlineBooks} hasMore={true} loader={<div style={{display:"flex",justifyContent:"center"}}>{booksOnline.length>9?<h4>{searchScreen?"Searching...":"Loading..."}</h4>:""}</div>}  scrollableTarget="scrolldiv">
              <div className="books-bottom-online">
                  {/* {{onlineBooksEle}} */}
                  {searchScreen?"":onlineBooksEle}
              </div>
            </InfiniteScroll>
          </div>
        }
      </div>

    </div>
    )
}