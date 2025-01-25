import app from './app.js';
import connectDB from './src/db/database.db.js';


const port = process.env.PORT || 5000 ;

connectDB() ;

app.get('/', (req, res) => {
    res.send('Hello World!') ;
})

app.listen(port , () => {
    console.log(`Server is running on port ${port}`) ;
})