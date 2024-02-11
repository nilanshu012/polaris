import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const localUrl = 'mongodb://127.0.0.1:27017/someDB';

const uri = process.env.uri;

//const uri = localUrl;
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = mongoose.connect(uri);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isLost: {
        type: Boolean,
        default: false,
    },
    comments: {
        type: Array,
    },
});

const Data = mongoose.model('Data', dataSchema);

let theme = 'default';
let savedata = '';
let themeStyle = 'light';

app.get('/', async (req, res) => {
    try {
        const data = await Data.find();
        res.status(201).send(data);
    } catch (error) {
        console.log('Error fetching data');
    }
});

app.post('/save', async (req, res) => {
    //console.log(req.body);
    //const id = req.body.id;
    // console.log(`Id is ${id}`);

    const userData = req.body.value;
    console.log(req.body);

    console.log(`Data is ${userData}`);
    try {
        const data = await Data.create({ ...req.body });
        // res.redirect(`/${data.id}`);
        console.log('added succesfully');
        res.status(201).json({
            data,
        });
        console.log(data.id);
    } catch (error) {
        console.log('Error saving data');
    }
});

app.post('/comment', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    console.log(`Id is ${id}`);

    console.log(id);
    const comments = req.body.comments;
    console.log(comments);

    try {
        const data = await Data.findByIdAndUpdate(
            { _id: id },
            { comments: comments }
        );
        res.status(201).json({ comments });
        console.log(data);
    } catch (error) {
        console.log('Error Updating data');
    }
});

app.post('/delete', async (req, res) => {
    const id = req.body.id;
    console.log(id);
    try {
        const data = await Data.findByIdAndDelete(id);
        console.log(`deleted id ${id}`);
        res.status(201).json({
            msg: 'deleted successful',
        });
    } catch (error) {
        console.log(`Error deleting data ${error}`);
    }
});

connectDB().then(() =>
    app.listen(port, () => {
        console.log(`Server running on ${port}`);
    })
);
