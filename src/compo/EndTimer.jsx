import { useState, useEffect } from "react";

export default function EndTimer({ endDate, endTime }){

    const [ regisCloseIn, setRegisCloseIn ] = useState({
        days:0, hours:0, minutes:0, seconds:0
    });

      /* registeration close in timer */
    
     useEffect(() => {
    
        if (!endDate || !endTime){
            console.log("no data found");
            return;
        };
          
        const interval = setInterval(() => {
            const now = Date.now();
    
            const endTime_ = new Date(
                `${endDate}T${endTime}`
            );
    
            const diff = endTime_.getTime() - now;
    
            if(diff<=0){
                setRegisCloseIn({
                    days:0, hours:0, minutes:0, seconds:0
             })
                
            }
            const days = Math.floor(diff/86400000);
            const miliseconds_afterdays = diff%86400000;
            const hours = Math.floor(miliseconds_afterdays/(60*60*1000));
            const milisecond_afterhours = miliseconds_afterdays%(60*60*1000);
            const minutes = Math.floor(milisecond_afterhours/(60*1000));
            const miliseconds_afterminutes =milisecond_afterhours%(60*1000);
            const seconds = Math.floor(miliseconds_afterminutes/1000);
            
            // console.log(days, hours, minutes, seconds);
    
            setRegisCloseIn({days, hours, minutes, seconds});
    
        }, 1000);
    
        return () => clearInterval(interval);
    }, [endDate, endTime]);
    
    

    return(
        <div className='timer'>
          <p>Registeration Ends In </p>
            <div className='box'>
                <div className='time'><span>{regisCloseIn.days}</span><br />Days</div>
                <div className='time'><span>{regisCloseIn.hours}</span><br />Hours</div>
                <div className='time'><span>{regisCloseIn.minutes}</span><br />Mins</div>
                <div className='time'><span>{regisCloseIn.seconds}</span><br />Secs</div>
            </div>
        </div>
    )
}