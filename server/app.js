const express = require('express'), 
app = express(),
mongoose = require('mongoose'), 
customerRoutes = require('./routes/customerRoutes.js');
productRoutes = require('./routes/productRoutes.js')

// to print incoming requests from mongoose in the terminal
mongoose.set('debug',true)
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const cors = require('cors')
app.use(cors())

require('dotenv').config({ path: './.env' });

/*Cyclic*/
const PORT = process.env.PORT || 3030;
mongoose.set('strictQuery', false);


// ADMINJS

// first install adminjs and the dependencies
// npm i adminjs @adminjs/express @adminjs/mongoose  tslib express-formidable express-session

// require adminjs
const AdminJS = require('adminjs')
// require express plugin
const AdminJSExpress = require('@adminjs/express')
// require mongoose adapter
AdminJS.registerAdapter(require("@adminjs/mongoose"));
// Import all the project's models
const Customers = require("./models/Customer.js"); // replace this for your model
const Products = require("./models/Products.js"); // replace this for your model

const UsersAdmin = require("./admin/resource_options/users.admin"); // replace this for your model
const buildAdminRouter = require("./admin/admin.router");

const adminOptions = new AdminJS({
  resources: [Categories, Products, UsersAdmin], // the models must be included in this array
  rootPath: "/admin"
});

// initialize adminjs 
const admin = new AdminJS(adminOptions,buildAdminRouter)
// build admin route
const router = buildAdminRouter(admin);
app.use(admin.options.rootPath, router);
// end ADMINJS


// connecting to mongo and checking if DB is running
async function connecting(){
try {
    await mongoose.connect(process.env.MONGO)
    console.log('Connected to the DB')
} catch ( error ) {
    console.log('ERROR: Seems like your DB is not running, please start it up !!!');
}
}
connecting()
// end of connecting to mongo and checking if DB is running

app.use('/payment', require('./routes/payment.route.js'));
app.use('/Login', customerRoutes);
app.use('/Products', productRoutes);
const path = require('path');
// we need to import 'path' module from node.js

app.use('/assets', express.static(path.join(__dirname, 'static')))

/*cyclic*/
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

/**/



app.listen(PORT, () => console.log(`listening on port`))