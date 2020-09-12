import React, { Component } from 'react';
import ReactNotification    from 'react-notifications-component';
import { store }            from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import Input from '../../components/Input/Input'; 
import axios from '../../axios-posts';
import Posts from  '../Posts/Posts';
import './Notepad.css'

class Post extends Component {
  
  state = {
    newPost: null,
    newPostId: null,
    notepadForm: {
      title: {
        elementType: 'input',
        elementConfig: {
          label: "Title",
          type: 'text',
          placeholder: 'Enter Title'
        },
        value: ''
      },
      description: {
        elementType: 'text-area',
          elementConfig: {
            label: "Description",
            rows: "5",
            cols: "25",
            placeholder: "Enter Description"
          },
        value: ''
      }
    },
    date: null,
    notification: {
      title: "Required",
      message:  "This cannot be blank",
      type: "danger",
      insert: "top",
      container: "top-left",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 1000,
        onScreen: true
      }
    }
  }

  componentDidMount = () => {
    let notif = {...this.state.notification}
    notif.title = "Hello !!";
    notif.message = "Welcome to this application"
    notif.type = "success"
    notif.dismiss.duration = 3000
    store.addNotification(notif);    
  }

  onInputChangeHandler = (e,inputIdentifier) => {
    const updatedNotepadForm = {...this.state.notepadForm};
    const updatedAttribute = updatedNotepadForm[inputIdentifier];
    updatedAttribute.value = e.target.value;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;
    updatedNotepadForm[inputIdentifier] = updatedAttribute;
    this.setState({
      notepadForm: updatedNotepadForm,
      date: dateTime
    })
  }

  formSubmitHandler = (e) => {
    e.preventDefault();
    const title = document.querySelector('#Title').value;
    const desc = document.querySelector('#Description').value
    let notif = {...this.state.notification}
  
    if(title.trim().length > 0 && desc.trim().length > 0){
      const formData = {};
      for(let formElementIdentifier in this.state.notepadForm ){
  
        if(this.state.notepadForm[formElementIdentifier].value.trim().length < 5){
          notif.message = `"${formElementIdentifier.toUpperCase()} is too short"`
          store.addNotification(notif);
          return
        }
        else {
          formData[formElementIdentifier] = this.state.notepadForm[formElementIdentifier].value
        }
      }
      formData.date = this.state.date

      axios.post('/posts.json', formData).then( res => {
        this.setState({
          newPost: {...formData},
          newPostId: res.data.name
        })
        document.querySelector('#Title').value="";
        document.querySelector('#Description').value="";
      })
      .catch(er => alert(er))

      notif.title = "Posted"
      notif.message = "Post successfully posted"
      notif.type="success"
      store.addNotification(notif);
    }
    else {
      notif.title = "Required";
      notif.message = "Inputs cannot be blank"
      notif.type = "danger"
      store.addNotification(notif);      
    }
  }

  resetNewPostId = () => {
    this.setState({
      newPostId: null
    })
  }

  render() {
    const inputElements = [];
    for(let key in this.state.notepadForm ){
      inputElements.push({
        id: key,
        config: this.state.notepadForm[key]
      })
    }

    return(
      <div className="row m-3 border shadow-lg p-3 height-fix mb-5 bg-white rounded bg-dark rounded">
        <ReactNotification />
        <div className="col-lg-4 my-4 ">
          <div className="card bg-info text-center Form card-form">
            <div className="card-body">
              <h3 className="card-header">Notepad</h3>
              <p className="">write your short notes <span>✍️</span> </p>
              <form onSubmit={this.formSubmitHandler}>
                {inputElements.map(inputElement => (
                  <Input key= {inputElement.id}
                    elementType = {inputElement.config.elementType}
                    elementConfig = {inputElement.config.elementConfig} 
                    label= {inputElement.config.elementConfig.label}  
                    inputChange = {(e) => this.onInputChangeHandler(e,inputElement.id)} />
                  ))}
                <button className="btn btn-outline-light btn-block">Add Note <span>✍️</span></button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8 ">
          <Posts newPost={this.state.newPost} newPostId={this.state.newPostId}
                 notification={this.state.notification}
                 resetPostId = {this.resetNewPostId}
                />
        </div>
      </div>
    )
  }
}

export default Post
