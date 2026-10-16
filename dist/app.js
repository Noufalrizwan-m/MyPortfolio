const projects={"grow": {"title": "Dr.Grow Labs", "category": "AQUACULTURE BIOLOGICALS · BRAND WEBSITE", "description": "A science-led website introducing aquaculture biologicals, pond care and health care formulations, research, and farmer education.", "contribution": "Built the website from scratch for Aquaconnect’s new brand launch, with product pages and enquiry forms.", "features": ["Research and development storytelling", "Formulation catalogue and product information", "Farmer community and contact journeys"], "tags": ["React.js", "Tailwind CSS", "Product catalogue"], "url": "https://drgrow.in", "domain": "drgrow.in", "image": "project-drgrow.jpg", "caption": "Science, pond care, and a new brand launch."}, "aqua": {"title": "Aquaconnect Global", "category": "SEAFOOD SOURCING · GLOBAL PLATFORM", "description": "A multilingual seafood sourcing website connecting international buyers with Indian processors, supported by product discovery, quality inspection information, and quote enquiries.", "contribution": "Maintained and improved Aquaconnect’s main website and global version. Built BluTik, the quality-check tool featured on the global site, generating tamper-proof inspection reports before export.", "features": ["Seafood product discovery and buyer enquiries", "English, Russian, Chinese and Vietnamese support", "BluTik quality-inspection platform introduction"], "tags": ["React.js", "Tailwind CSS", "Multilingual"], "url": "https://aquaconnect.blue/global/", "domain": "aquaconnect.blue/global", "image": "project-aquaconnect.jpg", "caption": "Seafood sourcing, across languages and borders."}, "logistics": {"title": "Panchathan Logistics", "category": "COURIER & CARGO · COMPANY WEBSITE", "description": "A logistics website bringing freight services, shipment tracking, quote enquiries, and nationwide branch information into one digital experience.", "contribution": "Built the complete company website from scratch, including the live shipment tracking tool, quote request form, and scroll-based storytelling on the homepage.", "features": ["Shipment tracking and service availability", "Air, ground, and ocean freight information", "Quote enquiries and branch discovery"], "tags": ["React.js", "Shipment tracking", "Scroll storytelling"], "url": "https://panchathanlogistics.com", "domain": "panchathanlogistics.com", "image": "project-logistics-20261015.jpg", "caption": "Reliable logistics. Clear tracking and enquiries."}, "fish": {"title": "Fish Choice", "category": "FISH NUTRITION · PRODUCT EXPERIENCE", "description": "A product website explaining floating fish feed for IMC and exotic carps through nutrition storytelling, ingredients, pellet sizes, and species-specific information.", "contribution": "Built the website with React.js and Tailwind CSS, using GSAP scroll animations to communicate the product story.", "features": ["Ingredient and nutrition storytelling", "Feed sizes and product variants", "Species information and customer enquiries"], "tags": ["React.js", "Tailwind CSS", "GSAP"], "url": "https://fishchoice.in", "domain": "fishchoice.in", "image": "project-fishchoice.jpg", "caption": "A nutrition story told through scroll and motion."}, "vjoin": {"title": "VJoin", "category": "SPORTS COMMUNITIES · FREELANCE PROJECT", "description": "A community sports platform where organisers manage groups and recurring sessions, and members discover groups and book events.", "contribution": "Built front-end features for a UK client’s badminton events platform, including event scheduling and member-facing screens.", "features": ["Group discovery and member journeys", "Recurring sessions and event booking", "Community event organisation"], "tags": ["Frontend features", "Event scheduling", "UK freelance client"], "url": "https://vjoin.app", "domain": "vjoin.app", "image": "project-vjoin.jpg", "caption": "Helping sports communities get together."}};
const dialog=document.querySelector('#project-dialog');document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const p=projects[button.dataset.project];document.querySelector('#dialog-category').textContent=p.category;document.querySelector('#dialog-title').textContent=p.title;document.querySelector('#dialog-description').textContent=p.description;document.querySelector('#dialog-features').replaceChildren(...p.features.map(feature=>{const li=document.createElement('li');li.textContent=feature;return li}));dialog.dataset.theme=button.dataset.project;document.querySelector('#dialog-contribution').textContent=p.contribution;document.querySelector('#dialog-link').href=p.url;document.querySelector('#dialog-tags').replaceChildren(...p.tags.map(tag=>{let s=document.createElement('span');s.textContent=tag;return s}));dialog.showModal()}));document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

// All sections are readable until their animation assets and libraries are ready.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = preference.matches;
let animationContext;
let hoverCleanups = [];
let introTrigger, journeyTrigger, workTrigger;
let assetsReady = false;
let mobileStoryStage;
const story = document.querySelector('.story');
const about = document.querySelector('#about');
const greeting = document.querySelector('.story-greeting');
const milestones = [...document.querySelectorAll('.milestone')];
const projectPanels = [...document.querySelectorAll('.project')];
const milestoneLabels = [...document.querySelectorAll('[data-year-index]')];
const beat = document.querySelector('#story-beat');
const beatNames = ['01 / HELLO THERE', '02 / A LITTLE ABOUT ME', '03 / LET IT FLY', '04 / A CLOSER LOOK', '05 / THE PERSON BEHIND THE PIXELS'];

// Keep a single accessible sentence while animating its visual word spans.
const statement = document.querySelector('.about-statement');
statement.setAttribute('aria-label', statement.textContent);
statement.replaceChildren(...statement.textContent.split(' ').map(word => {
  const span = document.createElement('span');
  span.textContent = word + ' ';
  span.setAttribute('aria-hidden', 'true');
  return span;
}));

function restoreDocument() {
  if (animationContext) animationContext.revert();
  animationContext = null;
  if(mobileStoryStage){
    const avatar=mobileStoryStage.querySelector('.story-avatar');
    mobileStoryStage.before(avatar);
    greeting.after(mobileStoryStage.querySelector('.flying-paper'),about);
    mobileStoryStage.remove();mobileStoryStage=null;
  }
  story.classList.remove('mobile-story');
  document.querySelectorAll('[data-count]').forEach(el=>el.textContent=el.dataset.count);
  hoverCleanups.forEach(cleanup => cleanup());
  hoverCleanups = [];
  introTrigger = journeyTrigger = workTrigger = null;
  story.classList.remove('story-active');
  document.querySelector('#journey').classList.remove('journey-pinned');
  document.querySelector('#work').classList.remove('work-pinned');
  document.querySelector('.work-chapter').removeAttribute('data-theme');
  [about, greeting, ...milestones, ...projectPanels].forEach(el => el.inert = false);
  milestoneLabels.forEach(el => el.removeAttribute('aria-current'));
  beat.textContent = beatNames[0];
}

// Compact disclosures preserve every detail without long mobile card stacks.
let compactDisclosureMode;
const mobileDisclosures=[];
function syncMobileDisclosures(){
  const compact=innerWidth<900;
  if(!mobileDisclosures.length){
    const groups=[['service',[...document.querySelectorAll('.service-card')]],['experience',milestones]];
    groups.forEach(([group,cards])=>cards.forEach((card,index)=>{
      const heading=card.querySelector('h3');
      const panel=document.createElement('div');panel.className='compact-card-body';panel.id=`${group}-details-${index}`;
      const nodes=group==='service'?[card.querySelector('p'),card.querySelector('ul')]:[card.querySelector('.experience-highlights'),card.querySelector('.experience-meta')];
      nodes.filter(Boolean).forEach(node=>panel.append(node));
      (group==='service'?card:card.querySelector('.experience-content')).append(panel);
      const button=document.createElement('button');button.type='button';button.className='compact-card-toggle';button.textContent=heading.textContent;button.setAttribute('aria-label',heading.textContent);button.setAttribute('aria-controls',panel.id);heading.replaceChildren(button);
      const item={group,index,button,panel,card};mobileDisclosures.push(item);
      button.addEventListener('click',()=>{
        if(innerWidth>=900)return;
        const open=button.getAttribute('aria-expanded')!=='true';
        mobileDisclosures.filter(other=>other.group===group).forEach(other=>setDisclosure(other,other===item&&open));
        if(open&&!motionOff&&window.gsap)gsap.fromTo(panel,{opacity:0,y:8},{opacity:1,y:0,duration:.3,clearProps:'opacity,transform'});
        window.ScrollTrigger?.refresh();
      });
    }));
  }
  if(compactDisclosureMode===compact)return;
  compactDisclosureMode=compact;
  mobileDisclosures.forEach(item=>{
    item.button.disabled=!compact;
    setDisclosure(item,!compact||(item.group==='service'?item.index===0:item.index===0));
  });
}
function setDisclosure(item,open){
  item.button.setAttribute('aria-expanded',String(open));
  item.panel.hidden=!open;
  item.card.classList.toggle('compact-card-open',open);
}

function setupMotion() {
  restoreDocument();
  syncMobileDisclosures();
  document.documentElement.classList.toggle('motion-off', motionOff);
  if (motionOff || !assetsReady || !window.gsap || !window.ScrollTrigger || innerHeight < 620) return;
  const mobile = innerWidth <= 700;
  const horizontal = innerWidth >= 900 && innerHeight >= 640;
  const pinJourney = innerWidth >= 900 && innerHeight >= 720;
  const w = innerWidth, h = innerHeight;
  gsap.registerPlugin(ScrollTrigger);
  // A short mobile handoff keeps the résumé story without the desktop scroll length.
  if(innerWidth<900){
    story.classList.add('mobile-story');
    mobileStoryStage=document.createElement('div');
    mobileStoryStage.className='mobile-story-stage';
    const avatar=document.querySelector('.story-avatar');
    avatar.before(mobileStoryStage);
    mobileStoryStage.append(avatar,document.querySelector('.flying-paper'),about);
    mobileStoryStage.style.width=Math.floor(mobileStoryStage.getBoundingClientRect().width)+'px';
    mobileStoryStage.style.height=Math.max(360,about.querySelector('.about-label').offsetHeight+about.querySelector('.about-copy').offsetHeight+64)+'px';
    animationContext=gsap.context(()=>{
      gsap.from('.story-copy',{y:16,autoAlpha:0,duration:.55,ease:'power2.out'});
      gsap.from('.story-avatar',{y:20,autoAlpha:0,duration:.65,delay:.1,ease:'power2.out'});
      gsap.to('.wave-arm',{rotation:7,duration:.3,repeat:3,yoyo:true,ease:'sine.inOut'});
      gsap.set('.flying-paper',{autoAlpha:0,xPercent:-50,yPercent:-50,x:-28,y:15,scale:.65,rotation:-12});
      gsap.set('.avatar-hold,.paper-about',{autoAlpha:0});
      gsap.set('.paper-about .about-copy',{y:20});
      gsap.set('.about-statement span',{color:'#c7c7c2'});
      about.inert=true;
      const handoff=gsap.timeline({defaults:{ease:'sine.inOut'},scrollTrigger:{
        id:'mobile-resume-story',trigger:mobileStoryStage,start:'center center+=34',
        end:()=>'+='+Math.round(innerHeight*1.5),pin:true,pinSpacing:true,scrub:true,anticipatePin:1,
        onUpdate:self=>{about.inert=self.progress<.65;},
        onToggle:self=>mobileStoryStage?.classList.toggle('is-scene-pinned',self.isActive)
      }});
      handoff.to(mobileStoryStage,{'--scene-backdrop':1,duration:.15},0)
        .to('.avatar-note,.hero-floats',{autoAlpha:0,duration:.15},0)
        .to('.story-avatar',{x:0,y:(mobileStoryStage.offsetHeight-300)/2-24,duration:.18},0)
        .to('.pose-a,.wave-arm',{autoAlpha:0,duration:.15},.16)
        .to('.avatar-hold',{autoAlpha:1,duration:.15},.16)
        .to('.flying-paper',{autoAlpha:1,duration:.1},.3)
        .to('.flying-paper',{x:0,y:0,scale:1.25,rotation:0,duration:.3},.4)
        .to('.story-avatar',{autoAlpha:0,duration:.2},.4)
        .to('.flying-paper',{scale:Math.max(innerWidth/90,(innerHeight-68)/(90*841.8898/595.30398))*1.2,duration:.4},.85)
        .to('.paper-ink,.paper-fold',{autoAlpha:0,duration:.18},1.05)
        .to('.flying-paper',{autoAlpha:0,duration:.15},1.2)
        .to('.paper-about',{autoAlpha:1,duration:.2},1.2)
        .to('.paper-about .about-copy',{y:0,duration:.25},1.2);
      handoff.to('.about-statement span',{color:'#20231e',duration:.08,stagger:{amount:.55},ease:'none'},1.4)
        .to(mobileStoryStage,{'--scene-backdrop':0,duration:.2,ease:'none'},2.03)
        .to({}, {duration:.08});
      const reveals='.profile-section .reveal,.services .reveal,.toolkit .reveal,.milestone.reveal,.contact .reveal';
      gsap.utils.toArray(reveals).forEach((element,index)=>gsap.from(element,{
        y:18,autoAlpha:0,duration:.45,ease:'power2.out',
        scrollTrigger:{trigger:element,start:'top 97%',once:true}
      }));
      gsap.to('.progress',{width:'100%',ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
    });
    ScrollTrigger.refresh();
    return;
  }
  story.classList.add('story-active');
  if(pinJourney) document.querySelector('#journey').classList.add('journey-pinned');
  if (horizontal) document.querySelector('#work').classList.add('work-pinned');
  animationContext = gsap.context(() => {
    gsap.set('.avatar-hold, .flying-paper, .paper-about', {autoAlpha: 0});
    gsap.set('.pose-a,.wave-arm', {autoAlpha: 1});
    gsap.set('.wave-arm', {rotation:0});
    // The head and torso stay still while only the hand/forearm waves.
    const wave = gsap.timeline();
    wave.to('.wave-arm',{rotation:9,duration:.35,ease:'sine.inOut'})
      .to('.wave-arm',{rotation:-7,duration:.5,ease:'sine.inOut'})
      .to('.wave-arm',{rotation:8,duration:.5,ease:'sine.inOut'})
      .to('.wave-arm',{rotation:0,duration:.4,ease:'sine.inOut'});
    gsap.set('.flying-paper', {xPercent:-50, yPercent:-50, transformPerspective:900});
    gsap.set('.paper-about .about-copy', {y:24});
    gsap.set('.journey-line', {scaleX:0});
    const avatar = document.querySelector('.story-avatar');
    const avatarRect = avatar.getBoundingClientRect();
    const sceneRect = story.getBoundingClientRect();
    const shiftX = mobile ? w * .19 : w * .09;
    // The invisible-paper grip is around (33%, 52%) of the matching avatar asset.
    const initialScale = mobile ? .48 : .65;
    const paper = document.querySelector('.flying-paper');
    const paperWidth = paper.offsetWidth, paperHeight = paper.offsetHeight;
    const originX = avatarRect.left - sceneRect.left + shiftX + avatarRect.width * .33 - w / 2 - paperWidth / 2 * initialScale;
    const originY = avatarRect.top - sceneRect.top + avatarRect.height * .52 - h / 2 + paperHeight / 2 * initialScale;
    const coverScale = Math.max(w / paperWidth, h / paperHeight) * 1.18;
    const intro = gsap.timeline({defaults:{ease:'none'}, scrollTrigger:{
      id:'intro-story', refreshPriority:3, trigger:story, start:'top top', end:()=>'+=' + innerHeight * (mobile ? 2.3 : 3),
      pin:true, scrub:.25, anticipatePin:1,
      onUpdate(self) {
        const p = self.progress * 1.35;
        const index = p < .12 ? 0 : p < .35 ? 1 : p < .65 ? 2 : p < .85 ? 3 : 4;
        beat.textContent = beatNames[index];
        about.inert = p < .9;
        greeting.inert = p > .75;
      }
    }});
    introTrigger = intro.scrollTrigger;
    intro.to({}, {duration:135}, 0);
    gsap.set('.about-statement span', {color:'#c7c7c2'});
    intro.to('.about-statement span', {color:'#20231e', duration:2, stagger:1}, 95);
    intro.to('.story-avatar', {x:shiftX,rotation:mobile?1:2,scale:.96,duration:23,ease:'sine.inOut'},12)
      .to('.story-copy', {x:mobile?-10:-30,autoAlpha:0,duration:21},12)
      .to('.hero-floats,.avatar-note', {autoAlpha:0,duration:12},18)
      .to('.pose-a,.wave-arm',{autoAlpha:0,duration:8},22)
      .to('.avatar-hold',{autoAlpha:1,duration:8},22)
      .fromTo('.flying-paper', {x:originX,y:originY,rotation:-12,rotationY:-14,scale:initialScale},
        {autoAlpha:1,duration:5},30);
    // Two joined cubic curves form one uninterrupted, gently looping flight.
    const flight = {t:0};
    const endX=w*.04,endY=-h*.06;
    const cubic=(a,b,c,d,t)=>{
      const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d;
    };
    const renderFlight=()=>{
      const t=flight.t;
      let x,y;
      if(t<=.5){
        const q=t*2;
        x=cubic(originX,originX-w*.15,-w*.26,-w*.22,q);
        y=cubic(originY,originY-h*.35,-h*.26,h*.08,q);
      }else{
        const q=(t-.5)*2;
        x=cubic(-w*.22,-w*.18,w*.26,endX,q);
        y=cubic(h*.08,h*.42,h*.34,endY,q);
      }
      gsap.set('.flying-paper',{
        x,y,rotation:-12*(1-t)+Math.sin(t*Math.PI*2)*12,
        rotationY:Math.sin(t*Math.PI*2)*18-14*(1-t),
        rotationX:Math.sin(t*Math.PI*4)*4,
        scale:initialScale+(1.45-initialScale)*t
      });
    };
    intro.to(flight,{t:1,duration:30,ease:'sine.inOut',onUpdate:renderFlight},35)
      .fromTo('.flying-paper',{x:endX,y:endY,rotation:0,rotationY:0,rotationX:0,scale:1.45},
        {x:0,y:0,scale:coverScale,borderColor:'#fbf9f2',boxShadow:'0px 0px 0px transparent',duration:20,ease:'power2.inOut',immediateRender:false},65)
      .to('.paper-ink,.paper-fold',{autoAlpha:0,duration:10},70)
      .to('.story-greeting',{autoAlpha:0,duration:9},73)
      .to('.paper-about',{autoAlpha:1,duration:8},86)
      .to('.paper-about .about-copy',{y:0,duration:8},86);
    about.inert = true;

    if(pinJourney){
    gsap.set(milestones,{autoAlpha:0,y:25});
    gsap.set(milestones[0],{autoAlpha:1,y:0});
    const journey = gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
      id:'journey-chapter',refreshPriority:1,trigger:'#journey',start:'top top',end:()=>'+='+innerHeight*2,
      pin:true,scrub:.25,anticipatePin:1,onUpdate(self){
        const index=Math.min(milestones.length-1,Math.floor(self.progress*milestones.length));
        milestones.forEach((el,i)=>el.inert=i!==index);
        milestoneLabels.forEach((el,i)=>i===index?el.setAttribute('aria-current','step'):el.removeAttribute('aria-current'));
      }
    }});
    journeyTrigger=journey.scrollTrigger;
    journey.to({}, {duration:100},0).to('.journey-line',{scaleX:1,duration:100},0);
    milestones.forEach((el,i)=>{
      if(i)journey.to(el,{autoAlpha:1,y:0,duration:5},i*(100/milestones.length)-3);
      if(i<milestones.length-1)journey.to(el,{autoAlpha:0,y:-18,duration:4},(i+1)*(100/milestones.length)-5);
      el.inert=i!==0;
    });
    milestoneLabels[0].setAttribute('aria-current','step');

    }
    if(horizontal){
      const grid = document.querySelector('.project-grid');
      const stage = document.querySelector('.work-stage');
      const distance = () => Math.max(0, grid.scrollWidth - stage.clientWidth);
      const work = gsap.to(grid, {x:() => -distance(), ease:'none', scrollTrigger:{
        id:'work-chapter',refreshPriority:2,trigger:'.work-chapter',start:'top top',end:()=>'+='+Math.max(1, distance()),
        pin:true,scrub:.4,anticipatePin:1,invalidateOnRefresh:true,
        onUpdate(self){
          document.querySelector('#work-current').textContent=String(Math.round(self.progress*(projectPanels.length-1))+1).padStart(2,'0');
        }
      }});
      workTrigger=work.scrollTrigger;
      gsap.fromTo('.work-track i',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.work-chapter',start:'top top',end:()=>'+='+Math.max(1,distance()),scrub:true}});
      // Keyboard focus brings each card into the pinned viewport.
      projectPanels.forEach((panel,index)=>{
        const focus=()=>{const r=panel.getBoundingClientRect();if(r.left<0||r.right>innerWidth)window.scrollTo({top:workTrigger.start+(workTrigger.end-workTrigger.start)*Math.min(1,Math.max(0,panel.offsetLeft-innerWidth*.06)/Math.max(1,distance())),behavior:'instant'});};
        panel.addEventListener('focusin',focus);
        hoverCleanups.push(()=>panel.removeEventListener('focusin',focus));
      });
    }
    // Ordinary sections keep their native document flow.
    const ordinary=(horizontal?'':'.project.reveal,')+(pinJourney?'':'.milestone.reveal,')+'.profile-section .reveal,.services .reveal,.toolkit .reveal,.other-work,.contact .reveal';
    gsap.utils.toArray(ordinary).forEach(el=>gsap.from(el,{y:40,autoAlpha:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
    document.querySelectorAll('[data-count]').forEach(el=>{
      const final=el.dataset.count, target=parseInt(final.replace(/,/g,''),10), value={n:0};
      gsap.to(value,{n:target,duration:1.6,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},
        onUpdate:()=>{el.textContent=Math.round(value.n).toLocaleString('en-US')+(final.endsWith('+')?'+':'');},onComplete:()=>el.textContent=final});
    });
    gsap.to('.progress',{width:'100%',ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
  });
  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('[data-tilt],.avatar-poses').forEach(el=>{
      const max=Number(el.dataset.tilt)||4;
      let x=.5,y=.5,tx=.5,ty=.5,vx=0,vy=0,frame=0,last=0;
      function render(now){
        const dt=Math.min((now-last)/1000||1/60,1/30);last=now;
        vx+=(180*(tx-x)-18*vx)/.6*dt;vy+=(180*(ty-y)-18*vy)/.6*dt;
        x+=vx*dt;y+=vy*dt;
        el.style.transform=`perspective(1000px) rotateX(${(1-2*y)*max}deg) rotateY(${(2*x-1)*max}deg)`;
        el.style.setProperty('--glare-x',`${x*100}%`);el.style.setProperty('--glare-y',`${y*100}%`);
        if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)>.001)frame=requestAnimationFrame(render);
        else frame=0;
      }
      function start(){if(!frame){last=performance.now();frame=requestAnimationFrame(render);}}
      const move=event=>{
        if(event.pointerType!=='mouse')return;
        const rect=el.getBoundingClientRect();
        tx=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
        ty=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));start();
      };
      const leave=()=>{tx=ty=.5;start();};
      el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
      hoverCleanups.push(()=>{cancelAnimationFrame(frame);el.style.removeProperty('transform');el.style.removeProperty('--glare-x');el.style.removeProperty('--glare-y');el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);});
    });
  }
  if(window.Motion){
    document.querySelectorAll('.button,.contact-circle').forEach(el=>{
      hoverCleanups.push(Motion.hover(el,()=>{
        Motion.animate(el,{scale:1.035},{duration:.2});
        return()=>Motion.animate(el,{scale:1},{duration:.2});
      }));
    });
  }
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

function chapterDestination(id){
  if(id==='about'&&mobileStoryStage)return ScrollTrigger.getById('mobile-resume-story')?.end??null;
  if(id==='about'&&introTrigger)return introTrigger.end;
  if(id==='home'&&introTrigger)return introTrigger.start;
  if(id==='journey'&&journeyTrigger)return journeyTrigger.start;
  if(id==='work'&&workTrigger)return workTrigger.start;
  const target=document.getElementById(id);
  return target?target.getBoundingClientRect().top+scrollY-76:null;
}
function goToChapter(id,behavior='instant'){
  const top=chapterDestination(id);
  if(top===null)return;
  window.scrollTo({top:Math.max(0,top),behavior});
}
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const id=link.getAttribute('href').slice(1);
  if(!document.getElementById(id))return;
  event.preventDefault();
  history.pushState({...history.state,portfolioChapter:id},'',location.pathname+location.search);
  goToChapter(id,'instant');
}));
window.addEventListener('popstate',event=>goToChapter(event.state?.portfolioChapter||'home'));
function currentChapter(){
  const y=scrollY;
  if(document.querySelector('#contact').getBoundingClientRect().top<innerHeight*.45)return 'contact';
  if(introTrigger&&y<=introTrigger.end+10)return y>introTrigger.end*.9?'about':'home';
  if(journeyTrigger&&y>=journeyTrigger.start&&y<=journeyTrigger.end+innerHeight)return 'journey';
  if(workTrigger&&y>=workTrigger.start&&y<=workTrigger.end+innerHeight)return 'work';
  return ['contact','journey','skills','work','about','home'].find(id=>document.getElementById(id).getBoundingClientRect().top<innerHeight*.45)||'home';
}
let scrollTick=false;
window.addEventListener('scroll',()=>{
  if(scrollTick)return;
  scrollTick=true;
  requestAnimationFrame(()=>{
    const id=currentChapter();
    document.querySelectorAll('nav a').forEach(link=>link.hash==='#'+id?link.setAttribute('aria-current','location'):link.removeAttribute('aria-current'));
    scrollTick=false;
  });
},{passive:true});
preference.addEventListener('change',event=>{
  const id=currentChapter();motionOff=event.matches;setupMotion();goToChapter(id);
});
let resizeTimer,previousWidth=innerWidth,previousHeight=innerHeight;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
    if(innerWidth===previousWidth&&Math.abs(innerHeight-previousHeight)<85)return;
    const id=currentChapter();
    const trigger=id==='home'||id==='about'?introTrigger:id==='journey'?journeyTrigger:id==='work'?workTrigger:null;
    const progress=trigger?.progress;
    previousWidth=innerWidth;previousHeight=innerHeight;setupMotion();
    const next=id==='home'||id==='about'?introTrigger:id==='journey'?journeyTrigger:id==='work'?workTrigger:null;
    if(next&&progress!==undefined)window.scrollTo({top:next.start+(next.end-next.start)*progress,behavior:'instant'});
    else goToChapter(id);
  },180);
});
const poseImages=[...document.querySelectorAll('.avatar-poses img')];
Promise.all(poseImages.map(image=>image.decode())).then(()=>{
  assetsReady=true;setupMotion();goToChapter(history.state?.portfolioChapter||'home');
}).catch(()=>{
  // Keep the whole Resumein document flow if any character pose is unavailable.
  poseImages.forEach(image=>{if(!image.complete||!image.naturalWidth)image.style.display='none'});
  restoreDocument();
});
setupMotion();

// Jump to a complete experience card, with the same chronology as scrolling.
milestoneLabels.forEach((button,index)=>button.addEventListener('click',()=>{
  if(journeyTrigger){
    const progress=Math.min(.96,index/milestones.length+.09);
    window.scrollTo({top:journeyTrigger.start+(journeyTrigger.end-journeyTrigger.start)*progress,behavior:'instant'});
  }else milestones[index].scrollIntoView({behavior:'smooth',block:'center'});
}));

// Native mobile swiping keeps the full project list within one short section.
const mobileProjectTrack=document.querySelector('.project-grid');
const projectPageButtons=[...document.querySelectorAll('[data-project-page]')];
projectPanels.forEach((panel,index)=>panel.id=`project-card-${index}`);
const mobileProjectCount=document.querySelector('.mobile-project-count');
let mobileProjectIndex=0,projectScrollFrame,projectNavigationTimer;
let projectNavigationTarget=null;
function updateMobileProjects(){
  if(innerWidth>=900)return;
  const trackLeft=mobileProjectTrack.getBoundingClientRect().left;
  const distances=projectPanels.map(panel=>Math.abs(panel.getBoundingClientRect().left-trackLeft));
  mobileProjectIndex=projectNavigationTarget??distances.indexOf(Math.min(...distances));
  mobileProjectCount.textContent=`${String(mobileProjectIndex+1).padStart(2,'0')} / ${String(projectPanels.length).padStart(2,'0')}`;
  projectPageButtons.forEach((button,index)=>index===mobileProjectIndex?button.setAttribute('aria-current','true'):button.removeAttribute('aria-current'));
}
mobileProjectTrack.addEventListener('scroll',()=>{
  cancelAnimationFrame(projectScrollFrame);projectScrollFrame=requestAnimationFrame(updateMobileProjects);
},{passive:true});
function navigateMobileProject(index,automatic=false){
  mobileProjectCount.setAttribute('aria-live',automatic?'off':'polite');
  const trackRect=mobileProjectTrack.getBoundingClientRect(),cardRect=projectPanels[index].getBoundingClientRect();
  projectNavigationTarget=index;
  updateMobileProjects();
  clearTimeout(projectNavigationTimer);
  projectNavigationTimer=setTimeout(()=>{projectNavigationTarget=null;updateMobileProjects()},600);
  mobileProjectTrack.scrollTo({left:mobileProjectTrack.scrollLeft+cardRect.left-trackRect.left,behavior:motionOff?'instant':'smooth'});
}
const mobileWork=document.querySelector('#work');
let projectAutoplayTimer,projectVisible=false,projectPointerDown=false,projectHovered=false;
function scheduleProjectAutoplay(delay=4500){
  clearTimeout(projectAutoplayTimer);
  if(innerWidth>=900||motionOff||document.hidden||!projectVisible||projectPointerDown||projectHovered||mobileWork.contains(document.activeElement)||dialog.open)return;
  projectAutoplayTimer=setTimeout(()=>{
    navigateMobileProject((mobileProjectIndex+1)%projectPanels.length,true);
    scheduleProjectAutoplay();
  },delay);
}
new IntersectionObserver(entries=>{
  projectVisible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.6;
  scheduleProjectAutoplay();
},{threshold:[0,.6]}).observe(mobileProjectTrack);
projectPageButtons.forEach(button=>button.addEventListener('click',()=>{
  navigateMobileProject(Number(button.dataset.projectPage));
  scheduleProjectAutoplay(8000);
}));
mobileWork.addEventListener('pointerdown',()=>{
  projectPointerDown=true;projectNavigationTarget=null;
  clearTimeout(projectNavigationTimer);clearTimeout(projectAutoplayTimer);
},{passive:true});
const releaseProjectPointer=()=>{projectPointerDown=false;scheduleProjectAutoplay(8000)};
window.addEventListener('pointerup',releaseProjectPointer,{passive:true});
window.addEventListener('pointercancel',releaseProjectPointer,{passive:true});
mobileWork.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){projectHovered=true;scheduleProjectAutoplay()}});
mobileWork.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){projectHovered=false;scheduleProjectAutoplay(8000)}});
mobileWork.addEventListener('focusin',()=>scheduleProjectAutoplay());
mobileWork.addEventListener('focusout',()=>setTimeout(()=>scheduleProjectAutoplay(8000),0));
mobileProjectTrack.addEventListener('scroll',()=>{if(projectNavigationTarget===null)scheduleProjectAutoplay(8000)},{passive:true});
document.addEventListener('visibilitychange',()=>scheduleProjectAutoplay());
dialog.addEventListener('close',()=>scheduleProjectAutoplay(8000));
preference.addEventListener('change',()=>scheduleProjectAutoplay());
window.addEventListener('resize',()=>{updateMobileProjects();scheduleProjectAutoplay()});
