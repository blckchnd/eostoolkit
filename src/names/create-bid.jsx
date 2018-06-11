import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table } from 'react-bootstrap';
import { EosClient } from '../scatter-client.jsx';

export default class CreateBid extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleBidder = this.handleBidder.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleBid = this.handleBid.bind(this);

    this.state = {
      loading: false,
      error: false,
      bidder: '',
      name: '',
      bid: 0.0001,
      eos: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
    }
  }

  handleBidder(e) {
    this.setState({ bidder: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleBid(e) {
    this.setState({ bid: e.target.value });
  }

  createBid(e) {
    e.preventDefault();
    this.setState({loading:true, error:false});
    this.state.eos.transaction(tr => {
      tr.bidname({
        bidder: this.state.bidder,
        newname: this.state.name,
        bid: this.state.bid + ' EOS',
      })
    }).then((data) => {
      console.log(data);
      this.setState({loading:false, error:false});
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    });
  }



  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    return (
      <div>
        <Form style={{paddingTop: '1em'}}>
          <FormGroup>
            <ControlLabel>Your Account Name (the Bidder)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.bidder}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleBidder}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Premium Name to Bid On</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Account Name"
              onChange={this.handleName}
            />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Bid Amount (in EOS)</ControlLabel>{' '}
              <FormControl
                type="text"
                value={this.state.bid}
                placeholder="Account Name"
                onChange={this.handleBid}
              />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.createBid.bind(this)}>Bid on Name</Button>
        </Form>
        <div style={{paddingTop: '2em'}}>
          {isError ? (
            <Alert bsStyle="warning">
              <strong>Transaction failed.</strong>
            </Alert>
          ) : (
            isLoading ? (
              <ProgressBar active now={100} label='Querying Network'/>
            ) : (
              <div/>
            )
          )}
        </div>
      </div>
    );
  }
}
module.hot.accept();