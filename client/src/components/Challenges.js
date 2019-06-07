import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo"
import Paper from "@material-ui/core/Paper";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import HttpsIcon from '@material-ui/icons/Https';
import CloseIcon from '@material-ui/icons/Close';
import GamepadIcon from '@material-ui/icons/Gamepad';
import Checkbox from "@material-ui/core/Checkbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
//import StarBorder from "@material-ui/icons/StarBorder";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Form from "./Form";

const ChallengesQuery = gql`
  {
    challenges {
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateChallenge(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeChallenge(id: $id)
  }
`;

const CreateChallengeMutation = gql`
  mutation($text: String!) {
    createChallenge(text: $text) {
      text
      id
      complete
    }
  }
`;

class Challenges extends Component {
  state = {
    open: true,
  };
  
  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  }

  updateChallenge = async challenge => {
    // update challenge
    await this.props.updateChallenge({
      variables: {
        id: challenge.id,
        complete: !challenge.complete
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: ChallengesQuery });
        // Add our comment from the mutation to the end.
        data.challenges = data.challenges.map(x => x.id === challenge.id ? ({
          ...challenge,
          complete: !challenge.complete,
        }) : x);
        // Write our data back to the cache.
        store.writeQuery({ query: ChallengesQuery, data });
      }
    });
  };

  removeChallenge = async challenge => {
    // remove challenge
    await this.props.removeChallenge({
      variables: {
        id: challenge.id,
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: ChallengesQuery });
        // Add our comment from the mutation to the end.
        data.challenges = data.challenges.filter(x => x.id !== challenge.id);
        // Write our data back to the cache.
        store.writeQuery({ query: ChallengesQuery, data });
      }
    });
  };

  createChallenge = async text => {
    // create Challenge
    await this.props.createChallenge({
      variables: {
        text
      },
      update: (store, { data: { createChallenge } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: ChallengesQuery });
        // Add our comment from the mutation to the end.
        data.challenges.unshift(createChallenge);
        // Write our data back to the cache.
        store.writeQuery({ query: ChallengesQuery, data });
      }
    });
  };

  render() {
    const {
      data: { loading, challenges }
    } = this.props;
    if (loading) {
      return null;
    }

    return (
      <Router>
      <div>
        <div>
          <Paper elevation={4}>
          <div>
          <div style={{ padding: 20 }}>
            <Form submit={this.createChallenge} />
          </div>
            <List
              component="nav"
              subheader={<ListSubheader component="div">Past and Future Challenges</ListSubheader>}
            >
              <Divider />
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <GamepadIcon />
                </ListItemIcon>
                  <ListItemText inset primary="Awaiting Challenges" />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {challenges.filter(challenge => !challenge.complete).map(challenge => (
                      <ListItem
                        key={challenge.id}
                        role={undefined}
                        dense
                        button
                        onClick={null}
                      >
                        <Checkbox
                          checked={challenge.complete}
                          tabIndex={-1}
                          disableRipple
                          onClick={() => (this.updateChallenge(challenge))}
                        />
                        <ListItemText inset primary={challenge.text} />
                        <ListItemSecondaryAction>
                          <IconButton>
                            <Link to={`/${challenge.id}`}>
                              <InputIcon />
                            </Link>
                          </IconButton>
                          <IconButton onClick={() => this.removeChallenge(challenge)}>
                            <CloseIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider />
                <ListItem button onClick={this.handleClick}>
                  <ListItemIcon>
                    <HttpsIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Terminated Challenges" />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {challenges.filter(challenge => challenge.complete).map(challenge => (
                      <ListItem
                        key={challenge.id}
                        role={undefined}
                        dense
                        button
                        onClick={null}
                      >
                        <Checkbox
                          checked={challenge.complete}
                          tabIndex={-1}
                          disableRipple
                          onClick={() => (this.updateChallenge(challenge))}
                        />
                        <ListItemText inset primary={challenge.text} />
                        <ListItemSecondaryAction>
                          <IconButton onClick={`/${challenge.id}`}>
                            <InputIcon />
                          </IconButton>
                          <IconButton onClick={() => this.removeChallenge(challenge)}>
                            <CloseIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </List>
            </div>
          </Paper>
        </div>
      </div>
      </Router>
    );
  }
}

export default compose(
  graphql(CreateChallengeMutation, { name: "createChallenge" }),
  graphql(RemoveMutation, { name: "removeChallenge" }),
  graphql(UpdateMutation, { name: "updateChallenge" }),
  graphql(ChallengesQuery)
)(Challenges);