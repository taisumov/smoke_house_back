const Router = require('express')
const router = new Router()
const nodemailer = require('nodemailer')

let mailToSend = 'islam.taisumov@yandex.com'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'islam.taisumov10@gmail.com',
        pass: 'wjjkuniwvuinrubv',
    },
});

class MailController {
    async send(req, res, next) {
        let fields = req.body
        let htmlInLetter = ''
        for (let [key, value] of Object.entries(fields)) {
            htmlInLetter += `<p>${key}: ${value}</p>`
        }

        console.log(htmlInLetter)

        const mailData = {
            from: 'islam.taisumov10@gmail.com',
            to: mailToSend,
            subject: 'Коптисам - заявка',
            text: 'Коптисам - заявка',
            html: htmlInLetter,
        };

        let info = await transporter.sendMail(mailData)
        return res.status(info.response ? 200 : 500).json("Message sent: " + info.messageId)
    }
}

const mailController = new MailController()
router.post('/', mailController.send)
module.exports = router
