export const formateTime = (seconds:number) => {
    const hours = Math.floor(seconds/3600);
    const minutes = Math.floor(seconds/60)%60;
    seconds = seconds%60;

    let formatedTime = '';

    if(hours > 0){
        if(hours>9)
            formatedTime += hours + ':';
        else
            formatedTime += '0' + hours + ':';
    }
    
    if(minutes>0){
        if(minutes>9)
            formatedTime += minutes + ':';
        else
            formatedTime += '0' + minutes +':';
    }

    if(seconds<10 && minutes > 0)
        formatedTime += '0'+seconds;
    else
        formatedTime += seconds;
    
    return formatedTime;
}