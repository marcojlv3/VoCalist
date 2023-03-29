import { Units } from '../data/AudioText';

const numbers = new Map<string,number>([
    ['cero', 0],
    ['un', 1],
    ['uno', 1],
    ['una', 1],
    ['dos', 2],
    ['tres', 3],
    ['cuatro', 4],
    ['cinco', 5],
    ['seis', 6],
    ['siete', 7],
    ['ocho', 8],
    ['nueve', 9],
    ['diez', 10],
    ['once', 11],
    ['doce', 12],
    ['trece', 13],
    ['catorce', 14],
    ['quince', 15],
    ['dieciseis', 16],
    ['diecisiete', 17],
    ['dieciocho', 18],
    ['diecinueve', 19],
    ['veinte', 20],
    ['veintiun', 21],
    ['veintiuna', 21],
    ['veintiuno', 21],
    ['veintidos', 22],
    ['veintitres', 23],
    ['veinticuatro', 24],
    ['veinticinco', 25],
    ['veintiseis', 26],
    ['veintisiete', 27],
    ['veintiocho', 28],
    ['veintinueve', 29],
    ['treinta', 30],
    ['cuarenta', 40],
    ['cincuenta', 50],
    ['sesenta', 60],
    ['setenta', 70],
    ['ochenta', 80],
    ['noventa', 90],
    ['cien', 100],
]);

export const getNumberAndUnitFromSpeech = (speech:string) => {
    let total = 0;
    let cont = 0;
    let textNumbers:string[] = [];

    const split = speech.split(' ');
    const unit = split[split.length-1];

    if(Units.includes(unit)){//si no dice alguna de las unidades de medida, no se reconoce
        
        for(let i = 1; i < split.length - 1; i++){
            textNumbers.push(split[i]);
        }

        let aux = parseInt(textNumbers[0]);

        if(!isNaN(aux)){
            cont = 1;
            total = aux;

        } else {
            
            for (let i = 0; i < textNumbers.length; i++) {
                if (numbers!=undefined && numbers.has(textNumbers[i]) && numbers.get(textNumbers[i])!=undefined) {
                    total += numbers.get(textNumbers[i])!;
                    cont++;
                }
            }

        }
        
        if(cont > 0)
            return {total,unit};
    }
        
    return null;
}
