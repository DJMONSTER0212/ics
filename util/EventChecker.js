const eventCheck = async(events, start,end)=>{
    // console.log(events)
    // console.log(events.length)
    console.log(start + " " + end);
    let nend = new Date(end);
    let nstart = new Date(start);
    if(events.length>0){
        for(let i=0;i<events.length;i++){
            let currStart = new Date(events[i].start)
            let currEnd = new Date(events[i].end)
            console.log(currStart + " " + currEnd)
            if((nstart>=currStart&&nstart<=currEnd) || (nend>=currStart && nend<=currEnd) ) return false;
        }
        return true;
    }else {
        return true
    }
}
module.exports = eventCheck;