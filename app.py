from flask import Flask
from flightapi import getData
from json import dumps

server = Flask(__name__,template_folder=".", static_folder="./assets")

@server.get("/flightdata")
def getFlightData():
    return dumps(getData())
