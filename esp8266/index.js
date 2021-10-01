var MongoClient=require('mongodb').MongoClient;

const mongoose = require("mongoose");
const express = require("express");
const app = express();
var myDataTem = [];
var myDataHum=[];
var myDataSpo2 =[];

const DATABASE_URL ="mongodb+srv://admin:admin@cluster0.zhsjs.mongodb.net/sensorArray";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
//connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);

//check connetc mongoose
mongoose.connection.on("connected", function (){
    console.log("connect successful");
})
mongoose.connection.on("disconnected", function (){
    console.log("connect fail");
});

//connect mongoose
var db=mongoose.connection;


//create model data
var DHT11Schema = new mongoose.Schema({
    id: Number,
    key:{type:String,default:"key123"},
    temperature:
        [{
            id: Number,
            data: Date,
            value: Number
        }]
    ,
    humidity :
        [{
            id: Number,
            data: Date,
            value: Number
        }]
    ,
    spo2:
        [{
            id: Number,
            data: Date,
            value: Number
        }]


});
//create collection mongodb
var DHT11 = mongoose.model("sensor", DHT11Schema);

//post data mongodb
app.post("/dht11", (req,res) =>{
    console.log("Received create dht11 data request post dht11");
    //get data request
    console.log("temp:",req.query.temperature);
    myDataTem.push(req.query.temperature);
    console.log("value: ",myDataTem);

    console.log("hum: ",req.query.humidity);
    myDataHum.push(req.query.humidity);
    console.log("value: ",myDataHum);

    console.log("spo2: ",req.query.spo2);
    myDataSpo2.push(req.query.spo2);
    console.log("value: ",myDataSpo2);
    var newDHT11 = DHT11({
        key:'device123',
        temperature:
            {
                id: Number,
                data: new Date(),
                value: req.query.temperature,
            }
        ,
        humidity:
            {
                id: Number,
                data: new Date(),
                value: req.query.humidity,
            }
        ,
        spo2:
            {
                id: Number,
                data: new Date(),
                value: req.query.spo2,
            }

    });

    //insert data
    // db.collection("sensor").insertOne(newDHT11,(err,result)=> {
    //     if (err) throw  err;
    //     console.log("Thêm thành công");
    //     console.log(result);
    // });


    // update data
    var oldValue={key:"device123"};
    var newValue={
        $push: {
            temperature:
                {
                    id: Number,
                    data: new Date(),
                    value: req.query.temperature,
                }
            ,
            humidity:
                {
                    id: Number,
                    data: new Date(),
                    // data:Date.now(),
                    value: req.query.humidity,
                }
            ,
            spo2:
                {
                    id: Number,
                    data: new Date(),
                    value: req.query.spo2,

                }

        }

    };

   db.collection("sensor").updateOne(oldValue,newValue,(err,obj)=>{
       if(err) throw  err;
        if(obj.length!=0) console.log("Cập nhật thành công");

   });
   res.send("thành công");

});
app.get("/dht11",(req,res) => {
    console.log("request create data");

    db.collection("sensor").findOne({},(err, array) => {
        if (err) {
            console.log("find error");
        }
        console.log("lấy dữ liệu thành công ");
        res.json(array);
    })

})


app.listen(3000, function () {
    console.log("sever is listening on port: "+ 3000);
});

