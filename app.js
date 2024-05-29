import axios from "axios";
import express from "express";
import {PrismaClient} from "@prisma/client";
import * as dbActions from "./dbActions.js"
import { table } from "table";

/**
 * SQL QUERY TO LIST MOST PROFITABLE IN 5 YEARS AND CHEAPEST IN LAST MONTH
 * SELECT * FROM fonlar WHERE `getiri1a` IS NOT NULL AND getiri5y IS NOT NULL ORDER BY getiri1a ASC, getiri5y DESC
 */

//Express instance
const app = express();
const port = 3000;

//Prisma client
const prisma = new PrismaClient();

//Data To DB function
async function loadInvestData(response){

        console.log("Tablo verileri sıfırlanıyor..");
        await prisma.fonlar.deleteMany({where: {}});

        let totalInvestFunds =  response.data.data.length;
        console.log(totalInvestFunds+" fon tespit edildi");

        let investCounter = 0;

        for(const[key, invest] of Object.entries(response.data.data)){
                await prisma.fonlar.create({
                        data: {
                                kod: invest.FONKODU,
                                unvan: invest.FONUNVAN,
                                tur: invest.FONTURACIKLAMA,
                                getiri1a: invest.GETIRI1A,
                                getiri3a: invest.GETIRI3A,
                                getiri6a: invest.GETIRI6A,
                                getiri1y: invest.GETIRI1Y,
                                getiriyb: invest.GETIRIYB,
                                getiri3y: invest.GETIRI3Y,
                                getiri5y: invest.GETIRI5Y
                        }
                });
                investCounter++;
        }

        console.log(investCounter + ' adet fon veri girişi tamamlandı');

        console.log("VERILER GETIRILIYOR");
        let resultTable = await dbActions.fetchFunds();
        console.log(table(resultTable));
}


app.get('/query', (req,res) => {
   res.send('Ok');
});

app.listen(port, () => {
        console.log('ÇALIŞIYOR...');

        axios.post('https://www.tefas.gov.tr/api/DB/BindComparisonFundReturns', {
                "calismatipi": "2",
                "fontip": "YAT",
                "sfontur": "",
                "kurucukod": "",
                "fongrup": "",
                "bastarih": "Başlangıç",
                "bittarih": "Bitiş",
                "fonturkod": "",
                "fonunvantip": "",
                "strperiod": "1,1,1,1,1,1,1",
                "islemdurum": "1"
        }, {
                headers: {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "Referer": "https://www.tefas.gov.tr/FonKarsilastirma.aspx",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                }
        }).then(response => loadInvestData(response));
})