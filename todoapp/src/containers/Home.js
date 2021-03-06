import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { invokeRailsApi } from '../libs/railsApiLib';
// import { invokeApig } from '../libs/awsLib';
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  // notes() {
  //   return invokeApig({ path: "/notes" });
  // }

  renderNotesList(notes) {
    return [{}].concat(notes).map(
      (note, i) =>
        i !== 0
          ? <ListGroupItem
              key={note.noteId}
              href={`/notes/${note.noteId}`}
              onClick={this.handleNoteClick}
              header={note.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/notes/new"
              onClick={this.handleNoteClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new note
              </h4>
            </ListGroupItem>
    );
  }

  handleNoteClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  async componentDidMount() {
    try {
      const results = await this.railsAPINotes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  railsAPINotes() {
    return invokeRailsApi({ path: "/notes" });
  }

  renderRailsAPINotesList(notes) {
    return [{}].concat(notes).map(
      (note, i) =>
        <ListGroupItem
          key={note.id}
          href={`/notes/${note.id}`}
          header={note.content}
        >
          {"Created: " + new Date(note.created_at).toLocaleString()}
        </ListGroupItem>
    );
  }

  renderRailsAPINotes() {
    return (
      <div className="notes">
        <PageHeader>Your Rails API Notes! {process.env.NODE_ENV}</PageHeader>
        <ListGroup>
          {this.renderRailsAPINotesList(this.state.notes)}
        </ListGroup>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.renderRailsAPINotes()}
      </div>
    );
  }
}

