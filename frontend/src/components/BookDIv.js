export default function BookDiv(props) {

    const styles ={
        border: props.isHeld ? "3px solid #59E391" : "3px solid #cdffdb",
        backgroundColor :props.isHeld ? "#9dfab6" : "#cdffdb"
    }
    if (!props.type) {
        if (props.value.quantity === 0) {
            return(
                <div className="book-div-main" style={{border:"3px solid #ececec",backgroundColor:"#ececec"}}>
                    <h3>{props.value.title}</h3>
                    <p>Author: <strong>{props.value.authors}</strong></p>
                    <p>Isbn: <strong>{props.value.isbn}</strong></p>
                </div>
            )
        }
    }

    return(
        
    <div className="book-div-main" onClick={props.holdDiv} style={styles}>
        <h3>{props.value.title}</h3>
        <p>Author: <strong>{props.value.authors}</strong></p>
        <p>Isbn: <strong>{props.value.isbn}</strong></p>
    </div>
    )
}