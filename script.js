const yyyymmdd = new Date().toISOString().slice(5, 10).replace(/-/g, "");

const showPasswordCheckbox = document.getElementById('showPassword');
  if (yyyymmdd === "0501") {
    nameOfBirthdayPerson = "Reethika";
  } else if (yyyymmdd === "0519") {
    nameOfBirthdayPerson = "Navya";
  } else if (yyyymmdd === "0917") {
    nameOfBirthdayPerson = "Harika";
  } else if (yyyymmdd === "0927") {
    nameOfBirthdayPerson = "Jyothi";
  } else if (yyyymmdd === "1004") {
    nameOfBirthdayPerson = "Sravani";
  } else {
    nameOfBirthdayPerson = "Lakshmi";
  }

  document.title = `🎉 Happy Birthday ${nameOfBirthdayPerson} 💖`;
const API = "https://mail-send-pyapi.onrender.com";
let captcha = "";
let generatedOTP = "";
let otpTimerInterval;

/* CAPTCHA */
function generateCaptcha() {
    const chars = "ABCDEFGH123456789";
    captcha = Array.from({length:5}, () =>
        chars[Math.floor(Math.random()*chars.length)]
    ).join("");

    document.getElementById("captchaText").innerText = captcha;
}
generateCaptcha();   // Generate on load (DISPLAYS GENERETED CAPTCHA ON PAGE LOAD)

/* VERIFY CAPTCHA */
document.getElementById("verifyCaptcha").addEventListener("change", function() {

    const input = document.getElementById("captchaInput").value;

    if (input === captcha) {
        document.getElementById("emailSection").classList.remove("hidden");
        // document.getElementById("msg").style.color = "green";
        document.getElementById("verifyCaptchaLabel").style.color = "green";
        document.getElementById("verifyCaptchaLabel").innerText = "Verified";
        // showMsg("Captcha Verified ✅", "green");
            
    } else {
        if (input.value !== "") {
            showMsg("Please enter CAPTCHA", "red");
        }else {
        this.checked = false;
        showMsg("Wrong Captcha ❌", "red");
        }
    }
});

// SHOW PASSWORD
document.addEventListener("DOMContentLoaded", () => {

    const showPasswordCheckbox = document.getElementById("showPassword");
    const passwordInput = document.getElementById("password");
    const usernameInput = document.getElementById("username");

    showPasswordCheckbox.addEventListener("change", () => {

        if (showPasswordCheckbox.checked) {

            passwordInput.type = "text";

            // 🎨 style when visible
            passwordInput.style.background = "hsl(32,100%,70%)";
            passwordInput.style.color = "#000";

            usernameInput.style.color = "hsl(3,73%,31%)";

        } else {

            passwordInput.type = "password";

            // 🔁 reset styles
            passwordInput.style.background = "";
            passwordInput.style.color = "";
            usernameInput.style.color = "";

        }

    });

});
/* VALIDATE */
function validate() {

    const name = document.getElementById("username").value.toLowerCase();
    const pass = document.getElementById("password").value;

    if (name !== "akka") return showMsg("Invalid username", "red");
    if (!/^\d{8}$/.test(pass)) return showMsg("Use YYYYMMDD", "red");
    
// ✅ compare MMDD
    const enteredMMDD = pass.slice(4, 8);

    if (enteredMMDD !== yyyymmdd) return showMsg("Incorrect password", "red");
    return true;
}

/* SEND OTP */
async function sendOTP() {

    if (!validate()) return;

    const email = document.getElementById("email").value.trim();

    if (!email) return showMsg("Enter Correct email", "red");

    generatedOTP = Math.floor(100000 + Math.random()*900000).toString();

    showMsg("Sending OTP... 📧", "blue");

    try {

        const res = await fetch(API + "/send-mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                receiver_email: email,
                otp: generatedOTP
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "API Error");

        showMsg("OTP Sent Successfully ✅", "green");

        setTimeout(() => {
            document.getElementById("popup").style.display = "flex";
            focusFirst();
            startTimer();
        }, 1000);

    } catch (err) {
        console.error(err);
        showMsg("Failed to send OTP ❌", "red");
    }
}

/* OTP INPUT */
const inputs = document.querySelectorAll("#otpInputs input");

function focusFirst() {
    inputs[0].focus();
}

inputs.forEach((input,i)=>{

    input.addEventListener("input",()=>{
        input.value=input.value.replace(/\D/g,"");

        if(input.value){
            input.classList.add("filled");
            if(i<5) inputs[i+1].focus();
        }
    });

    input.addEventListener("keydown",(e)=>{
        if(e.key==="Backspace" && !input.value && i>0){
            inputs[i-1].focus();
        }
    });
});

/* PASTE */
document.getElementById("otpInputs").addEventListener("paste",(e)=>{
    const data = e.clipboardData.getData("text").replace(/\D/g,"");

    if(data.length===6){
        inputs.forEach((inp,i)=>{
            inp.value=data[i];
            inp.classList.add("filled");
        });
    }
});

/* GET OTP */
function getOTP(){
    return [...inputs].map(i=>i.value).join("");
}

/* VERIFY */
function verifyOTP(){

    const otp = getOTP();

    if(!generatedOTP){
        return showMsg("OTP expired ⏱ Please resend", "yellow");
    }

    if(otp === generatedOTP){
   clearfieldsdata()
        window.location.href = "birthday.html";
      

    } else {

        showMsg("Invalid OTP ❌", "red");
        clearOTPInputs();
    }
}

/* TIMER */
function startTimer(){

    let t = 60; // 1 minute

    const el = document.getElementById("otpTimerText");

    clearInterval(otpTimerInterval);

    otpTimerInterval = setInterval(()=>{

        t--;
        el.innerText = "Expires " + t + "s";

        if(t <= 0){

            clearInterval(otpTimerInterval);

            // ❌ expire OTP
            generatedOTP = "";

            // ❌ close popup
            closePopup();

            // ❌ clear inputs
            clearOTPInputs();

            // ✅ message
            showMsg("OTP expired ⏱ Please resend", "yellow");

            // ✅ enable resend button
            document.getElementById("resendBtn").disabled = false;
        }

    },1000);
}

/* MESSAGE */
function showMsg(t,col){
    document.getElementById("msg").style.color = col;
    document.getElementById("msg").innerText=t;
}

function closePopup(){
    document.getElementById("popup").style.display = "none";
}

function clearOTPInputs(){
    const inputs = document.querySelectorAll("#otpInputs input");

    inputs.forEach(i=>{
        i.value = "";
        i.classList.remove("filled");
    });

    inputs[0].focus();
}


function clearfieldsdata(){
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("email").value = "";
    document.getElementById("captchaInput").value = "";
}
