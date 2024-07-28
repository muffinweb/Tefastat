import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

function isNumber(number){
    return typeof number === 'number' && isFinite(number);
}

function prepareGraph(profitMonth, profitYear, profitThreeYear, profitFiveYears){
    let args = [];
    for(const[i,getiri] of Object.entries(arguments)){
        let _getiri = Number(getiri);

        if(!isNumber(_getiri)){
            args.push(null);
            continue;
        }

        if(_getiri > 0){
            args.push(true);
            continue;
        }else if (_getiri < 0){
            args.push(false);
            continue;
        }else{
            args.push(null);
        }

    }
    return args;
}

async function fetchFunds(){
    let results = await prisma.$queryRaw`SELECT * FROM fonlar WHERE getiri1a IS NOT NULL AND getiri5y IS NOT NULL ORDER BY getiri1a ASC, getiri5y DESC`;

    let tableData = [];
    tableData.push(['KOD', 'ADI', 'TUR', '1A', '1Y', '3Y', '5Y']);

    results.forEach((v,i) => {

        let profitStats = prepareGraph(v.getiri1a, v.getiri1y, v.getiri3y, v.getiri5y);

        v.getiri1a = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri1a);
        v.getiri1y = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri1y);
        v.getiri3y = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri3y);
        v.getiri5y = new Intl.NumberFormat('tr-TR', {maximumFractionDigits:2}).format(v.getiri5y);

        if(profitStats[0] !== null){
            if(profitStats[0]){
                v.getiri1a = "\x1b[42m " + v.getiri1a + " \x1b[0m";
            }else{
                v.getiri1a = "\x1b[41m " + v.getiri1a + " \x1b[0m";
            }
        }

        if(profitStats[1] !== null){
            if(profitStats[1]){
                v.getiri1y = "\x1b[42m " + v.getiri1y + " \x1b[0m";
            }else{
                v.getiri1y = "\x1b[41m " + v.getiri1y + " \x1b[0m";
            }
        }

        if(profitStats[2] !== null){
            if(profitStats[2]){
                v.getiri3y = "\x1b[42m " + v.getiri3y + " \x1b[0m";
            }else{
                v.getiri3y = "\x1b[41m " + v.getiri3y + " \x1b[0m";
            }
        }

        if(profitStats[3] !== null){
            if(profitStats[3]){
                v.getiri5y = "\x1b[42m " + v.getiri5y + " \x1b[0m";
            }else{
                v.getiri5y = "\x1b[41m " + v.getiri5y + " \x1b[0m";
            }
        }

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