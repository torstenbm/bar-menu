import React from "react";
import firebase from 'firebase';


import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import "./App.css";

class App extends React.Component {

  componentDidMount() {
    firebase.database().ref("-M_7S0a7J0QIP6ZujRyT").on("value", snapshot => {
      this.setState({drinks: snapshot.val()});
    });
    firebase.database().ref("orders").on("value", snapshot => {
      const obj = snapshot.val() || [];
      const orders = Object.values(obj)
      this.setState({orders: orders});
    });
  }

  handleChange(event) {
    this.setState({name: event.target.value});
  }

  handleMakeReady = order => {
    console.log(order)
  }
  handleDelete = order => {
    console.log(order)
  }

  constructor(props) {
    super(props);
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyA52ojVkvuUojaMSSFId0FK8cE6ShtbOSc",
        authDomain: "bar-menu-c36c8.firebaseapp.com",
        databaseURL: "https://bar-menu-c36c8-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "bar-menu-c36c8",
        storageBucket: "bar-menu-c36c8.appspot.com",
        messagingSenderId: "152548045451",
        appId: "1:152548045451:web:1cae6211de33be5f421a8e"
      };

      firebase.initializeApp(firebaseConfig);
    } catch (e) {
      console.log(e)
    }

    this.state = {
      drinks: [],
      orders: [],
      selectedDrink: null,
      name: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleOrder = () => {
    let ordersRef = firebase.database().ref("orders").push();
    ordersRef.set({
      drink: this.state.selectedDrink,
      name: this.state.name || "Anonymous",
      status: "No está listo"
    });
    window.location.href = "/status"
  }


  renderDrink = drink => {
    return (
      <div key={drink.name} className="drink">
        <h3>
          {drink.name}
        </h3>
        <div>
          {drink.description}
        </div>
        <img alt="drink" src={drink.image}/>
        <button style={{"marginBottom": "50px"}} onClick={() => this.setState({selectedDrink: drink})}>ELEGIR</button>
      </div>
    )
  }

  renderOrder = order => {
    return (
      <div key={order.drink.name} className="drink">
        <h2>
          {order.name}
        </h2>
        <h3>
          {order.drink.name}
        </h3>
        <div style={{"color": order.status === "Listo" ? "green" : "red"}} className="status">Estado: {order.status}</div>
        <img alt="drink" src={order.drink.image}/>
      </div>
    )
  }
  renderOrderForAdmins = order => {
    return (
      <div key={order.drink.name} className="drink">
        <h2>
          {order.name}
        </h2>
        <h3>
          {order.drink.name}
        </h3>
        <div style={{"color": order.status === "Listo" ? "green" : "red"}} className="status">Estado: {order.status}</div>
        <img alt="drink" src={order.drink.image}/>
        <button style={{"margin": "20px 0"}} onClick={() => this.handleMakeReady(order)}>HACER LISTO</button>
        <button onClick={() => this.handleDelete(order)}>BORRAR</button>
      </div>
    )
  }


  orderComponent = () => {
    if (this.state.selectedDrink) {
      return (
        <div className="order">
          <div style={{"marginBottom": "10px"}}>1x {this.state.selectedDrink.name} </div>
          <input value={this.state.name} placeholder="Nombre" onChange={this.handleChange}/>
          <button onClick={this.handleOrder} className="orderbutton">PEDIR</button>
        </div>)
    }
  }

  BarComponent = () => {
    return (
      <React.Fragment>
        {this.state.drinks.map(this.renderDrink)}
        {this.orderComponent()}
      </React.Fragment>
    )
  }
  StatusComponent = () => {
    return (
      <React.Fragment>
        {this.state.orders.map(this.renderOrder)}
      </React.Fragment>
    )
  }
  AdminComponent = () => {
    return (
      <React.Fragment>
        {this.state.orders.map(this.renderOrderForAdmins)}
      </React.Fragment>
    )
  }

  render() {
    return (
      <div className="App" id="calendar-app">
        <Router>
          <header>
            <Link style={{textDecoration: 'none'}} to="/">
              <div id="logo">
                <div>
                  EL BAR
                </div>
              </div>
            </Link>
          </header>
          <div className="nav">
            <Link to="">Menú</Link>
            <span>|</span>
            <Link to="/status">Pedidos</Link>
          </div>
          <main id="page-wrap">
            <Route path="/" exact component={this.BarComponent}/>
            <Route path="/status" exact component={this.StatusComponent}/>
            <Route path="/admin" exact component={this.AdminComponent}/>
          </main>
          <div className="copyright">
            © {new Date().getFullYear()} Torsten
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
