import React, { Component } from 'react'
import './Book_page.css'
import {
  Link,
  Redirect,
} from 'react-router-dom'
import axios from 'axios';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUser } from '../utils/common';
export default class Book_Page extends Component {

  componentDidMount() {
    this.get_book_data()
  }


  get_book_data = ()=>{
    
    // get book data
    axios.get(`http://127.0.0.1:4000/book/${this.props.match.params.id}`).then(
      res => {
        const data = res.data;        
        const { bookName, img, bookDescription, rating, author,  category} = data
        const {  authorName } = author
        const Author_Link = `/author/${author._id}`
        const {  categoryName } = category
        const Category_Link = `/book/${category._id}`
        this.setState({  bookName, img, bookDescription, rating, authorName,  categoryName, Category_Link, Author_Link})
      }
    ).catch(err=>{
      this.props.history.push(`/404`)
      console.log(err);


    })

    if (getUser()){
      // get user rating for this book
      axios.get(`http://127.0.0.1:4000/rate/${getUser().userId}/${this.props.match.params.id}`)
      .then(res=>{
        const {rating} = res.data
        this.setState({
          MyRating: rating
        })
      }).catch(err=>{
        console.log(err);
      })
  
      // get user state for this book
      axios.get(`http://127.0.0.1:4000/userBook/${getUser().userId}/${this.props.match.params.id}`)
      .then(res=>{
        this.setState({state: res.data})
        
      }).catch(err=>{
        console.log(err);
      })
    }

    // get revies for this book
    axios.get(`http://127.0.0.1:4000/review/${this.props.match.params.id}`)
    .then(res=>{
      this.setState({reviewsList: res.data})
    }).catch(err=>{
      console.log(err);
    })
      
  }

  rate_book = () => {
    if (getUser()){
      axios.post(`http://127.0.0.1:4000/rate/${getUser().userId}/${this.props.match.params.id}`,{
        rating: this.state.TempRating
      }).then(res => {
        this.get_book_data()
      }
      )
    }else{
      this.props.history.push(`/login`)
    }
  }

  clear_rating_book = () => {
    axios.delete(`http://127.0.0.1:4000/rate/${getUser().userId}/${this.props.match.params.id}`)
    .then(res=>{
      this.get_book_data()
      this.setState({
        MyRating : -1
      })   
    })
  }

  state = {
    TempRating : -1,
    img: "",
    bookName: "",
    bookDescription: "",
    authorName: "",
    Author_Link: "https://www.goodreads.com/author/show/4199891.Brian_Christian",
    categoryName: "",
    Category_Link: "",
    rating: 0,
    state: "Read",
    MyRating: -1,
    reviewsList: [],
    review: ""
  }

  mouseEnterRate = rate => e => {
    this.setState({
      TempRating : rate
    }) 
  }
  mouseLeaveRate = () =>{
    this.setState({
      TempRating : -1
    }) 
  }

  makeRating = rate => (e) => {  
    this.rate_book()
  }

  clearRating = () => {
    this.clear_rating_book()
     
  }

  deleteReview = reviewId => e => {
    if (getUser()){
      
      axios.delete(`http://127.0.0.1:4000/review/${getUser().userId}/${this.props.match.params.id}/${reviewId}`)
      .then(res=>{
        this.get_book_data()
      }).catch(err=>{
        console.log(err);
      })
    }else{
      this.props.history.push(`/login`)
    }
  }

  changeState = async(event) => {
    if (getUser()){
      this.setState({state: event.target.value})
      axios.put(`http://127.0.0.1:4000/userBook/${getUser().userId}/${this.props.match.params.id}`,{action: event.target.value})
      .then(res=>{
      }).catch(err=>{
        console.log(err);
        
      })
    }else{
      this.props.history.push(`/login`)
    }
  }

  submitReview = () => {
    if (getUser()){
      axios.post(`http://127.0.0.1:4000/review/${getUser().userId}/${this.props.match.params.id}`,{review: this.state.review})
      .then(res=>{
        this.setState({review: ""});
        this.get_book_data()
      }).catch(err=>{
        console.log(err);
      })
    }else{
      this.props.history.push(`/login`)
    }
    
  }

  
  render() {
    const { bookName , img, authorName, Author_Link, rating, categoryName, Category_Link, State, MyRating, TempRating, reviewsList } = this.state
    
    let myID = null
    if (getUser()){
      myID = getUser().userId
    }
    return (
      <div className="container" id="book">
        <div className="row">
          <div className="col-2">
            <img id="bookImg" src={img} />
            <select className="custom-select" onChange={this.changeState} value={this.state.state}>
              <option value="Want to Read" >Want to Read</option>
              <option value="Read" >Read</option>
              <option value="Current Reading">Current Reading</option>
            </select>
            <div className="container">
              { MyRating != -1 ? <div>
                <Link onClick={this.clearRating}>Clear rating</Link>
              </div> : null }
              <span >
                <span ><FontAwesomeIcon icon={faStar} color={TempRating == -1 ? MyRating >= 1 ? "#FF9529": "" : TempRating >= 1 ? "#FF9529": ""} onMouseEnter={this.mouseEnterRate(1)} onMouseLeave={this.mouseLeaveRate} onClick={this.makeRating(1)} /></span>
                <span ><FontAwesomeIcon icon={faStar} color={TempRating == -1 ? MyRating >= 2 ? "#FF9529": "" : TempRating >= 2 ? "#FF9529": ""} onMouseEnter={this.mouseEnterRate(2)} onMouseLeave={this.mouseLeaveRate} onClick={this.makeRating(2)} /></span>
                <span ><FontAwesomeIcon icon={faStar} color={TempRating == -1 ? MyRating >= 3 ? "#FF9529": "" : TempRating >= 3 ? "#FF9529": ""} onMouseEnter={this.mouseEnterRate(3)} onMouseLeave={this.mouseLeaveRate} onClick={this.makeRating(3)} /></span>
                <span ><FontAwesomeIcon icon={faStar} color={TempRating == -1 ? MyRating >= 4 ? "#FF9529": "" : TempRating >= 4 ? "#FF9529": ""} onMouseEnter={this.mouseEnterRate(4)} onMouseLeave={this.mouseLeaveRate} onClick={this.makeRating(4)} /></span>
                <span ><FontAwesomeIcon icon={faStar} color={TempRating == -1 ? MyRating >= 5 ? "#FF9529": "" : TempRating >= 5 ? "#FF9529": ""} onMouseEnter={this.mouseEnterRate(5)} onMouseLeave={this.mouseLeaveRate} onClick={this.makeRating(5)} /></span>
              </span> 
            </div>
          </div>
          <div className="col-9">
            <h1 id="bookTitle" className="gr-h1 gr-h1--serif" itemProp="name">
                  {bookName}
            </h1>
            <div id="bookAuthors" className="">
              <span className="by">by</span>
              <span>
                <div className="authorName__container">
                  <Link to={Author_Link}><span>{authorName}</span></Link> 
                </div>
              </span>
            </div>

            <div id="bookCategory" className="">
              <span>
                <div >
                  <Link to={Category_Link}><span>{categoryName}</span></Link> 
                </div>
              </span>
            </div>
            
            <span >
              <span ><FontAwesomeIcon icon={faStar} color={rating >= 1 ? "#FF9529": ""}/></span>
              <span ><FontAwesomeIcon icon={faStar} color={rating >= 2 ? "#FF9529": ""}/></span>
              <span ><FontAwesomeIcon icon={faStar} color={rating >= 3 ? "#FF9529": ""}/></span>
              <span ><FontAwesomeIcon icon={faStar} color={rating >= 4 ? "#FF9529": ""}/></span>
              <span ><FontAwesomeIcon icon={faStar} color={rating >= 5 ? "#FF9529": ""}/></span>
            </span>

            <p>
            A fascinating exploration of how insights from computer algorithms can be applied to our everyday lives, helping to solve common decision-making problems and illuminate the workings of the human mind

            </p>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="validationTextarea">Enter Your Review</label>
          <textarea className="form-control " id="validationTextarea" placeholder="Write your review" rows="4" value={this.state.review} required onChange={(e)=>this.setState({review: e.target.value})}></textarea>
          <button type="button" className="btn btn-primary" onClick={this.submitReview} >Submit</button>
        </div>

        <div className=" border-info rounded" >
          {
            reviewsList.map((reviewer)=>
              <div className="media border"  style={{padding: "5px 10px",backgroundColor:"white",borderRadius: "15px"}}>
                <div style={{textAlign: "center"}} className="mr-3" >
                  <img src={reviewer.user.img}  alt="..." width="100px" height="100px" style={{borderRadius:"50%"}} />
                  <h4>{reviewer.user.firstName}</h4>
                </div>
              <div className="media-body" style={{alignSelf: "center"}}>
                <p>{reviewer.review}</p>
              </div>
              {  myID == reviewer.user._id ? <button type="button" class="btn btn-info" style={{marginRight: '20px'}}>Edit</button> : null}
              {  myID == reviewer.user._id ? <button type="button" class="btn btn-danger" onClick={this.deleteReview(reviewer._id)}>delete</button> :null}
            </div>
            )
          }
        </div>
      </div>
    )
  }
}
