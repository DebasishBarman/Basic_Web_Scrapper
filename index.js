const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.semikart.com/',{
        waitUntil: 'networkidle0',
    });

    await page.waitForSelector('#keyword');
    await page.$eval('#keyword',element => element.value='CAP 100');
    await page.click('.header_search_button');
    await page.waitForSelector('#search_table12');
    const itemList = [];
    class Items {
        constructor(id, mfrPartNumber, mfr, descriptions, category, sup,minMult) {
            this.id = id
            this.mfrPartNumber=mfrPartNumber;
            this.mfr=mfr;
            this.descriptions=descriptions;
            this.category=category;
            this.sup=sup;
            this.minMult=minMult;
        }
    }

    const tableSelector='.search-tab > tbody'
    const tableLength = await page.$$eval(`${tableSelector} > tr`, el => el.length)


    class SupplierObj {
        constructor(sl,supplier,pricing) {
            this.sl=sl;
            this.supplier=supplier;
            this.pricing=pricing;
        }
    }

    for(let i=1;i<=tableLength;i++){
        const id=i;
        let sup=[];
        const subTableSelector=`${tableSelector} >  tr:nth-child(${i}) > .net-tab > .table > tbody`;
        const subTableLength = await page.$$eval(`${tableSelector} >  tr:nth-child(${i}) > .net-tab > .table > tbody > tr`, el => el.length)
        const mfrPartNumber = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(4)`))
        const mfr = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(5)`))
        const descriptions = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(6)`))
        const category = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(7)`))

        for(let j=1;j<=subTableLength;j++){
            const sl=j;
            const supplier=await page.evaluate(el => el.innerText, await page.$(`${subTableSelector}  > tr:nth-child(${j}) > td:nth-child(2)`))
            const pricing=await page.evaluate(el => el.innerText, await page.$(`${subTableSelector}  > tr:nth-child(${j}) > td:nth-child(3) > div > span`))
            // const obj=new SupplierObj(sl,supplier,pricing);
            // sup.push(obj);
            sup.push({"sl":sl,"supplierName":supplier,"pricing":pricing})
        }
        const minMult = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(6)`))
        const actualItem = new Items(id,mfrPartNumber, mfr, descriptions,category,sup,minMult)
        itemList.push(actualItem)
        sup=[];
    }
    console.log(itemList)
    // itemList.map((el)=>{
    //     el.sup.map((e)=>{
    //         console.log(e)
    //     })
    // })


    await browser.close();
})();