const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const Event = require('./models/event')
const User = require('./models/user')

const app = express();


app.use(cors());
app.use(bodyParser.json());

// const events = []

const mongoDB = "mongodb://localhost/mongodb"
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

})
mongoose.Promise = global.Promise;


app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String!
            createEvents: [String!]!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then(events => {
                        console.log(events);
                        return events.map(event => {
                            return { ...event._doc }
                        });
                    })
                    .catch(err => {
                        console.log(err)
                        throw err
                    })
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    date: new Date(args.eventInput.date),
                    creator: '5ec8c28668dc1e03f5a961a8'
                })
                let createEvent;
                return event.save()
                    .then(result => {
                        createEvent = { ...result._doc, _id: result._doc._id.toString() }
                        return User.findById("5ec8c28668dc1e03f5a961a8")
                    })
                    .then(user => {
                        if (!user) {
                            throw new Error('User not found');
                        }
                        user.createEvents.push(event);
                        return user.save();
                    })
                    .then(result => {
                        return createEvent
                    })
                    .catch(err => {
                        console.log(err)
                        throw err;
                    });
            },
            createUser: (args) => {
                return User.findOne({ email: args.userInput.email })
                    .then(user => {
                        if (user) {
                            throw new Error('Users exists already.')
                        }
                        return bcrypt.hash(args.userInput.password, 12)
                    })
                    .then(hashPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashPassword
                        })
                        return user.save()
                    })
                    .then(result => {
                        return { ...result._doc, _id: result.id }
                    })
                    .catch(err => {
                        throw err
                    })
            }
        },
        graphiql: true
    })
);

app.listen(3000, () => {
    console.log('Listening at 3000...')
})


const db = mongoose.connection;
//Ràng buộc kết nối với sự kiện lỗi (để lấy ra thông báo khi có lỗi)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));