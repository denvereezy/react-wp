import React, { Component } from 'react';
import { Route, BrowserRouter, Link } from 'react-router-dom';

import CreatePost from './CreatePost';
import ViewPost from './ViewPost';
import EditPost from './EditPost';
import data from '../data.json';

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path='/' component={Posts}></Route>
                    <Route path='/add-post' component={CreatePost}></Route>
                    <Route path='/post/:id' component={ViewPost}></Route>
                    <Route path='/edit/:id' component={EditPost}></Route>
                </div>
            </BrowserRouter>
        );
    }
}

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            dataRoute: `${data.route}posts?_embed`,
            deleteRoute: `${data.route}posts`,
            isMounted: true,
            loading: true,
            postList: false
        }
    }

    render() {
        const { loading, postList } = this.state;

        if(loading) {
            return (
                <div className=" col-lg-8 col-md-10">
                    <div className="spinner">
                        <i className="fa fa-cog fa-spin sp"></i>
                    </div>
                </div>
            );
        }

        if (postList) {
            return (
                <div className=" col-lg-8 col-md-10">
                    <h1>No posts available. Add one.</h1>
                </div>
            );
        }

        return (
            <div className="posts">
                {this.state.posts.map((post) =>
                    <div className="post-preview" key={`post-${post.id}}`}>
                        <Link to={`/post/${post.id}`}>
                            <h2 className="post-title">
                                { post.name }
                            </h2>
                            <p className="introP">{ post.description }</p>
                        </Link>
                        <p className="post-meta">Posted by {post.author} on { post.date }</p>
                        <p>
                            <Link to={`/edit/${post.id}`}>
                                <button className="edit btn btn-primary">Edit</button>
                            </Link>
                            <button className="edit btn btn-danger" onClick={this.onDelete.bind(this, post.id)}>Delete</button>
                        </p>
                    </div>
                )}
            </div>
        );
    }

    componentDidMount() {
        this.setState({ isMounted: false });
        fetch(this.state.dataRoute)
            .then(res => res.json())
            .then(posts => this.setState((prevState, props) => {
                if (!posts.length) {
                    return {
                        postList: true,
                        loading: false
                    };
                }
                else{
                    return {
                        posts: posts.map(this.mapPost),
                        loading: false,
                        postList: false
                    };
                }
            }))
            .catch(err => {
                console.log(err);
            });
    }

    componentDidUpdate() {
        if(this.state.isMounted) {
            fetch(this.state.dataRoute)
                .then(res => res.json())
                .then(posts => this.setState((prevState, props) => {
                    if (!posts.length) {
                        return {
                            postList: true,
                            loading: false
                        };
                    }
                    else{
                        return {
                            posts: posts.map(this.mapPost),
                            loading: false,
                            postList: false
                        };
                    }
                }))
                .catch(err => {
                    console.log(err);
                });
        }
    }

    componentWillUnMount() {
        this.setState({ isMounted: false });
    }

    mapPost(post) {
        var description = post.content.rendered.replace(/<p>/gm, '').replace(/<\/p>/gm, '');
        var date = new Date(post.date).toDateString();

        return {
            id          : post.id,
            price       : post.price,
            image       : post.image,
            name        : post.title.rendered,
            description : description,
            author      : post._embedded.author[0].name,
            date        : date
        }
    }

    onDelete(id) {
        this.setState({ loading: true });
        fetch(this.state.deleteRoute + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic '+btoa(`${data.user.name}:${data.user.password}`),
                'Content-Type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            }
        }).then(res => {
            this.setState({
                posts: this.state.posts.filter(post => post.id !== id),
                loading: false
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
}
