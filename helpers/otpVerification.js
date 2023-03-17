require('dotenv').config()
const serviceSID = process.env.TWILIO_SERVICE_SID
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSID,authToken)

const doSms = (phoneNumber) => {
    let resp = {}
    return new Promise((resolve,reject)=>{
        client.verify.v2.services(serviceSID).verifications.create({
            to: `+91${phoneNumber}`,
            channel: "sms"
          })
          .then((res) => {
            resp.valid = true
            resolve(resp)
          }).catch((err) => {
            reject(err)
          })
    })
}

const verifyOtp = (phoneNumber, otpCode) => {
    return new Promise((resolve, reject) => {
      client.verify.v2.services(serviceSID).verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otpCode
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
}

module.exports = {
   verifyOtp,doSms
}