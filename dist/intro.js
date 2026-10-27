// A short welcome, separate from the scroll-driven résumé story.
window.portfolioIntroReady = new Promise(resolve => {
  const root = document.documentElement;
  const intro = document.getElementById('welcome-intro');
  clearTimeout(window.portfolioWelcomeWatchdog);
  if (!intro || !window.portfolioWelcomeRequested) {
    resolve();
    return;
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const previewPhase = location.hostname==='localhost' ? new URLSearchParams(location.search).get('intro-preview') : null;
  let timeline;
  let finished = false;
  let protectedContent = [];
  let timeout;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    timeline?.kill();
    // Prepare the hero and its pinned layout behind the opaque welcome screen.
    // Resolving first lets app.js finish its image/font setup before we reveal it.
    root.classList.remove('welcome-pending');
    document.removeEventListener('keydown', onKey);
    reduced.removeEventListener('change', onPreference);
    resolve();
    const reveal = () => {
      protectedContent.forEach(([element, wasInert]) => { element.inert = wasInert; });
      const complete = () => {
        intro.hidden = true;
        if (intro.contains(document.activeElement)) {
          document.getElementById('main').focus({preventScroll:true});
        }
      };
      if (reduced.matches || !window.gsap) { complete(); return; }
      gsap.to(intro, {autoAlpha:0, duration:.45, ease:'power1.inOut', onComplete:complete});
    };
    // Wait for layout to paint, so the hero never flashes at its unpinned size.
    Promise.race([window.portfolioHeroReady, new Promise(done => setTimeout(done, 3000))])
      .then(() => requestAnimationFrame(() => requestAnimationFrame(reveal)));
  }

  function onKey(event) {
    if (event.key === 'Escape') finish();
    // Keep focus inside the brief animation; Escape still dismisses it.
    if (event.key === 'Tab') { event.preventDefault(); intro.focus({preventScroll:true}); }
  }
  function onPreference(event) { if (event.matches) finish(); }

  // A slow stylesheet or deferred script must not turn a refresh into a skipped intro.
  root.classList.add('welcome-pending');
  intro.hidden = false;
  document.addEventListener('keydown', onKey);
  reduced.addEventListener('change', onPreference);
  if (!previewPhase) timeout = setTimeout(finish, 7500);

  const images = [...intro.querySelectorAll('img')];
  Promise.all(images.map(image => image.decode())).then(() => {
    if (finished) return;
    if (reduced.matches || !window.gsap) { finish(); return; }
    protectedContent = [...document.body.children]
      .filter(element => element !== intro && element.tagName !== 'SCRIPT')
      .map(element => [element, element.inert]);
    protectedContent.forEach(([element]) => { element.inert = true; });
    intro.focus({preventScroll:true});
    intro.classList.add('welcome-playing');

    const office = intro.querySelector('.welcome-office');
    const walk = intro.querySelector('.welcome-walker');
    const greeter = intro.querySelector('.welcome-greeter');
    const hello = intro.querySelector('.welcome-hello');
    const room = intro.querySelector('.welcome-room');

    gsap.set(office, {xPercent:-50, x:0});
    gsap.set([walk, greeter, hello], {autoAlpha:0});
    gsap.set(walk, {scale:.48, y:-38});
    timeline = gsap.timeline({onComplete:finish, defaults:{ease:'power2.inOut'}});
    timeline.fromTo(office, {autoAlpha:0, y:12}, {autoAlpha:1, y:0, duration:.45}, 0)
      .call(() => { intro.dataset.phase='stand'; }, [], 1.35)
      .to(office, {scale:.94, x:-34, y:-12, autoAlpha:0, duration:.5}, 1.4)
      .to(walk, {autoAlpha:1, duration:.2}, 1.65)
      .call(() => { intro.dataset.phase='walk'; }, [], 1.65)
      .to(walk, {scale:1, y:0, duration:1.55, ease:'power1.inOut'}, 1.75)
      .to(room, {autoAlpha:.25, duration:1.2}, 1.75)
      .to(walk, {autoAlpha:0, duration:.18}, 3.28)
      .to(greeter, {autoAlpha:1, duration:.2}, 3.28)
      .call(() => { intro.dataset.phase='hello'; }, [], 3.3)
      .fromTo(hello, {autoAlpha:0, y:10, scale:.94}, {autoAlpha:1, y:0, scale:1, duration:.35, ease:'back.out(1.4)'}, 3.4)
      .to({}, {duration:.6}, 3.75);
    const previewTimes = {office:.8, walk:2.6, hello:3.9};
    if (Object.hasOwn(previewTimes, previewPhase)) timeline.pause(previewTimes[previewPhase], false);
  }).catch(finish);
});
