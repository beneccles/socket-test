require('dotenv').config()
const express = require('express')
const socket = require('socket.io')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')

const server = app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} on station!`))
const io = socket(server)

const { SERVER_PORT, SESSION_SECRET,} = process.env

const app = express();

class Session {
    constructor(name) {
        this._name = name;
        this._X = 0;
        this._Y = 0;
        this._direction = "";
        this._interval = null;
    }
    getDirection() {
        return this._direction;
    }
    getInterval() {
        return this._interval
    }
    getName() {
        return this._name;
    }
    getX() { 
        return this._X;
    }
    getY() {
        return this._Y;
    }
    setX(x) {
        this._X = x;
    }
    setY(y) {
        this._Y = y;
    }
    setDirection(direction) {
        this._direction = direction;
    }
    setInterval(interval) {
        this._interval = interval;
    }
}

function generateId(len) {
    let result = "";
    for(let i = 0; i < len; i ++) {
       result += Math.floor(Math.random() * 10);
    }
    return result;
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



app.post('/create_user', (req, res) => {
    const sessionKey = generateId(24);
    sessions[sessionKey] = new Session(req.body.name);
    res.json({success: true, sessionKey})
})

const sessions = {};


app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET
}))

io.on('connection', socket => {
    setInterval(() => {
        const sessionKeys = Object.keys(sessions);
        const playerPositions = [];
        for (let i = 0; i < sessionKeys.length; i++) {
            const key = sessionKeys[i];
            const session = session[key];
            playerPositions.push({
                x: session.getX(),
                y: session.getY(),
                name: session.getName(),
                key: session.getName()
            })
        }

        socket.emit('player', playerPositions);
    }, Math.round(1000/30));

    socket.on('player', data => {
        const session = sessions[data.sessionKey];
        session.setX(data.x)
        session.setY(data.Y)
    });

})
