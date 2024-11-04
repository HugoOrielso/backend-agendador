import mongoose from "mongoose";

const urlConnection = process.env.NODE_ENV == "development" ? 'mongodb://127.0.0.1:27017/ricciaUsers' : 'mongodb+srv://hugooxxxorielso:icoQQAWMkxVYjipy@cluster0.yg0le.mongodb.net/calendarRiccia'

console.log(urlConnection);

export async function connectionDBMongoose(){
    try {
        await mongoose.connect(urlConnection);
        console.log('conected to db');
    } catch (error) {
        console.log(error);
    }
}
