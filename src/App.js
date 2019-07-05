import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Textarea from 'react-textarea-autosize';
import { DragDropContext } from 'react-beautiful-dnd';

class MenuItem extends React.Component {
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
      <li className={"menu-item " + (this.props.editing ? 'editing' : '')} onClick={this.props.onItemClick} data-item-index={this.props.itemIndex}>
        <button onClick={this.props.onItemRemove} className="remove-item no-print" data-item-index={this.props.itemIndex}>remove</button>
        <Textarea
          name="name"
          value={this.props.name}
          className="item-name"
          placeholder="Item Name"
          data-item-index={this.props.itemIndex}
          onChange={this.props.onItemChange}
        ></Textarea>
        <Textarea
          name="description"
          value={this.props.description}
          className="item-description"
          placeholder="Item description"
          data-item-index={this.props.itemIndex}
          onChange={this.props.onItemChange}
        ></Textarea>
        <Textarea
          name="price"
          value={this.props.price}
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

  render() {
    console.log('items :'+this.props.items[0]);
    console.log(this.props.items);
    const items = this.props.items.map((item, index) => {
      // debugger;
      console.log('rendering :'+item.name);
      return (
        <MenuItem
          name={item.name}
          description={item.description}
          price={item.price}
          editing={item.editing}
          key={index}
          itemIndex={index}
          onItemClick={(e) => this.props.handleItemClick(e)}
          onItemChange={(e) => this.props.handleItemChange(e)}
          onItemRemove={(e) => this.props.handleRemoveItem(e)}
        />
      );
    });

    return (
      <div className={"menu letter-2 " + this.props.style} id="master-menu" title={this.props.title + ' - ' + this.props.date}>
        <Textarea
          name="title"
          defaultValue={this.props.title}
          className="menu-title font-header"
          placeholder={this.props.titlePlaceholder}
          onChange={this.props.handleChange}
        ></Textarea>
        <Textarea
          name="date"
          defaultValue={this.props.date}
          className="menu-date font-body"
          placeholder={this.props.datePlaceholder}
          onChange={this.props.handleChange}
        ></Textarea>

        <ol className="menu-items list-unstyled">
          {items}
          <li className="no-print add-item">
            <button onClick={this.props.handleAddItem} className="btn btn-outline-success add-item">+ Add Item</button>
          </li>
        </ol>
      </div>
    );
  }
}

class MenuStyleButton extends React.Component {
  render() {
    return (
      <button
        className={"btn " + (this.props.name === this.props.activeStyle ? 'btn active' : 'btn-outline-secondary active')}
        onClick={(e) => this.props.onClick(e)}
      >
       {this.props.name}
      </button>
    )
  }
}

class MenuContainer extends React.Component {
  constructor(props) {
    super(props);
    const defaultItems = [
      {
        name: 'Radish Pie',
        description: 'Coriander, fresh horseradish, and reduced cucumber juice',
        price: '$9',
        editing: false
      },
      {
        name: 'Cacio e Pepe',
        description: 'Blue durum wheat, Parmigiano-Reggiano, and fermented tomato water',
        price: '$13',
        editing: false
      },
      {
        name: 'Black Pepper Pastry',
        description: 'Mini-loaves of black pepper-studded pain au lait',
        // description: '1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-*-8-9-1-2-3-4-5-6-7-8-9-1-2-3-4-5-6-7-8-9',
        price: '$7',
        editing: false
      },
      {
        name: 'Vegetable Terrine',
        description: 'Carrots, porcinis, kale, Asian pear, plums, beach onion and plums',
        price: '$16',
        editing: false
      },
      {
        name: 'Black Pork Curry Hopper',
        description: 'Fermented rice, coconut milk, black pork kari and dry curry',
        price: '$18',
        editing: false
      },
    ]
    this.state = {
      items: defaultItems,
      title: 'Today\'s Specials',
      date: formatDate(new Date()),
      style: 'classic',

      // could probably be props
      titlePlaceholder: 'Today\'s Specials',
      datePlaceholdler: formatDate(new Date())
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  handleAddItem(event) {
    this.resetEditingState();
    const items = this.state.items;
    const newItem = [{
      name: 'New Item',
      description: 'Description',
      price: '$?',
      editing: true
    }];
    this.setState(
      {items: items.concat(newItem)},
      () => {
        const input = document.getElementsByClassName('item-name')[document.getElementsByClassName('item-name').length - 1];
        input.focus();
        input.select();
      }
    );
  }

  resetEditingState() {
    const items = this.state.items.slice();
    items.forEach(function(item, index, array) {
      item.editing = false;
    });
    this.setState({items: items});
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

  handleItemClick(event) {
    // debugger;
    // resetEditingState;
    const target = event.target;
    const items = this.state.items.slice();
    items.forEach(function(item, index, array) {
      item.editing = false;
    });
    const itemIndex = parseInt(target.dataset.itemIndex);
    if (items[itemIndex]) {
      items[itemIndex].editing = true;
    }

    this.setState({items: items});
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



  handleRemoveItem(event) {
    event.stopPropagation();
    const target = event.target;
    var items = this.state.items;
    const itemIndex = parseInt(target.dataset.itemIndex);
    console.log('itemIndex:'+ itemIndex);
    items.splice(itemIndex, 1);

    this.setState({
      items: items
    })
  }

  handleStyleChange(event) {
    // debugger;
    const target = event.target;
    const value = target.textContent;

    this.setState({style: value});
  }

  makePdf(e) {
    // make sure no items active
    // const items = this.state.items.slice();
    // items.forEach(function(item, index, array) {
    //   item.editing = false;
    // });
    // this.setState({items: items});

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

    console.log('pageHtml:')
    console.log(pageHtml)
  }

  render() {
    return (
      <div className="menu-container">
        <div className="menu-preview">
          <Menu
            style={this.state.style}
            items={this.state.items}
            title={this.state.title}
            date={this.state.date}
            titlePlaceholder={this.state.titlePlaceholder}
            datePlaceholder={this.state.datePlaceholder}
            handleItemClick={(e) => this.handleItemClick(e)}
            handleItemChange={(e) => this.handleItemChange(e)}
            handleRemoveItem={(e) => this.handleRemoveItem(e)}
            handleAddItem={(e) => this.handleAddItem(e)}
          />
        </div>
        <div className="menu-print">
          <div className="row">
            <div className="col-xs-6 menu-print-holder">
            </div>
            <div className="col-xs-6 menu-print-holder">
            </div>
          </div>
        </div>
        <p className="menu-style-selector text-xs-center no-print">
          <MenuStyleButton
            name="classic"
            activeStyle={this.state.style}
            onClick={(e) => this.handleStyleChange(e)}
          />
          &nbsp;
          <MenuStyleButton
            name="modern"
            activeStyle={this.state.style}
            onClick={(e) => this.handleStyleChange(e)}
          />
        </p>
        <form action="https://docraptor.com/docs" target="_blank" method="post">
          <input type="hidden" name="user_credentials" value="aic1MYUlX0jpMCOm8RG7" />
          <input type="hidden" name="doc[name]" id="pdfName" value="" />
          <input type="hidden" name="doc[document_content]" id="pdfHtml" value="" />
          <input type="hidden" name="doc[type]" value="pdf" />
          <input type="hidden" name="doc[test]" value="true" />
          <input type="hidden" name="doc[prince_options][media]" value="screen" />
          <input type="hidden" name="doc[prince_options][baseurl]" id="baseUrl" value="screen" />
          <p className="text-xs-center no-print">
            <button onClick={(e) => this.makePdf(e)} className="btn btn-primary btn-lg">📄Download PDF for Printing</button>
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
