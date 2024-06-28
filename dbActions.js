import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

async function fetchFunds(){
    let results = await prisma.$queryRaw`SELECT * FROM fonlar WHERE getiri1a IS NOT NULL AND getiri5y IS NOT NULL ORDER BY getiri1a ASC, getiri5y DESC`;

    let tableData = [];
    tableData.push(['KOD', 'ADI', 'TUR', '1A', '1Y', '3Y', '5Y']);

    results.forEach((v,i) => {

        //Change Result values to tr-TR curreny format

        v.getiri1a = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri1a);
        v.getiri1y = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri1y);
        v.getiri3y = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri3y);
        v.getiri5y = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri5y);

        tableData.push([
            v.kod,
            v.unvan,
            v.tur,
            v.getiri1a,
            v.getiri1y,
            v.getiri3y,
            v.getiri5y
        ]);

    })

    return tableData;

}

export {
    fetchFunds
}