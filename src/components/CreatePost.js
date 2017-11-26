import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import data from '../data.json';

export default class CreatePost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataRoute: `${data.route}posts`
        }
    }

    render() {
        return(
            <form id="add-post" className="col-md-8" onSubmit={this.handleSubmit.bind(this)}>
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
                <input type="submit" className="form-control btn btn-success" value="Add"/>
                    <br></br>
                    <br></br>
                    <Link to={"/"}><button className="form-control btn btn-primary">Back</button></Link>
            </form>
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
        this.onAddPost(data);
        this.refs.title.value = '';
        this.refs.content.value = '';
        this.refs.image.value = '';
    }

    onAddPost(item) {
        fetch(this.state.dataRoute, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic '+btoa(`${data.user.name}:${data.user.password}`),
                'Content-Type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body: JSON.stringify(item)
        }).then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }
}
