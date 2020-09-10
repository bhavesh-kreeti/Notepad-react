import React, { Component } from 'react';
import $ from "jquery"
import axios from '../../../axios-posts'
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { Draggable } from 'react-beautiful-dnd'


class Post extends Component {

 
    showHandler = (e,id) => {
        if ($('#' + id + '-desc > span').css('display') != "none")
        {
            $('#' + id + '-desc > span').stop().hide(500)
            $('#' + id + '-desc > p').stop().slideToggle(500)
        }
        else{
            $('#' + id + '-desc > p').stop().hide(500)
            $('#' + id + '-desc > span').stop().slideToggle(500)

        }
        
          
    }

    componentDidMount = () => {
        $('.complete').stop().hide()
    }

    

    deleteHandler = (id) => {
        axios.delete(`/posts/${id}.json`)

        store.addNotification({
            title: "Deleted !!!",
            message: "Deleted the post",
            type: "danger",
            insert: "top",
            container: "top-right",          
            animationIn: ["animated", "bounceIn"],
            animationOut: ["animated", "bounceOut"],
            customContent: "dangerWithIcon",
            dismiss: {
              duration: 1500,
              onScreen: true
            }
          });
          
    }

    render() {
        return(
            <div>
                {/* <ReactNotification /> */}
                <Draggable draggableId={this.props.id} index={this.props.index}>
                  {provided => (
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    >
                  <div className="card m-3">
                    <div className="card-header">
                        <h3>{this.props.title}</h3>
                    </div>
                    <div className="card-body desc" id={`${this.props.id}-desc`}>
                        <span className="teaser"> {this.props.description.substring(0,49)} </span>
                        <p className="complete">{this.props.description}</p>
                    </div>
                    <div className="card-footer">
                        {this.props.date}
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