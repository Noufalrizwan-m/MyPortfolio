export const CONTACT_FIELDS=['name','email','company','topic','message'];
export const CONTACT_TOPICS=['Job opportunity','Freelance project','Collaboration','Just saying hello'];
export function normalizeContact(input={}){
 const data={};
 CONTACT_FIELDS.forEach(name=>data[name]=typeof input[name]==='string'?input[name].trim():'');
 data.name=data.name.replace(/\s+/g,' ');
 data.company=data.company.replace(/\s+/g,' ');
 return data;
}
export function contactError(name,data){
 const value=data[name];
 if(name==='name')return !value?'Please enter your name.':value.length<2?'Please use at least 2 characters.':value.length>100?'Please keep your name to 100 characters.':'';
 if(name==='email')return !value?'Please enter your email address.':value.length>254||!/^([^\s@<>]+)@([^\s@<>.]+)(?:\.[^\s@<>.]+)+$/.test(value)?'Please enter a valid email, such as you@example.com.':'';
 if(name==='company')return value.length>120?'Please keep the company name to 120 characters.':'';
 if(name==='topic')return CONTACT_TOPICS.includes(value)?'':'Please choose a topic.';
 if(name==='message')return !value?'Please write a short message.':value.length<20?'Please add a little more detail—at least 20 characters.':value.length>5000?'Please keep your message to 5,000 characters.':'';
 return '';
}
export function contactErrors(data){
 return Object.fromEntries(CONTACT_FIELDS.map(name=>[name,contactError(name,data)]).filter(([,error])=>error));
}
