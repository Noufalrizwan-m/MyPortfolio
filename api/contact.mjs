import { normalizeContact, contactErrors } from '../dist/contact-rules.mjs';

const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export function GET(){return new Response('Method not allowed',{status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});}
export async function POST(request){
 const origin=request.headers.get('origin');
 if(!origin||origin!==new URL(request.url).origin)return json({error:'Please send your message from the portfolio website.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Please submit the contact form.'},415);
 try{
  const raw=await request.text();
  if(new TextEncoder().encode(raw).length>24000)return json({error:'Your message is too long.'},413);
  let input;
  try{input=JSON.parse(raw);}catch{return json({error:'The form could not be read. Please try again.'},400);}
  if(!input||typeof input!=='object'||Array.isArray(input))return json({error:'Please check your form details.'},400);
  if(input._honey)return json({ignored:true});
  const data=normalizeContact(input),errors=contactErrors(data);
  if(Object.keys(errors).length)return json({errors},422);
  // FormSubmit's supported AJAX integration runs in the visitor's browser.
  // Validate and normalize here before the client submits these exact fields.
  return json({valid:true,fields:data});
 }catch(error){
  console.error('Contact validation failed',{name:error?.name||'Error'});
  return json({error:'The form could not be checked. Please try again.'},502);
 }
}
