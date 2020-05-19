const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const cors = require('cors')

const Event = require('./models/event')

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
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
                })
                return event.save().then(result => {
                    console.log(result)
                    return { ...result._doc };
                }).catch(err => {
                    console.log(err)
                    throw err;
                });

                // return event;
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