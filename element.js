const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://in.element14.com/',{
        waitUntil: 'networkidle0',
    });
    await page.waitForSelector('.search-txt');
    await page.$eval('.search-txt',element => element.value='res 0r0')
    await page.click('.search-btn')
    // await page.waitForNavigation();
    await page.waitForSelector('#sProdList');
    const itemList = []
    // class Items {
    //     constructor(id, name, population, percentage, date, source) {
    //         this.id = id
    //         this.name = name
    //         this.population = population
    //         this.percentage = percentage
    //         this.date = date
    //         this.source = source
    //     }
    // }
    class Items {
        constructor(id, mfrPartNumber, mfr, descriptions, category, supplier,minMult) {
            this.id = id
            this.mfrPartNumber=mfrPartNumber;
            this.mfr=mfr;
            this.descriptions=descriptions;
            this.category=category;
            this.supplier=supplier;
            this.minMult=minMult;
        }
    }

    const tableSelector='#sProdList > tbody'
    const tableLength = await page.$$eval(`${tableSelector} > tr`, el => el.length)

    const suppliers=[]
    class SupplierObj {
        constructor(name) {
            this.name=name;
        }
    }
    for(let i=1;i<2+1;i++){
        const id=i;

        const mfrPartNumber = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(4)`))
        const mfr = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(5)`))
        const descriptions = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(6)`))
        const category = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(7)`))
        const supplier = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(7)`))



        const minMult = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(6)`))


        const actualItem = new Items(id,mfrPartNumber, mfr, descriptions,category,supplier,minMult)
        itemList.push(actualItem)
    }
    console.log(itemList)


    await browser.close();
})();