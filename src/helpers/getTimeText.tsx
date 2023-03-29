
export const getTimeText = (seconds:number, full?:boolean) => {

    //De minutos a minutos y horas
    const hours = Math.floor(seconds/3600);
    const minutes = Math.floor(seconds/60)%60;
    seconds = seconds%60;
    let timeText ='';
    let h = 'h ';
    let m = 'min ';
    let s = 's';
    if(full){
        h = 'horas ',
        m = 'minutos',
        s = 'segundos'
    }

    if(hours!=0)
        timeText = hours + h;
    if(minutes!=0){
        if(full && minutes == 1)
            m='minuto'
        timeText += minutes + m;
    }
    if(seconds!=0){
        if(full && seconds == 1)
            s='segundo'
        timeText += seconds + s;
    }
    return (
        timeText
    )
}
