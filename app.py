from flask import Flask
from flightapi import getData
from json import dumps
from flask_cors import cross_origin

server = Flask(__name__,template_folder=".", static_folder="./assets")

@server.get("/flightdata")
@cross_origin
def getFlightData():
    return dumps(getData())
