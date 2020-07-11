import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import './react-table-inverted.css';
import axios from 'axios';
import Popup from 'react-popup';
import './Popup.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      records: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
  }
  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.getAllRecords();
  }

  getAllRecords = () => {
    axios
      .get('/getallrecords')
      .then(result => {
        this.setState({ records: result.data });
        this.input.value = "";
        this.input1.value = "";
        this.input2.value = "";
        console.log(this.state.records);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleSubmit(e) {
    const query = `/getrecord?title=${this.input.value}`;

    console.log(query);
    e.preventDefault();
    axios
      .get(query)
      .then(result => {
          Popup.alert(result.data);
        
        this.getAllRecords();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }
  handleSubmit1(e) {
    const query = `/generatekey?email=${this.input1.value}`;

    console.log(query);
    e.preventDefault();
    axios
      .get(query)
      .then(result => {
          Popup.alert(result.data);
        this.getAllRecords();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  handleSubmit2(e) {
    const query = `/recoverkey?email=${this.input2.value}`;

    console.log(query);
    e.preventDefault();
    axios
      .get(query)
      .then(result => {
          Popup.alert(result.data);
        this.getAllRecords();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  deleteRecord = value => {
    console.log('to delete: ', value);
    const query = `/deleterecord?id=${value}`;
    axios
      .get(query)
      .then(result => {
        this.getAllRecords();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  };

  //https://www.codementor.io/blizzerand/building-forms-using-react-everything-you-need-to-know-iz3eyoq4y
  //todo add buttons to delete rows
  //https://codepen.io/aaronschwartz/pen/awOyQq?editors=0010
  //https://github.com/react-tools/react-table/issues/324
  render() {
    var data = this.state.records;
    data = data.reverse();

    return (
      <div className="App">
        <div className="container search">
        <div className="header">
          <h1>Welcome to The Weather API</h1>
          <p>Search for weather</p>
          </div>
          <div className="col-sm-12">
            <p />
            <form class="weathersearch" onSubmit={this.handleSubmit}>
              <label>Enter location:</label>
              <input
                type="text"
                class="form-control"
                placeholder="city name"
                ref={input => (this.input = input)}
              />
              <p />
              <input type="submit" class="button" value="Submit" />
            </form>
            <form class="inputbox" onSubmit={this.handleSubmit1}>
            <label>Generate API Key: </label>
            <input
                type="email"
                class="form-control"
                placeholder="email address"
                ref={input1 => (this.input1 = input1)}
              />
            <p />
            <input type="submit" class="button" value="Generate"/>
            </form>
            <form class="inputbox" onSubmit={this.handleSubmit2}>
            <label>Recover API Key: </label>
            <input
                type="email"
                class="form-control"
                placeholder="email address"
                ref={input2 => (this.input2 = input2)}
              />
            <p />
            <input type="submit" class="button" value="Recover"/>
            </form>
            <p />
          </div>
          <div>
            <Popup />
          </div>
        </div>

        <div className="container">
          <div className="col-sm-12">
            <p />
            <ReactTable
              data={data}
              columns={[
                {
                  icon: 'Icon',
                  Cell: row => {
                    return (
                      <div>
                        <img src={row.original.icon} />
                      </div>
                    );
                  }
                },
                {
                  Header: 'Location',
                  accessor: 'location'
                },
                {
                  Header: 'Temperature (Celcius)',
                  Cell: row=> (
                    <div dangerouslySetInnerHTML={
                      {__html: row.original.temp+"&#8451"}
                    }
                       />)
                },
                {
                  Header: 'Air Pollution Index',
                  accessor: 'airpollution',
                  style: { 'white-space': 'unset' }
                },
                {
                  Header: 'Monitoring Station',
                  accessor: 'station',
                  style: { 'white-space': 'unset' }
                },
                {
                  Header: 'Station Last Updated',
                  accessor: 'time',
                  style: { 'white-space': 'unset' }
                },
                {
                  Header: 'Air Pollution Source Url',
                  Cell: row=> (
                    <div dangerouslySetInnerHTML={
                      {__html:  "<a href="+ row.original.url +">"+ row.original.url+"</a>"}
                    }
                       />),
                  style: { 'white-space': 'unset' }
                },
                {
                  Header: 'Delete',
                  accessor: '_id',
                  Cell: ({ value }) => (
                    <button
                      onClick={() => {
                        this.deleteRecord(value);
                      }}
                      className="button"
                    >
                      Delete
                    </button>
                  )
                }
              ]}
              defaultPageSize={5}
              className="table -striped -highlight"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
