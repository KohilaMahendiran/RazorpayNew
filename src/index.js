const express = require('express');
const cors=require('cors');
const Razorpay=require('razorpay');
const {products}=require("./data");
const app=express();
//razorpay instance
const key_id='rzp_test_ysB6nPiarDwS4h';
const key_secret='wJsrtwJN0CNbak3nG47Dr4yu';
const instance=new Razorpay({
    key_id,
    key_secret,
});

app.use(cors());
app.use(express.json());
app.get('/products',(req,res)=>{
    res.status(200).json(products)
})
app.get("/order/:productId",(req,res)=>{
    const {productId}=req.params;
    const product=products.find(product=> product.id==productId);

    const amount=product.price * 100 * 70;
    const currency='INR';
    const receipt='receipt#123';
    const notes={desc:product.description};
    instance.orders.create({amount, currency, receipt, notes},(error,order)=>{
        if(error){
            return res.status(500).json(error);
        }
        return res.status(200).json(order);
    });
});

app.post(`/verify/razorpay-signature`,(req,res)=>{
    console.log(JSON.stringify(req.body));
    const crypto=require('crypto');
    const hash=crypto.createHmac('SHA256',"mprKohila30061995#").update(JSON.stringify(req.body)).digest('hex');
    console.log(hash);
    console.log(req.headers['x-razorpay-signature']);
    if(hash===req.headers['x-razorpay-signature']){
        // save payment information in database for future reference
    }else{
        // declined the payment
    }
    res.status(200);
});
app.listen(8000,()=>{
    console.log("Server is listening on port " + 8000)
});