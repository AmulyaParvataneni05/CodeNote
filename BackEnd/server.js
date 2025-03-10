const exp = require("express");
const app = exp();
const cors = require('cors');
app.use(cors({
  origin :'https://deployment-test-r6uu.vercel.app',
  credentials:true
}))
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});


require('dotenv').config();
const { MongoClient } = require("mongodb");
let mClient = new MongoClient(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
mClient
  .connect()
  .then((connectionObj) => {
    //connect to a database(fsd)
    const fsddb=connectionObj.db('CodeNotedb');
    //connect to a collection
    const usersCollection=fsddb.collection('User-Details')
    //const productsCollection=fsddb.collection('products')
    // const cartCollection=fsddb.collection('cart')
    //share collection obj tp APIS
    app.set('usersCollection',usersCollection);
    //app.set('productsCollection',productsCollection);
    // app.set('productsCollection',cartCollection);
    const userApp = require("./API/UserAPI"); 
    app.use("/users", userApp);
    console.log("Db connection success");
    //assign port numbr to http server of express app
    app.listen(process.env.PORT, () => console.log("http server started on port 5000"));
  })
  .catch((err) => console.log("Error in DB connection", err));