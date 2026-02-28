from flask import Flask, render_template, make_response
import flightapi

server = Flask(__name__,template_folder=".", static_folder="./assets")

@server.get("/")
def getHomepage():
    return make_response(render_template("index.html"))

