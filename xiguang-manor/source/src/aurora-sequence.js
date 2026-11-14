// A finite performance. Once the aurora fades, the quiet night remains until
// the viewer explicitly replays; it never restarts or leaves the page by itself.
export const AURORA_SEQUENCE={quiet:2,appear:10,hold:44,disappear:23};
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*x*(x*(x*6-15)+10)};
export function auroraSequence(time,{still=false,skip=false}={}){
 if(still||skip)return {phase:still?'still':'view',reveal:1,ended:false};
 const c=AURORA_SEQUENCE,t=Number.isFinite(time)?Math.max(0,time):0,start=c.quiet,full=start+c.appear,fade=full+c.hold,end=fade+c.disappear;
 if(t<start)return {phase:'quiet',reveal:0,ended:false};
 if(t<full)return {phase:'appearing',reveal:smooth((t-start)/c.appear),ended:false};
 if(t<fade)return {phase:'open',reveal:1,ended:false};
 if(t<end)return {phase:'disappearing',reveal:1-smooth((t-fade)/c.disappear),ended:false};
 return {phase:'ended',reveal:0,ended:true};
}
