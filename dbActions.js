import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

async function fetchFunds(){
    let results = await prisma.$queryRaw`SELECT * FROM fonlar WHERE getiri1a IS NOT NULL AND getiri5y IS NOT NULL ORDER BY getiri1a ASC, getiri5y DESC`;

    console.log(results);

    let tableData = [];
    tableData.push(['KOD', 'TUR', '1A', '1Y', '3Y', '5Y']);

    results.forEach((v,i) => {

        tableData.push([
            v.kod,
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