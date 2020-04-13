from flask import Flask, request, render_template, Response
from flask_cors import CORS
import json
app = Flask(__name__)
cors = CORS(app)
app.config["DEBUG"] = True

@app.route('/calculateProfit', methods = ['POST'])
def calculate():
        print(request.json)
        request_parameters = request.get_json()
        stockSymbol = request_parameters.get("stockSymbol")
        allotment = int(request_parameters.get("allotment"))
        finalSharePrice = int(request_parameters.get("finalSharePrice"))
        sellCommission = int(request_parameters.get("sellCommission"))
        initialSharePrice = int(request_parameters.get("initialSharePrice"))
        buyCommission = int(request_parameters.get("buyCommission"))
        capitalGainTaxRate = float(request_parameters.get("capitalGainTaxRate"))

        proceeds = allotment * finalSharePrice

        totalPurchasePrice = allotment * initialSharePrice
        totalCommissions = sellCommission + buyCommission
        expense = totalPurchasePrice + totalCommissions
        taxOnCapitalGain = (capitalGainTaxRate / 100) * (proceeds - expense)

        cost = expense + taxOnCapitalGain

        netProfit = proceeds - cost

        returnOnInvestment = (netProfit/cost) * 100

        breakEvenFinalSharePrice = expense / allotment

        data = {
            'proceeds' : (str(format(proceeds,'.2f'))),
            'cost' : (str(format(cost,'.2f'))),
            'netProfit' : (str(format(netProfit,'.2f'))),
            'returnOnInvestment' : (str(format(returnOnInvestment,'.2f'))),
            'breakEvenFinalSharePrice' : (str(format(breakEvenFinalSharePrice,'.2f'))),
        }
        response = json.dumps(data)

        resp = Response(response, status=200, mimetype='application/json')
        return resp

app.run()
