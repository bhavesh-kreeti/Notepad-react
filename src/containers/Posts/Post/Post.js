import React, { Component } from 'react';
import $ from "jquery"
import axios from '../../../axios-posts'
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { Draggable } from 'react-beautiful-dnd'


class Post extends Component {

 
    showHandler = (e,id) => {
        $('#' + id + '-desc > span').stop().slideToggle(1000)
        $('#' + id + '-desc > p').stop().slideToggle(600)
    }

    componentDidMount = () => {
        $('.complete').stop().hide()
    }

    

    deleteHandler = (id) => {
        axios.delete(`/posts/${id}.json`)

          
    }

    render() {
        return(
            <div>
                <Draggable draggableId={this.props.id} index={this.props.index}>
                  {provided => (
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    >
                  <div className="card text-dark border-primary my-3 w-75">
                    <div className="card-header bg-dark text-white">
                        <h3>{this.props.title}</h3>
                    </div>
                    <div className="card-body desc" id={`${this.props.id}-desc`}>
                        <span className="teaser card-text"> {this.props.description.substring(0,49)} </span>
                        <p className="complete card-text">{this.props.description}</p>
                    </div>
                    <div className="card-footer ">
                    <span class="badge badge-pill badge-info">{this.props.date}</span>
                        <button className="show ml-5 btn btn-outline-primary" id={this.props.id} onClick={(e) => this.showHandler(e,this.props.id)}>Show</button>
                        <button className=" ml-3 btn btn-outline-danger" onClick={() => this.props.delete(this.props.id)}>Delete</button>
                    </div>
                </div>
                    </div>
                  )}
              </Draggable>
                
            </div>
        )
    }
}

export default Post;