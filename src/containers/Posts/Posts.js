import React, { Component } from 'react';
import axios from '../../axios-posts'
import Post from './Post/Post'
import { Droppable } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd';
import { store } from 'react-notifications-component';
import  './Posts.css'

class Posts extends Component {

  state = {
    posts: null,
    columns: {
      'column-1': {
        id: "column-1",
        title: "To do",
        postIds: []
      }
    },
    columnOrder: [ 'column-1'],
    notification: this.props.notification
  }

  componentDidMount = () => {
    axios.get('/posts.json')
    .then(res => {
        let postObject = null;
        postObject = {...res.data}
        const postIds = []
        for(let key in postObject){
            postIds.push(key)
        }
        this.setState({
            posts: postObject,
            columns: {
              'column-1': {
                id: "column-1",
                title: "To do",
                postIds: postIds
              }
            },
            columnOrder: [ 'column-1']
        })
      })
  }

  componentDidUpdate = () => {
    let check = null
    if(Object.keys(this.state.posts).length === 0 &&
      this.state.posts.constructor === Object &&
      this.props.newPostId !== null
      ){
      check = true;
    }
    else {
      for(let key in this.state.posts){
        if((`${this.props.newPostId}` == key) || (this.props.newPostId == null)){
          check = false;
          break;
        }
        else {
          check = true
        }
      }
    }

  if(check){
    axios.get('/posts.json')
          .then(res => {
            let postObject = null;
            postObject = {...res.data}
            const postIds = []
            for(let key in postObject){
              postIds.push(key)
            }

          this.setState({
            posts: postObject,
            columns: {
              'column-1': {
                id: "column-1",
                title: "To do",
                postIds: postIds
                }
              },
            columnOrder: [ 'column-1']
          })
        })
    }
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if(!destination) {
      return
    }

    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){
      return
    }

    const column = this.state.columns[source.droppableId]
    const newPostIds = Array.from(column.postIds);
    newPostIds.splice(source.index, 1);
    newPostIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      postIds: newPostIds
    };

    const newState = {
      ...this.state,
      columns: {
        [newColumn.id]: newColumn,
      },
    }

    this.setState(newState)
  }

  deleteHandler = (id) => {
    axios.delete(`/posts/${id}.json`).then(res => {

      const updatedpost = {...this.state}
      const index = this.state.columns["column-1"].postIds.indexOf(id)
      updatedpost.columns["column-1"].postIds.splice(index,1)
      delete updatedpost.posts[id]
  
      this.setState({
        posts: updatedpost.posts,
        columns: {
          'column-1': {
            postIds: updatedpost.columns["column-1"].postIds
          }
        }
    })
    })
    const notif = {...this.state.notification}
      notif.title = "Deleted  "
      notif.message = "Post successfully deleted  "
      notif.type="danger"
      store.addNotification(notif);
    }

  render() {
    let allPost = [];
    this.state.columnOrder.map(col => {
      const column = this.state.columns[col]
      allPost = column.postIds.map(postId => {
      return `${postId}`
                })
    });
    return(
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className=" posts container ">
          <Droppable droppableId='column-1'>
            {provided => 
              <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              >
                {allPost.map((postId,index) => (
                  <Post title={this.state.posts[postId].title} key={postId} index={index}
                    id={postId} description={this.state.posts[postId].description}
                    delete={() => this.deleteHandler(postId)} date={this.state.posts[postId].date} />
                ))}
              {provided.placeholder}
              </div>
            }
          </Droppable>
        </div>
      </DragDropContext>
    )
  }
}

export default Posts;
