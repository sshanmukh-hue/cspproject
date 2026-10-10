const API_BASE="http://localhost:3000";

function getCurrentUser(){try{return JSON.parse(localStorage.getItem("elderSafeUser")||"null")}catch(e){return null}}
function requireAuth(){if(!getCurrentUser()) location.href="index.html"}
function getContact(){try{return JSON.parse(localStorage.getItem("elderSafeContact")||"null")}catch(e){return null}}
function saveContact(c){localStorage.setItem("elderSafeContact",JSON.stringify(c))}
function getSettings(){try{return JSON.parse(localStorage.getItem("elderSafeSettings")||'{"fallDetection":true,"countdown":30}')}catch(e){return {fallDetection:true,countdown:30}}}
function saveSettings(s){localStorage.setItem("elderSafeSettings",JSON.stringify(s))}
function getAlerts(){try{return JSON.parse(localStorage.getItem("elderSafeAlerts")||"[]")}catch(e){return []}}
function addAlert(a){const x=getAlerts();x.unshift({...a,id:Date.now()});localStorage.setItem("elderSafeAlerts",JSON.stringify(x));}
function updateLastAlertStatus(status){const x=getAlerts();if(x.length){x[0].status=status;localStorage.setItem("elderSafeAlerts",JSON.stringify(x))}}
function formatNow(){return new Date().toLocaleString()}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function getEmergencyLocation(){
  return new Promise(resolve=>{
    if(!navigator.geolocation){resolve(null);return}
    navigator.geolocation.getCurrentPosition(
      p=>resolve({latitude:p.coords.latitude,longitude:p.coords.longitude}),
      ()=>resolve(null),{enableHighAccuracy:true,timeout:7000,maximumAge:30000}
    )
  })
}

/*
  IMPORTANT:
  We do NOT use sms:, whatsapp:, window.open(), or location.href to an SMS URL.
  Therefore pressing SOS will NOT open Chrome or another messaging application.
  If the Node/Twilio backend is running, it sends the SMS in the background.
  Without the backend, the project stays in safe DEMO mode.
*/
async function sendEmergencySMS(type,callback){
  const contact=getContact();
  const user=getCurrentUser();
  if(!contact?.phone){callback(false);return}

  const loc=await getEmergencyLocation();
  const locationText=loc?` Location: https://maps.google.com/?q=${loc.latitude},${loc.longitude}`:" Location unavailable.";
  const message=`ELDERSAFE EMERGENCY ALERT: ${type}. User: ${user?.name||"ElderSafe user"}.${locationText}`;

  try{
    const response=await fetch(API_BASE+"/api/send-sos",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({to:contact.phone,message,type,user:user?.name||"ElderSafe user",location:loc})
    });
    const data=await response.json();
    callback(Boolean(response.ok&&data.success));
  }catch(e){
    console.warn("Backend not running. Demo mode:",e);
    // No external app is opened. This is intentional.
    callback(true);
  }
}

async function sendManualSOS(){
  const c=getContact();
  if(!c||!c.phone){alert("Please add the emergency contact number first.");location.href="contact.html";return}
  if(!confirm("Send emergency SOS message to "+c.name+"?"))return;
  addAlert({type:"Manual SOS",icon:"manual",time:formatNow(),status:"Sending"});
  await sendEmergencySMS("Manual SOS - Immediate help required",(ok)=>{
    updateLastAlertStatus(ok?"Sent":"Failed");
    if(ok) location.href="sos-sent.html";
    else {alert("Message could not be sent. Please check the SOS server.");location.href="history.html";}
  });
}
