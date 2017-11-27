import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import data from '../data.json';

export default class ViewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: [],
            dataRoute: `${data.route}posts/${props.match.params.id}`,
            isMounted: true,
            loading: true
        }
    }

    render() {
        const { loading } = this.state;

        if(loading) {
            return (
                <div className=" col-lg-8 col-md-10">
                    <div className="spinner">
                        <i className="fa fa-cog fa-spin sp"></i>
                    </div>
                </div>
            );
        }

        return (
            <div className="posts">
                {this.state.post.map((post) =>
                    <div className="post-preview" key={`post-${post.id}}`}>
                        <div className="post-title">
                            <h1>{post.title}</h1>
                        </div>
                        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                        <div className="post-image">
                            <img src={post.image} alt="" />
                        </div>
                        <br></br>
                        <Link to={`/`}><button className="btn btn-block btn-primary">Back</button></Link>
                    </div>
                )}
            </div>
        );
    }

    componentDidMount() {
        fetch(this.state.dataRoute)
        .then(res => res.json())
        .then(post => {
            this.setState({ loading:false });
            return this.formatPost(post);
        })
        .catch(err => {
            console.log(err);
        });
    }

    formatPost(post) {
        var currentPost = {
            title: post.title.rendered,
            content: post.content.rendered,
            image: post.acf.image
        };

        var formattedPost = [];

        formattedPost.push(currentPost);

        this.setState({ post: formattedPost });
    }
}
