from flask import Flask
from flightapi import getData
from json import dumps
from flask_cors import CORS

server = Flask(__name__,template_folder=".", static_folder="./assets")

CORS(server)

@server.get("/flightdata")
def getFlightData():
    return dumps(getData())
