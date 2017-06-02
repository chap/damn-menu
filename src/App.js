import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Textarea from 'react-textarea-autosize';

class MenuItem extends React.Component {
  constructor() {
    super();
    this.state = {
      editing: false,
    }
  }

  handleClick() {
    this.setState({ editing: true })
  }

  handleDoneEditing(e) {
    e.stopPropagation(); // don't bubble up to 'handle click'
    e.preventDefault(); // don't submit form
    this.setState({ editing: false })
  }

  render() {
    // debugger;
    return (
      <li className={"menu-item " + (this.state.editing ? 'editing' : '')} onClick={() => this.handleClick()}>
        <Textarea
          name="name"
          defaultValue={this.props.name}
          className="item-name"
          placeholder="Item Name"
          data-item-index={this.props.itemIndex}
          onChange={this.props.onItemChange}
        ></Textarea>
        <Textarea
          name="description"
          defaultValue={this.props.description}
          className="item-description"
          placeholder="Item description"
          data-item-index={this.props.itemIndex}
          onChange={this.props.onItemChange}
        ></Textarea>
        <Textarea
          name="price"
          defaultValue={this.props.price}
          className="item-price"
          placeholder="$5.99"
          data-item-index={this.props.itemIndex}
          onChange={this.props.onItemChange}
        ></Textarea>
      </li>
    );
  }
}

class Menu extends React.Component {
  constructor() {
    super();
    const defaultItems = [
      {
        name: 'Radish Pie',
        description: 'Coriander, fresh horseradish, and reduced cucumber juice',
        price: '$9'
      },
      {
        name: 'Cacio e Pepe',
        description: 'Blue durum wheat, Parmigiano-Reggiano, and fermented tomato water',
        price: '$13'
      },
      {
        name: 'Black Pepper Pastry',
        description: 'Mini-loaves of black pepper-studded pain au lait',
        // description: '1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-*-8-9-1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-7-8-9',
        price: '$7'
      },
      {
        name: 'Vegetable Terrine',
        description: 'Carrots, porcinis, kale, Asian pear, plums, beach onion and plums',
        price: '$16'
      },
      {
        name: 'Black Pork Curry Hopper',
        description: 'Fermented rice, coconut milk, black pork kari and dry curry',
        price: '$18'
      },
    ]
    this.state = {
      items: defaultItems,
      title: 'Today\'s Specials',
      date: formatDate(new Date()),

      // could probably be props
      titlePlaceholder: 'Today\'s Specials',
      datePlaceholdler: formatDate(new Date())
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // debugger;
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleItemChange(event) {
    // debugger;
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const items = this.state.items.slice();
    const itemIndex = parseInt(target.dataset.itemIndex);
    items[itemIndex][name] = value;

    this.setState({items: items});
  }

  handleAddItem() {
    const items = this.state.items.slice();
    this.setState({
      items: items.concat([{
        name: 'New Item',
        description: 'Description',
        price: '$?'
      }])
    });
    // console.log('wtf');
  }

  render() {
    const items = this.state.items.map((item, index) => {
      // debugger;
      return (
        <MenuItem
          name={item.name}
          description={item.description}
          price={item.price}
          key={index}
          itemIndex={index}
          onItemChange={(e) => this.handleItemChange(e)}
        />
      );
    });

    return (
      <div className="menu classic letter-2" id="master-menu" title={this.state.title + ' - ' + this.state.date}>
        <Textarea
          name="title"
          defaultValue={this.state.title}
          className="menu-title font-header"
          placeholder={this.state.titlePlaceholder}
          onChange={this.handleChange}
        ></Textarea>
        <Textarea
          name="date"
          defaultValue={this.state.date}
          className="menu-date font-body"
          placeholder={this.state.datePlaceholder}
          onChange={this.handleChange}
        ></Textarea>

        <ol className="menu-items list-unstyled">
          {items}
          <li className="no-print">
            <button onClick={() => this.handleAddItem()} className="btn btn-outline-secondary">+ Add Item</button>
          </li>
        </ol>
      </div>
    );
  }
}

class MenuContainer extends React.Component {
  makePdf(e) {
    const pdfName = simpleEncode(document.getElementById('master-menu').title);
    document.getElementById('pdfName').value = pdfName;

    const baseUrl = window.location.protocol + '//' + window.location.host;
    document.getElementById('baseUrl').value = baseUrl;

    const menuHtml = document.getElementsByClassName("menu-preview")[0].innerHTML;
    const x = document.querySelectorAll(".menu-print-holder");
    for (let i = 0; i < x.length; i++) {
        x[i].innerHTML = menuHtml;
    }

    var pageHtml = document.documentElement.innerHTML;
    pageHtml = pageHtml.replace('<body>', '<body class="printing">');
    document.getElementById('pdfHtml').value = pageHtml;
  }

  render() {
    return (
      <div className="menu-container">
        <div className="menu-preview">
          <Menu />
        </div>
        <div className="menu-print">
          <div className="row">
            <div className="col-xs-6 menu-print-holder">
            </div>
            <div className="col-xs-6 menu-print-holder">
            </div>
          </div>
        </div>
        <form action="https://docraptor.com/docs" target="_blank" method="post">
          <input type="hidden" name="user_credentials" value="7mR3O2eEXUpCSF9zeTu" />
          <input type="hidden" name="doc[name]" id="pdfName" value="" />
          <input type="hidden" name="doc[document_content]" id="pdfHtml" value="" />
          <input type="hidden" name="doc[type]" value="pdf" />
          <input type="hidden" name="doc[test]" value="true" />
          <input type="hidden" name="doc[prince_options][media]" value="screen" />
          <input type="hidden" name="doc[prince_options][baseurl]" id="baseUrl" value="screen" />
          <p className="text-xs-center no-print">
            <button onClick={(e) => this.makePdf(e)} className="btn btn-success btn-lg">Download PDF for Printing</button>
          </p>
        </form>
      </div>
    );
  }
}


function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  // var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + ordinalize(day);
}

function simpleEncode(s) {
    if (s==='') return '_';
    return s.replace(/[^a-zA-Z0-9.-]/g, function(match) {
        return '';
    });
}

function ordinalize(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}


class App extends Component {
  render() {
    return (
      <MenuContainer />
    );
  }
}


export default App;
