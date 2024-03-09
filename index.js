const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors'); 
const admin = require('firebase-admin'); 
var serviceAccount = require("./serviceAccountKey.json");
const app = express()
const port = 5000

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://elpwa-dab9d-default-rtdb.asia-southeast1.firebasedatabase.app"
});

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/productHistory',async (req,res)=>{
  try{
    const db = admin.firestore();
    var ref = db.collection('Machine'); //資料集
    const snapshot = await db.collection("Machine").orderBy('TimeStemp','desc').limit(10).get();
    const Minlist = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
    // Minlist.reverse()
    res.send(Minlist);

  }catch{
    console.error("Error getting data to Firestore:", error);
    res.status(500).json({ error: 'Failed to get data to Firestore' });
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})