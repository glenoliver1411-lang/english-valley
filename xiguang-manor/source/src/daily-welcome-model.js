import {CONFIG} from './config.js';
import {DAILY_WELCOME} from './daily-welcome-config.js';

const modulo=(n,m)=>((n%m)+m)%m;
export function localDay(date=new Date()){
  const year=date.getFullYear(),month=date.getMonth()+1,day=date.getDate();
  return {year,month,day,key:[String(year).padStart(4,'0'),String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-')};
}
export function dailyWelcome(date=new Date(),{recipient=CONFIG.recipient,config=DAILY_WELCOME}={}){
  if(!Number.isFinite(date.getTime()))throw new RangeError('Invalid local date');
  const {year,month,day,key}=localDay(date),hour=date.getHours();
  const period=config.periods.find(p=>p.from<p.to?hour>=p.from&&hour<p.to:hour>=p.from||hour<p.to);
  const season=config.seasons.find(s=>s.months.includes(month));
  // Calendar-day ordinal, never elapsed local milliseconds: DST cannot skip or
  // repeat a line. Only the device's local fields determine the displayed date.
  const utc=new Date(0);utc.setUTCFullYear(year,month-1,day);utc.setUTCHours(0,0,0,0);
  const ordinal=Math.floor(utc.getTime()/86400000);
  const fill=text=>text.replaceAll('{name}',recipient).replaceAll('{year}',String(year)).replaceAll('{month}',String(month)).replaceAll('{day}',String(day));
  const occasion=config.occasions.find(o=>o.date===key||!o.date&&o.month===month&&o.day===day);
  return {key,year,month,day,weekday:config.weekdays[date.getDay()],date:fill(config.date),phase:period.id,phaseName:period.name,season:season.id,
    title:fill(config.title),greeting:fill(period.lines[modulo(ordinal,period.lines.length)]),
    note:fill(occasion?.line||season.lines[modulo(ordinal+Math.floor(ordinal/4),season.lines.length)])};
}

// Per-visit state; no game-save fields, login streaks, rewards or daily tasks.
export class DailyWelcomeGate{
  constructor(){this.started=false;this.shownDay=null;this.pending=false;this.wasAtManor=false}
  start(date,{resume=false,lastDay=null}={}){
    this.started=true;
    if(resume){this.shownDay=lastDay||localDay(date).key;this.pending=false}
    else this.pending=true;
  }
  foreground(date,atManor){if(this.started&&atManor&&this.shownDay!==localDay(date).key)this.pending=true}
  update(date,{atManor,canShow}){
    const key=localDay(date).key;
    if(this.started&&atManor&&!this.wasAtManor&&this.shownDay&&key!==this.shownDay)this.pending=true;
    this.wasAtManor=atManor;
    if(!this.started||!this.pending||!atManor||!canShow)return false;
    this.shownDay=key;this.pending=false;return true;
  }
}
