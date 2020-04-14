import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    this.state = {
      stockSymbol: null,
      allotment: null,
      finalSharePrice: null,
      sellCommission: null,
      initialSharePrice: null,
      buyCommission: null,
      capitalGainTaxRate: null,
      proceeds : 0.0,
      cost : 0.0,
      netProfit : 0.0,
      returnOnInvestment : 0.0,
      breakEvenFinalSharePrice : 0.0,
      result: false,
      error : false,
      scrollMessage : false
    }
  }
  // Initializing the state variables
  componentWillMount() {
    this.setState({
      stockSymbol: '',
      allotment: null ,
      finalSharePrice: null,
      sellCommission: null,
      initialSharePrice: null,
      buyCommission: null,
      capitalGainTaxRate: null,
      proceeds: 0.0,
      cost: 0.0,
      netProfit: 0.0,
      returnOnInvestment: 0.0,
      breakEvenFinalSharePrice: 0.0,
    })
  }
  calculate = () => {
    let dataToSend = {
      stockSymbol: this.state.stockSymbol,
      allotment : this.state.allotment,
      finalSharePrice: this.state.finalSharePrice,
      sellCommission: this.state.sellCommission,
      initialSharePrice: this.state.initialSharePrice,
      buyCommission: this.state.buyCommission,
      capitalGainTaxRate: this.state.capitalGainTaxRate

    }
    axios.post(`http://3.22.186.94:5000/calculateProfit`, dataToSend)
      .then(response => {
        console.log("response-->", response)
        if(response.status === 200) {
          console.log("hererererer")
          this.setState({
            proceeds : response.data.proceeds,
            cost : response.data.cost,
            netProfit : response.data.netProfit,
            returnOnInvestment : response.data.returnOnInvestment,
            breakEvenFinalSharePrice : response.data.breakEvenFinalSharePrice,
          })
          this.setState({
            result : true,
            error: false,
            scrollMessage: true
          })
          this.clearData();
        } else {
          this.setState({
            error: true,
            scrollMessage:false
          })
          this.clearResponseData();
        }
      }).catch(err => {
        console.log(`Error in calling api to calculate ${err}`)
        this.setState({
          error: true,
          scrollMessage:false
        })
        this.clearResponseData();
      })
  }

  // Clear the input fields
  clearData = () => {
    this.setState({
      stockSymbol: '',
      allotment: 0,
      finalSharePrice: 0,
      sellCommission: 0,
      initialSharePrice: 0,
      buyCommission: 0,
      capitalGainTaxRate: 0
    })
  }

  clearResponseData = () => {
    this.setState({
      proceeds: 0.0,
      cost: 0.0,
      netProfit: 0.0,
      returnOnInvestment: 0.0,
      breakEvenFinalSharePrice: 0.0
    })
  }

  // Render the html view
  render() {
    let success = this.state.result;
    let data;
    if (success) {
      data = <div class="text-center">
      <h3 class="heading">Stock Profit Report</h3>
      <table class="table table-striped table-heading">
        <tr>
          <th> Proceeds :  </th>
          <td> $ { this.state.proceeds } </td>
        </tr>
        <tr>
          <th> Cost :  </th>
          <td> $ { this.state.cost } </td>
        </tr>
        <tr>
          <th> Net Profit :  </th>
          <td> $ { this.state.netProfit } </td>
        </tr>
        <tr>
          <th> Return on Investment :  </th>
          <td> { this.state.returnOnInvestment } % </td>
        </tr>
        <tr>
          <th> Break Even Final Share Price :  </th>
          <td> $ { this.state.breakEvenFinalSharePrice } </td>
        </tr>
      </table>
    </div>;
    }
    return (
      <body>
        <div class="text-center heading">
          <h3 class="heading">Compute your Stock Profit</h3>
        </div>
        <form class="container form-group form-heading" action="http://localhost:5000/calculate" method="post">
          <p>Enter Stock Symbol:</p>
          <input type="text"
            name="stockSymbol"
            value={this.state.stockSymbol}
            onChange={(event) => {
              this.setState({
                stockSymbol: event.target.value
              })
            }}
            required
            class="form-control"
          />

          <p>Enter Allotment(number of shares):</p>
          <input value={this.state.allotment}
            onChange={(event) => {
              this.setState({
                allotment: event.target.value
              })
            }}
            required min="0" class="form-control" type="number" name="allotment" />

          <p>Enter Final share price (in dollars):</p>
          <input value={this.state.finalSharePrice}
            onChange={(event) => {
              this.setState({
                finalSharePrice: event.target.value
              })
            }}
            required min="1" class="form-control" type="number" name="finalSharePrice" />

          <p>Sell Commission (in dollars):</p>
          <input value={this.state.sellCommission}
            onChange={(event) => {
              this.setState({
                sellCommission: event.target.value
              })
            }}
            required min="0" class="form-control" type="number" name="sellCommission" />

          <p>Inital Share Price (in dollars):</p>
          <input
            value={this.state.initialSharePrice}
            onChange={(event) => {
              this.setState({
                initialSharePrice: event.target.value
              })
            }}
            required min="1" class="form-control" type="number" name="initialSharePrice" />

          <p>Enter Buy Commission (in dollars):</p>
          <input value={this.state.buyCommission}
            onChange={(event) => {
              this.setState({
                buyCommission: event.target.value
              })
            }}
            required min="0" class="form-control" type="number" name="buyCommission" />

          <p>Enter Captial Gain Tax Rate (in %):</p>
          <input value={this.state.capitalGainTaxRate}
            onChange={(event) => {
              this.setState({
                capitalGainTaxRate: event.target.value
              })
            }}
            required min="0" step="0.01" class="form-control heading" type="number" name="capitalGainTaxRate" />
          {this.state.error ? <p className="text-center">Incorrect data. Try again.</p> : <p></p>}
          {this.state.scrollMessage ? <p className="text-center">Scroll down to see results.</p> : <p></p>}
          <div className="text-center">
            <button className="btn btn-primary margin-top" type="button" onClick={() => this.calculate()}>Calculate Stock Profit</button>
          </div>
        </form>
        {data}
      </body>
    )
  }
}

export default App
