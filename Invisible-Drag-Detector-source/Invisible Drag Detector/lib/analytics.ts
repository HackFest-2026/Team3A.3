export const powerResidual=(expected:number,actual:number)=>Math.max(0,expected-actual);
export function ema(values:number[],alpha=.12){return values.reduce((e,v,i)=>i?alpha*v+(1-alpha)*e:v,0)}
export function dailyLoss(expected:number[],actual:number[],ppa=.082){return expected.reduce((s,e,i)=>s+powerResidual(e,actual[i]||0)*(10/60),0)*ppa}
export function stress(v:number,offset:number,k=.85){return Math.min(100,Math.max(1,k*v*v*Math.abs(Math.sin(offset*Math.PI/180))*2.2))}
export const urgency=(loss:number,stressScore:number)=>.6*loss+.4*stressScore;
