import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

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
      <li className="menu-item" onClick={() => this.handleClick()}>
        <h5 className="item-name">{this.props.name}</h5>
        <p className="item-description">{this.props.description}</p>
        <p className="item-price">{this.props.price}</p>
        { this.state.editing ?
          <MenuItemForm
            name={this.props.name}
            description={this.props.description}
            price={this.props.price}
            itemIndex={this.props.itemIndex}
            onItemChange={this.props.onItemChange}
            onDoneEditing={(e) => this.handleDoneEditing(e)}
          />
          : null
        }
      </li>
    );
  }
}


class MenuItemForm extends React.Component {
  render() {
    return (
      <form onChange={this.props.onItemChange}>
        <div className="form-group">
          <label htmlFor="name">Item name</label>
          <input
            type="text"
            name="name"
            defaultValue={this.props.name}
            data-item-index={this.props.itemIndex}
            autoFocus
            className="form-control"
            placeholder="Item Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            defaultValue={this.props.description}
            data-item-index={this.props.itemIndex}
            className="form-control"
            placeholder="item description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            defaultValue={this.props.price}
            data-item-index={this.props.itemIndex}
            className="form-control"
            placeholder="$0"
          />
        </div>
        <button
          onClick={this.props.onDoneEditing}
          className="btn btn-primary"
        >Done</button>
      </form>
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
        description: 'Blue durum wheat and fermented tomato water',
        price: '$13'
      },
      {
        name: 'Black Pepper Pastry',
        description: 'Mini-loaves of black pepper-studed pain au lait',
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
      title: 'Daily Specials',
      date: formatDate(new Date())
    }
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

  makePdf() {
    const elementToPrint = document.getElementById('foo'); //The html element to become a pdf
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addHTML(elementToPrint, () => {
        doc.save('web.pdf');
    });
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
      <div className="menu classic letter-2">
        <h2 className="menu-title font-header">
          {this.state.title}
        </h2>
        <h4 className="menu-date font-body">
          {this.state.date}
        </h4>

        <ol className="menu-items">
          {items}
          <li>
            <button onClick={() => this.handleAddItem()} className="btn btn-outline-success">+ Add Item</button>
          </li>
        </ol>
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
      <Menu />
    );
  }
}


export default App;
