import React, { Component } from "react";
import PropTypes from 'prop-types';
import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const DEFAULT_PAGE = 0;
const PARAM_PAGE = "page=";
const DEFAULT_HPP = "100";
const PARAM_HPP = "hitsPerPage=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}${DEFAULT_HPP}`;

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

// function isSearched(searchTerm) {
//   return function(item) {
//    return !searchTerm ||
//       item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

const isSearched = searchTerm => item =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY
    };

    // this.onSearchChange = this.onSearchChange.bind(this);
    //this.onDismiss = this.onDismiss.bind(this);

    //this.onDismiss = this.onDismiss.bind(this);
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
}
    
    // this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  };

  setSearchTopstories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  };
  fetchSearchTopstories(searchTerm, page) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  onDismiss = id => {
     const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    // const updatedList = this.state.list.filter(isNotId);
    // const updatedHits = this.state.result.hits.filter(isNotId);

    // const isNotId = item => item.objectID !== id;
    // const updatedList = this.state.list.filter(isNotId);

    // const updatedList = this.state.list.filter(item => item.objectID !== id);

    this.setState({
      results: {
...results,
        [searchKey]: { hits: updatedHits, page }
      }});
  };
  
  
  needsToSearchTopstories = (searchTerm) => {
    return !this.state.results[searchTerm];
}

  render() {
    const { searchTerm, results, searchKey } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            {" "}Search
          </Search>{" "}
          <Table
list={list}
    onDismiss={this.onDismiss}
  />
        </div>
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    );
  }
}

// class Search extends Component {
//   render() {
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         {children}
//         <input type="text" value={value} onChange={onChange} />{" "}
//       </form>
//     );
//   }
// }

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">
      {children}
    </button>
  </form>;

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span>
          <a href={item.url}>
            {item.title}
          </a>
        </span>
        <span>
          {item.author}
        </span>
        <span>
          {item.num_comments}
        </span>
        <span>
          {item.points}
        </span>
        <span>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            {" "}Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>;

// class Table extends Component {
//   render() {
//     const { list, pattern, onDismiss } = this.props;
//     return (
//       <div>
//         {list.filter(isSearched(pattern)).map(item =>
//           <div key={item.objectID}>
//             <span>
//               <a href={item.url}>
//                 {item.title}
//               </a>
//             </span>
//             <span>
//               {item.author}
//             </span>
//             <span>
//               {item.num_comments}
//             </span>
//             <span>
//               {item.points}
//             </span>
//             <span>
//               <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
//             </span>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// Table.propTypes = {
//   list: PropTypes.array.isRequired,
//   onDismiss: PropTypes.func.isRequired,
// };

class Button extends Component {
  render() {
    const { onClick, className, children } = this.props;
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}

// Button.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   className: PropTypes.string,
//   children: PropTypes.node,
// };

Button.defaultProps = {
  className: '',
};


export default App;


export {
  Button,
  Search,
Table, };