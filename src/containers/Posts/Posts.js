import React, { Component } from 'react';
import axios from '../../axios-posts'
import Post from './Post/Post'
import $ from "jquery"
import { Droppable } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd';


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
      columnOrder: [ 'column-1']
  }

  componentDidMount = () => {
      // console.log(this.props.id)
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
    for(let key in this.state.posts){
      if((`${this.props.newPostId}` == key) || (this.props.newPostId == null)){
        check = false;
        break;
      }
      else {
        check = true
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
    // console.log(result)
    if(!destination) {
      return
    }

    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    const column = this.state.columns[source.droppableId]
    console.log(column,"COLUMN")
    const newPostIds = Array.from(column.postIds);
    console.log(newPostIds,"POST ARRAY")
    newPostIds.splice(source.index, 1);
    console.log(newPostIds,"FIRST SPLICE")
    newPostIds.splice(destination.index, 0, draggableId);
    console.log(newPostIds,'FINAL SPLICE')
    const newColumn = {
      ...column,
      postIds: newPostIds
    };
    console.log(newColumn,"NEW COLUMN")

    const newState = {
      ...this.state,
      columns: {
        [newColumn.id]: newColumn,
      },
    }
    console.log(newState,"NEW STATE")
    this.setState(newState)
  }

  deleteHandler = (id) => {
    axios.delete(`/posts/${id}.json`)
    const updatedpost = {...this.state}
    console.log(updatedpost.posts,"POST")
    console.log(updatedpost.posts[id], "DELETED POST")
    const index = this.state.columns["column-1"].postIds.indexOf(id)
    console.log(index,"INDEX")
    updatedpost.columns["column-1"].postIds.splice(index,1)
    console.log(updatedpost,"AFTER DELETE")
    delete updatedpost.posts[id]
    this.setState({
      posts: updatedpost.posts,
      columns: {
        'column-1': {
          postIds: updatedpost.columns["column-1"].postIds
        }
      }
    })
    
      
  }

  render() {
    console.log(this.props.newPostId,"NEWPOSTID")
    let test = null
    for(let key in this.state.posts){
      if(`${this.props.newPostId}` == key){
        test = "present"
      }
      else{
        test = "absent"
      }
    }
    console.log(test)
      let allPost = [];
      this.state.columnOrder.map(col => {
        console.log(col,"UPDATE_COL")
        const column = this.state.columns[col]
        console.log(column,"UPDATED COLUMN")
        allPost = column.postIds.map(postId => {
          console.log(postId,"UPDATED POST ID")
          return `${postId}`
        })
      });

      let newPost = null;
      // if(this.props.)
      
      return(
        <DragDropContext onDragEnd={this.onDragEnd}>
        <div className=" posts container mx-5">
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