/* Calendar calculations use civil dates rather than elapsed local hours. */
(function(root){
'use strict';
const DAY=86400000;
function valid(iso){if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(iso))return false;const d=new Date(iso+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===iso}
function ordinal(iso){return valid(iso)?Date.parse(iso+'T00:00:00Z')/DAY:NaN}
function add(iso,days){return new Date((ordinal(iso)+days)*DAY).toISOString().slice(0,10)}
function between(iso,a,b){return iso>=a&&iso<=b}
function bounded(value,min,max,fallback){const n=Number(value);return Number.isInteger(n)&&n>=min&&n<=max?n:fallback}
function stats(events,settings,today){
const starts=[...new Set(events.filter(e=>e.kind==='period_start'&&valid(e.event_date)&&e.event_date<=today).map(e=>e.event_date))].sort().reverse();
if(!starts.length)return null;
const intervals=starts.slice(0,6).flatMap((d,i)=>starts[i+1]?[ordinal(d)-ordinal(starts[i+1])]:[]);
const usable=intervals.filter(n=>n>=20&&n<=45),irregular=usable.length!==intervals.length||(usable.length>=2&&Math.max(...usable)-Math.min(...usable)>7);
const average=usable.length>=2?Math.round(usable.reduce((a,b)=>a+b,0)/usable.length):bounded(settings.cycleLength,20,45,28);
const last=starts[0],expected=add(last,average),elapsed=ordinal(today)-ordinal(last),overdue=today>expected;
return {last,starts,avg:average,cycleDay:elapsed+1,remaining:Math.max(0,ordinal(expected)-ordinal(today)),expected,overdue,irregular,periodDays:bounded(settings.periodLength,2,10,5),cycles:starts.length,reliability:usable.length>=2?'basado en tus registros':'según la duración que indicaste',allowFertile:settings.hormonal==='no'&&usable.length>=2&&!irregular&&!overdue};
}
function dayInfo(iso,events,state){
const items=events.filter(e=>e.event_date===iso),start=items.some(e=>e.kind==='period_start');
let typical=false;if(state)typical=state.starts.some(d=>between(iso,d,add(d,state.periodDays-1)));
const predicted=!!state&&!state.overdue&&between(iso,state.expected,add(state.expected,state.periodDays-1));
const fertile=!!state&&state.allowFertile&&between(iso,add(state.expected,-19),add(state.expected,-11));
return {start,bleeding:start||items.some(e=>e.kind==='symptom'&&e.detail.startsWith('Flujo:')),typical,predicted,fertile,items,intimacy:items.some(e=>e.kind==='intimacy'),symptom:items.some(e=>e.kind==='symptom')};
}
function cells(year,month){const first=new Date(Date.UTC(year,month,1)),pad=(first.getUTCDay()+6)%7;return Array.from({length:42},(_,i)=>new Date(Date.UTC(year,month,i-pad+1)).toISOString().slice(0,10))}
const api={valid,ordinal,add,stats,dayInfo,cells};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AleaCycle=api;
})(typeof window==='undefined'?globalThis:window);
