### Inspiration

### What it does

### How we built it
X is primarily built using the [Phaser game engine](https://phaser.io/) for JavaScript. We used Phaser to build the game screens, handle game logic and to add music to the application. To incoporate real-time flight data for flights around Gatwick, we used [FlightRadar24's RestAPI](https://fr24api.flightradar24.com/) and saved queries to a database to then load into the game. On the server side, we have a Flask server that we have dockerised and run on a mini Kubernetes server to allow for ease of scalabliity, e.g. to have several games running at once on multiple devices across airport gates.

### Challenges we ran into

### Accomplishments that we're proud of

### What we learned

### What's next for x
