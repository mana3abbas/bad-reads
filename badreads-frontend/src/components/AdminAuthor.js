import React ,{Component,Fragment} from 'react';
import {Table} from 'react-bootstrap';
class AdminAuthor extends Component{
 render()
 {  
 
  return(
    <Fragment>
   
      
      
   <tr>
      <td>{this.props.details._id}</td>
      <td>{this.props.details.authorName}</td>
      <td>{this.props.details.img}</td>
      <td>{this.props.details.date_of_birth}</td>
     
      <td><button>Update</button> <button>Delete</button></td>
 </tr>
   
 </Fragment>


  )



 }



}
export default AdminAuthor;