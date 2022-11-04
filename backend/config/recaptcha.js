const Recaptcha = require('express-recaptcha').RecaptchaV2
//import Recaptcha from 'express-recaptcha'
export const recaptcha = async () => {
    try { new Recaptcha(process.env.SITE_KEY, process.env.SECRET_KEY) }
    catch (error) {
        process.exit(1);
    }
};