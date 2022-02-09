const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.semikart.com/',{
        waitUntil: 'networkidle0',
    });

    await page.waitForSelector('#keyword');
    await page.$eval('#keyword',element => element.value='2930578');
    await page.click('.header_search_button');
    await page.waitForSelector('#supplierTable',);

    const tableSelector='#supplierTable > tbody'
    const tableLength = await page.$$eval(`#supplierTable > tbody > tr `, el => el.length)  //vvIP
    const nodeChildren = await page.$eval(`#supplierTable > tbody`, (uiElement) => {
        return uiElement.children.length;
    });

    const itemList = [];
    class Items {
        constructor(id, supplier, stock, minimumOrder, wareHouse,priceSlab, orderValue,cutType) {
            this.id = id;
            this.supplier=supplier;
            this.stock=stock;
            this.minimumOrder=minimumOrder;
            this.wareHouse=wareHouse;
            this.priceSlab=priceSlab;
            this.orderValue=orderValue;
            this.cutType=cutType;
        }
    }

    console.log(nodeChildren)
    for(let i=1;i<=nodeChildren;i++){
        const id=i;
        const pTag=`${tableSelector} > tr:nth-child(${i}) > td:nth-child(3)`
        const pLength=await page.$$eval(`${pTag} > p `, el => el.length)
        let wareHouse;
        let minimumOrder;
        const supplier = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(2)`))
        const stock = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(3) > p:nth-child(1) > span `))
        if(pLength==4){
            minimumOrder = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(3) > p:nth-child(3) > span`))
            wareHouse= await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(3) > p:nth-child(4) > span`))
        }else{
             minimumOrder = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(3) > p:nth-child(2) > span`))
             wareHouse= await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(3) > p:nth-child(3) > span`))
        }

        let priceSlab = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(5)`))
        priceSlab=priceSlab.replace(/\n/g, ' , ');
        const cutType = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(4) > p:nth-child(1)`))
        const orderValue = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(7)`))
        const items=new Items(id, supplier, stock, minimumOrder, wareHouse,priceSlab, orderValue,cutType)
        itemList.push(items)
    }
    console.log(itemList)


    await browser.close();
})();


