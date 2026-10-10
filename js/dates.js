export const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
export const parseDate=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return null;const [y,m,d]=s.split('-').map(Number);const x=new Date(y,m-1,d,12);return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d?x:null};
export const addDays=(s,n)=>{const d=parseDate(s);if(!d)return todayISO();d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
export const prettyDate=s=>{const d=parseDate(s);return d?new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(d):'Tanpa tanggal'};
export const getWeek=(date=todayISO())=>{const d=parseDate(date),offset=(d.getDay()+6)%7,start=addDays(date,-offset);return Array.from({length:7},(_,i)=>addDays(start,i))};
