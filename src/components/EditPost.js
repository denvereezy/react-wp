import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import data from '../data.json';

export default class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRoute: `${data.route}${props.match.params.id}`,
            isMounted: true,
            fireRedirect: false,
            loading: true
        }
        this.onUpdatePost = this.onUpdatePost.bind(this);
    }

    render() {
        const { fireRedirect, loading } = this.state;

        if (loading) {
            return (
                <div className=" col-lg-8 col-md-10">
                    <div className="spinner">
                        <i className="fa fa-cog fa-spin sp"></i>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <form id="update-post" className="col-md-8" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input type="text" className="form-control" required ref="title"/>
                    </div>
                    <div className="form-group">
                        <label>Description *</label>
                        <textarea className="form-control" required ref="content" rows="8" cols="80"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Image</label>
                        <input type="text" className="form-control" ref="image" placeholder="place image url here"/>
                    </div>
                    <input type="submit" className="form-control btn btn-success" value="Update"/>
                </form>
                {fireRedirect && (
                    <Redirect to={'/'}/>
                )}
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        var data = {
            title: this.refs.title.value,
            content: this.refs.content.value,
            status: 'publish',
            fields: {
                image: this.refs.image.value
            }
        };
        this.onUpdatePost(data);
    }

    onUpdatePost(item) {
        this.setState({ loading: true });
        fetch(this.state.dataRoute, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic '+btoa(`${data.user.name}:${data.user.password}`),
                'Content-Type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body: JSON.stringify(item)
        }).then(res => {
            this.setState({ fireRedirect: true, loading: false });
        })
        .catch(err => {
            console.log(err);
        });
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
        this.refs.title.value = post.title.rendered;
        this.refs.content.value = post.content.rendered.replace(/<p>/gm, '').replace(/<\/p>/gm, '');
        this.refs.image.value = post.acf.image ? post.acf.image : '';
    }
}
