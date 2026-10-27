// The desk loader replays on each fresh visit and refresh.
window.portfolioIntroReady = new Promise(resolve => {
  const root = document.documentElement;
  const intro = document.getElementById('welcome-intro');
  clearTimeout(window.portfolioWelcomeWatchdog);
  if (!intro || !window.portfolioWelcomeRequested) { resolve(); return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const preview = location.hostname === 'localhost' && new URLSearchParams(location.search).get('intro-preview') === 'office';
  const office = intro.querySelector('.welcome-office');
  const scene = intro.querySelector('.welcome-office-motion');
  const number = intro.querySelector('.welcome-number');
  const bar = intro.querySelector('.welcome-progress');
  const progress = {value:1};
  let finishing = false, timer, counter, protectedContent = [];
  const update = () => {
    const value = Math.round(progress.value);
    number.textContent = value;
    bar.style.setProperty('--loaded', `${value}%`);
    bar.setAttribute('aria-valuenow', value);
  };
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); intro.focus({preventScroll:true}); }
  }
  function onPreference(event) { if(event.matches) finish(); }
  function onPointer(event) {
    if(event.pointerType !== 'mouse' || reduced.matches || finishing || !window.gsap) return;
    gsap.to(scene, {rotationY:(event.clientX/innerWidth-.5)*9, rotationX:(.5-event.clientY/innerHeight)*4, duration:.55, overwrite:'auto'});
  }
  function onWheel(event) {
    if(reduced.matches || finishing || !window.gsap) return;
    gsap.to(scene, {rotationY:Math.sign(event.deltaY)*5, duration:.22, overwrite:'auto', onComplete:()=>gsap.to(scene,{rotationY:0,duration:.55})});
  }
  function finish() {
    if(finishing) return;
    finishing = true;
    clearTimeout(timer); counter?.kill();
    root.classList.remove('welcome-pending');
    resolve(); // Let app.js prepare the hero while this screen still covers it.
    Promise.race([window.portfolioHeroReady, new Promise(done=>setTimeout(done,3000))]).then(()=>{
      const complete = () => {
        intro.hidden = true;
        intro.removeEventListener('pointermove',onPointer);
        intro.removeEventListener('wheel',onWheel);
        document.removeEventListener('keydown',onKey);
        reduced.removeEventListener('change',onPreference);
        protectedContent.forEach(([element,wasInert])=>{element.inert=wasInert;});
        if(intro.contains(document.activeElement)) document.getElementById('main').focus({preventScroll:true});
      };
      if(reduced.matches || !window.gsap) { complete(); return; }
      gsap.to(progress,{value:100,duration:.3,ease:'none',onUpdate:update,onComplete:()=>{
        intro.dataset.phase='complete';
        requestAnimationFrame(()=>requestAnimationFrame(()=>gsap.to(intro,{autoAlpha:0,duration:.45,delay:.18,ease:'power1.inOut',onComplete:complete})));
      }});
    });
  }
  root.classList.add('welcome-pending');
  intro.hidden=false;
  document.addEventListener('keydown',onKey);
  reduced.addEventListener('change',onPreference);
  intro.addEventListener('pointermove',onPointer,{passive:true});
  intro.addEventListener('wheel',onWheel,{passive:true});
  if(!preview) timer=setTimeout(finish,6500);
  update();
  const images=[...intro.querySelectorAll('img')];
  Promise.all(images.map(image=>image.decode())).then(()=>{
    if(finishing) return;
    if(reduced.matches || !window.gsap) {finish();return;}
    protectedContent=[...document.body.children].filter(el=>el!==intro && el.tagName!=='SCRIPT').map(el=>[el,el.inert]);
    protectedContent.forEach(([el])=>{el.inert=true;});
    intro.focus({preventScroll:true});
    intro.classList.add('welcome-playing');
    gsap.fromTo(office,{autoAlpha:0,y:8},{autoAlpha:1,y:0,duration:.35});
    counter=gsap.to(progress,{value:90,duration:2.4,ease:'power1.inOut',onUpdate:update,onComplete:finish});
    if(preview) {counter.pause(1.2);update();}
  }).catch(finish);
});
