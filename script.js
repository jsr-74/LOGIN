const API = "https://mail-send-pyapi.onrender.com";

let captcha = "";
let generatedOTP = "";
let otpTimerInterval;

/* 🎂 Dynamic title */
const mmdd = new Date().toISOString().slice(5,10).replace("-","");
document.title = "🎉 Birthday Login 💖";

/* CAPTCHA */
function generateCaptcha() {
    const chars = "ABCDEFGH123456789";
    captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("captchaText").innerText = captcha;
}
generateCaptcha();

/* CAPTCHA VERIFY */
document.getElementById("verifyCaptcha").addEventListener("change", function() {
    const input = document.getElementById("captchaInput").value;

    if (input === captcha) {
        document.getElementById("emailSection").classList.remove("hidden");
        showMsg("Captcha Verified ✅");
    } else {
        this.checked = false;
        showMsg("Wrong Captcha ❌");
    }
});

/* VALIDATION */
function validate() {
    const name = document.getElementById("username").value.toLowerCase();
    const pass = document.getElementById("password").value;

    if (name !== "akka") return showMsg("Enter correct user");
    if (!/^\d{8}$/.test(pass)) return showMsg("Use YYYYMMDD");
    if (!document.getElementById("verifyCaptcha").checked)
        return showMsg("Verify captcha");

    return true;
}

/* SEND OTP */
async function sendOTP() {

    if (!validate()) return;

    const email = document.getElementById("email").value;

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    await fetch(API + "/send-mail", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            receiver_email: email,
            otp: generatedOTP
        })
    });

    document.getElementById("popup").style.display = "flex";

    startOTPTimer();
}

/* OTP TIMER */
function startOTPTimer() {

    let duration = 300;
    const text = document.getElementById("otpTimerText");
    const btn = document.getElementById("verifyBtn");

    btn.disabled = false;

    clearInterval(otpTimerInterval);

    otpTimerInterval = setInterval(() => {

        duration--;

        let m = Math.floor(duration/60);
        let s = duration%60;

        text.innerText = `Expires ${m}:${s}`;

        if (duration <= 0) {
            clearInterval(otpTimerInterval);
            generatedOTP = "";
            btn.disabled = true;
            text.innerText = "Expired ⏱";
        }

    },1000);
}

/* OTP INPUT UX */
const inputs = document.querySelectorAll("#otpInputs input");

inputs.forEach((input,i)=>{
    input.addEventListener("input",()=>{
        if(input.value && i<5) inputs[i+1].focus();
    });

    input.addEventListener("keydown",(e)=>{
        if(e.key==="Backspace" && !input.value && i>0){
            inputs[i-1].focus();
        }
    });
});

/* GET OTP */
function getOTP() {
    return [...inputs].map(i=>i.value).join("");
}

/* VERIFY OTP */
function verifyOTP() {
    const otp = getOTP();

    if (otp === generatedOTP) {
        localStorage.setItem("bdayName", document.getElementById("username").value);
        window.location.href = "birthday.html";
    } else {
        showMsg("Invalid OTP ❌");
    }
}

/* MSG */
function showMsg(t){
    document.getElementById("msg").innerText = t;
}