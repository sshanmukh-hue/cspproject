require("dotenv").config();
const express=require("express"),cors=require("cors"),twilio=require("twilio");
const app=express(); app.use(cors()); app.use(express.json());
const port=process.env.PORT||3000;

app.get("/api/health",(req,res)=>res.json({success:true,service:"ElderSafe SOS Server"}));

app.post("/api/send-sos",async(req,res)=>{
  const {to,message}=req.body||{};
  if(!to||!message)return res.status(400).json({success:false,error:"Missing phone number or message"});
  if(!process.env.TWILIO_ACCOUNT_SID||!process.env.TWILIO_AUTH_TOKEN||!process.env.TWILIO_PHONE_NUMBER)
    return res.status(500).json({success:false,error:"Twilio is not configured"});
  try{
    const client=twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
    const result=await client.messages.create({body:message,from:process.env.TWILIO_PHONE_NUMBER,to});
    res.json({success:true,messageSid:result.sid});
  }catch(err){console.error(err);res.status(500).json({success:false,error:"SMS sending failed"});}
});
app.listen(port,()=>console.log(`ElderSafe SOS server running on http://localhost:${port}`));
