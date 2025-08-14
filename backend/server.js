const express= require ('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path =require('path');
require ('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menuItem', menuRoutes);


app.use(express.static(path.join(__dirname , 'public')));
app.get('/', (req, res)=>{
  res.sendFile(__dirname, 'public', 'menuForm.html');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));