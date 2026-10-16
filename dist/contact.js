import { CONTACT_FIELDS, normalizeContact, contactError } from './contact-rules.mjs';
// Native constraints remain available when JavaScript is disabled.
(()=>{
 const form=document.querySelector('#contact-form');
 if(!form)return;
 form.noValidate=true;
 const status=document.querySelector('#contact-status');
 const summary=document.querySelector('#form-errors');
 const button=form.querySelector('[type="submit"]');
 const names=CONTACT_FIELDS;
 let sending=false;
 const values=()=>{
  const input=Object.fromEntries(new FormData(form));
  return {...normalizeContact(input),_honey:input._honey||''};
 };
 function validate(name,data){
  const error=contactError(name,data),element=document.querySelector(`#${name}-error`);
  element.textContent=error;element.hidden=!error;
  form.querySelectorAll(`[name="${name}"]`).forEach(field=>error?field.setAttribute('aria-invalid','true'):field.removeAttribute('aria-invalid'));
  return !error;
 }
 function counter(){document.querySelector('#message-count').textContent=`${form.elements.message.value.length.toLocaleString('en-US')} / 5,000`;}
 names.forEach(name=>form.querySelectorAll(`[name="${name}"]`).forEach(field=>{
  field.addEventListener('blur',()=>validate(name,values()));
  field.addEventListener('input',()=>{
   if(field.hasAttribute('aria-invalid'))validate(name,values());
   summary.hidden=true;
   if(status.dataset.state==='success'){status.textContent='';delete status.dataset.state;}
   if(name==='message')counter();
  });
  field.addEventListener('change',()=>{if(name==='topic')validate(name,values());});
 }));
 function showStatus(message,state){status.textContent=message;status.dataset.state=state;}
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;
  const data=values();if(data._honey)return;
  const invalid=names.filter(name=>!validate(name,data));
  status.textContent='';delete status.dataset.state;
  if(invalid.length){
   summary.textContent=`Please check ${invalid.length===1?'the highlighted field':`the ${invalid.length} highlighted fields`} below.`;summary.hidden=false;
   form.querySelector(`[name="${invalid[0]}"]`).focus();return;
  }
  summary.hidden=true;sending=true;form.setAttribute('aria-busy','true');button.disabled=true;button.textContent='Sending…';
  showStatus('Sending your message…','sending');
  data._subject=`Portfolio enquiry: ${data.topic} - ${data.name.replace(/[\r\n]+/g,' ')}`;
  try{
   const validation=await fetch('/api/contact',{
    method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(10000)
   });
   const checked=await validation.json();
   if(checked.ignored)return;
   if(!validation.ok||!checked.valid)throw new Error('The form could not be validated');
   const fields={...checked.fields,_subject:`Portfolio enquiry: ${checked.fields.topic} - ${checked.fields.name}`,_template:'table'};
   const response=await fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{
    method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(fields),signal:AbortSignal.timeout(20000)
   });
   const result=await response.json();
   if(!response.ok||!(result.success===true||result.success==='true')){
    if(typeof result.message==='string'&&/needs activation/i.test(result.message)){
     showStatus('This form is awaiting email activation. Please email noufalrizwanuae@gmail.com directly for now.','error');return;
    }
    throw new Error('Submission was not accepted');
   }
   form.reset();counter();showStatus('Thank you! Your message has been submitted. I’ll get back to you soon.','success');
  }catch(error){showStatus('Your message could not be sent. Your details are still here-please try again, or email noufalrizwanuae@gmail.com.','error');}
  finally{sending=false;form.removeAttribute('aria-busy');button.disabled=false;button.innerHTML='Send message <span aria-hidden="true">↗</span>';}
 });
})();
