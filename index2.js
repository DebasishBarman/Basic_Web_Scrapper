for(let i=1;i<countriesLength+1;i++){
    const id=i;
    const mfrPartNumber = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(4)`))
    const mfr = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(5)`))
    const description = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(6)`))
    const category = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(7)`))
    const supplier = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(8)`))
    const minMult = await page.evaluate(el => el.innerText, await page.$(`${tableSelector} > tr:nth-child(${i}) > td:nth-child(9)`))


    const actualItem = new Items(id,mfrPartNumber, mfr, description,category,supplier,minMult)
    itemList.push(actualItem)
}