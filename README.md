# Noufal portfolio - v2

Run `sh dev.sh` from this folder to start the complete site at http://localhost:4173, including the contact API and error routes. Do not use `python -m http.server` for contact-form testing: it only serves static files and cannot run `/api/contact`. The site is a static HTML/CSS/JavaScript project using GSAP 3.13.0, ScrollTrigger and Motion 12.23.24's vanilla API. No React build is required. Vercel Functions handle contact validation and the explicit HTTP 500 recovery route.

## Scroll story

- The introduction pins for two viewport heights on desktop and 1.65 on phones.
- A separate hand/forearm layer provides one smooth greeting wave while the head and torso remain still; a matching holding pose introduces the résumé. The alternative wave image is retained as an asset.
- The Resumesheet leaves the hand, follows two joined cubic curves through one gentle loop, turns toward the viewer, and scales beyond all four screen edges. About text appears only after full coverage.
- The desktop work timeline pins for two viewport heights, showing Aquaconnect, Panchathan Logistics, and Intronsoft from latest to earliest. Education follows separately.
- Desktop projects pin for three viewport heights. Phones and tablets below 900px use a swipeable gallery with previous/next controls and a five-project counter.
- Reverse scrolling reverses each chapter. Chapter navigation and Skip intro use exact scroll destinations.
- System reduced-motion preferences, unavailable assets/libraries, and viewports under 620px high retain the readable document layout. The avatar poses are images animated through page transforms, not a video or live 3D model.

## Editing

`dist/index.html` contains résumé-based content and section order. `dist/app.js` contains project summaries, scroll timelines, navigation and motion controls. `dist/style.css` contains base styling; `dist/story.css` contains the v2 scenes and responsive chapter layouts.

Project covers are captured screenshots of the reviewed live websites (October 2026). Project chapters use corresponding brand colors: Dr.Grow Labs sage/green, Aquaconnect blue, Panchathan green/amber, Fish Choice warm cream/red, and VJoin lilac. Project buttons open contribution summaries and live links. Email and phone links open the visitor's mail/phone app; the original ResumePDF is downloadable.

## Character assets

Generated using the built-in image tool from the user's identity photo and supplied style reference. Prompts are in `IMAGE-PROMPTS-V2.md`.

- [Wave A](dist/assets/avatar-wave-a.png)
- [Wave B](dist/assets/avatar-wave-b.png)
- [Holding pose](dist/assets/avatar-hold.png)

Google Fonts is the only external rendering dependency; system fonts provide fallbacks. Animation libraries and character assets are served locally with the site.

## Verification

Checked desktop (1280×800) and phone (390×844), paper coverage, Skip intro, chronological timeline, project forward/reverse scrolling, project detail dialog and Escape close, motion-off layout, direct chapter navigation, and horizontal overflow. Checks and browser console showed no JavaScript errors.


## Reference interaction update - October 2026

The current editable site remains in `dist/`. `reference.css` adapts the supplied Modulify visual direction; `app.js` implements equivalent interactions with the existing local GSAP assets.

- The greeting and flying Resumetransition are retained. The paper reveals a large About statement, whose words darken with scroll. Full biography, profile and count-up statistics follow in document flow.
- Desktop project browsing is a horizontal track, including its introductory heading. Below 900px, projects use a native swipeable horizontal gallery without a pinned scroll chapter.
- Profile and service cards use spring-smoothed mouse tilt (6° and 8°) and a moving light. The existing character image responds to the mouse; it remains an image, not the reference’s procedural Three.js character.
- Includes services, toolkit, technology marquee, chronological experience and a contact form delivered through FormSubmit to noufalrizwanuae@gmail.com. The form validates required fields, prevents duplicate submissions while sending, retains input on errors, and resets only after FormSubmit accepts the submission. No API keys are used.
- Source material: user-supplied recording, screenshots, React components and portfolio constants. No Modulify services, storage or cookie instrumentation were copied.

Validation: JavaScript syntax; desktop 1280×850 and phone 390×844; horizontal overflow; project dialog and Escape; native form constraints; mouse tilt; motion-off layout with zero pin wrappers; section pin order. No browser JavaScript errors observed. Screenshot in `reference/preview-services.jpg`.

Horizontal gallery check: at 615×724, scrolling down 724px moved the track left 724px while its top stayed at 0. The final card stops inside the right edge, the section unpins afterward, and reverse scrolling restores the pinned track. Progress now sits below the introductory copy.

Flying Resumeupdate: the animated A4 sheet now displays `dist/assets/resume-page.png`, rendered directly from the supplied original PDF at 2200px height. All Resumedownloads serve that same original PDF. The animation uses the measured sheet dimensions to preserve the flight and full-screen coverage.

Responsive verification - October 15, 2026: checked 320×568, 320×740, 390×844, 615×724, 768×1024, 1024×768, 1440×900, and 844×390 browser viewports. All have matching page/viewport width and contained profile/contact cards. Fixed toolkit grid minimum sizing and the greeting bubble on 320px phones. Projects use a swipeable gallery below 900px; larger screens use the pinned horizontal track when the viewport is at least 640px tall. Browser console reported no JavaScript errors. These checks cover browser viewport emulation, not physical-device testing.

Panchathan preview refreshed October 15, 2026: `project-logistics-20261015.jpg` captures the live redesigned homepage after a fresh page request. The previous cached homepage had the older rectangular navigation and simpler hero.

Gallery order: Fish Choice, Panchathan Logistics, Dr.Grow Labs, Aquaconnect Global, VJoin. All five share the same continuous project track; the counter derives its progress from the project count. VJoin no longer appears in a separate section. Verified the fifth card fits inside the viewport and the counter reaches 05/05.

Experience redesign: larger date/role labels, 18px desktop and 16px phone contribution text, bordered career cards, skill tags, and clickable year navigation. The pinned chronology is enabled at >=900px width and >=720px height; smaller screens use a readable vertical list. Verified year selection, the longest card at 1024×720, and phone layout at 390×844 without horizontal overflow or browser errors.

Contact delivery: `dist/index.html` has a standard FormSubmit POST action as a no-JavaScript fallback. The JavaScript enhancement sends to `/api/contact`, which validates the same shared rules on the server and returns normalized fields. The browser then sends those fields through FormSubmit’s documented AJAX endpoint and reports provider acceptance, rather than claiming inbox delivery. First use requires the owner to click Activate Form in the confirmation email (check Spam). After activation, test from the production website and confirm receipt in Gmail. FormSubmit processes submitted contact details. Its default spam checks remain enabled, and an extra honeypot is included.

Production setup test: FormSubmit confirmed that the form needs activation and that an activation email has been sent to the owner. The owner later activated the form and confirmed receipt of the diagnostic test.

Error and form update: `dist/404.html` is Vercel’s automatic custom missing-page response (404). `/500` rewrites to `api/server-error.mjs`, which returns `dist/500.html` with status 500; platform failures outside these application routes retain Vercel’s own error response. Both pages use `dist/error.css`, absolute recovery links and noindex. `dist/contact-rules.mjs` shares trimmed-value validation between the browser and server: name 2–100, valid email up to 254, optional company up to 120, an allowed topic, and message 20–5,000 characters. `dist/contact.js` provides inline errors, a first-invalid-field focus, character counter, busy state and retained input on failure. The browser uses the fixed owner recipient. The validation endpoint rejects oversized or malformed JSON and cross-origin browser requests, and does not log message contents.

Verification: live HTTP 404 for missing routes, HTTP 500 for `/500`, and HTTP 422 with field errors for invalid contact data. Checked 320px/390px mobile error pages and form layout, correction of field errors, 16px input text, and no horizontal overflow. The owner has activated FormSubmit and confirmed receipt of the diagnostic email.

Delivery correction: FormSubmit returned a 403 verification page to Vercel server-side fetches. Delivery now uses its documented browser AJAX integration after server validation. The localhost browser test returned success and cleared the form only after provider acceptance; no browser errors were recorded. `sh dev.sh` runs the API-capable localhost preview.

Final delivery verification: the production browser form completed server validation and FormSubmit submission, displayed the success confirmation, cleared the inputs, and restored the send button. The owner confirmed receipt of the diagnostic email after activation.

Mobile project autoplay: below 900px, the visible gallery advances every 4.5 seconds and wraps after project five. Pointer interaction pauses it; keyboard focus, mouse hover, hidden tabs, project dialogs, offscreen galleries and reduced-motion preferences stop automatic advancement. Manual navigation remains available. Checked automatic advance, last-to-first looping, keyboard focus pause and 390px width without overflow.

Compact mobile redesign (October 16): project arrows are replaced by five labelled pagination buttons with an active dot. Swiping and the existing autoplay remain. Below 900px, the introduction uses short entrance reveals and ordinary document flow instead of a pinned paper scene; desktop keeps the full flying Resumestory. Services and experience use accessible disclosure buttons with one card open per group; all panels expand again on desktop. Spacing, toolkit lists, profile details and contact details are compacted while retaining readable input sizes and all existing content. At 390×844, measured document height fell from 12,299px to 6,718px (about 45%), with zero mobile pin spacers. Verified 320/390/768px containment, pagination selection, one-open disclosures, and restoration of three desktop pinned scenes and expanded panels at 1440px.

Refresh behavior: an early navigation check detects browser reloads, disables scroll restoration for that reload, replaces the section hash with `#home`, and resets scroll before rendering and on pageshow. Fresh section links and in-page navigation are preserved. Verified refresh from Work and Contact returns to scroll position 0 on mobile and desktop.

Alignment and qualifications update: work is latest-first in both DOM order and desktop year navigation (Aquaconnect, Panchathan Logistics, Intronsoft), and the latest card opens by default on mobile. The timeline derives segment sizes from its item count. Education is separate, with MBA in Human Resource Management, Madurai Kamaraj University (2025), and B.Tech in Information Technology, K.L.N. College of Engineering (2022, CGPA 8.15). MBA details were verified against the owner’s supplied HR résumé; that file is not published as an asset. Phone toolkit groups now use a compact label/value list with no browser list indent; tablet/desktop cards keep aligned headers. Stats use fixed value/label rows so wrapped labels cannot shift the numbers. The send label and arrow are centered as a group. Checked 320px and 390px containment, desktop ordering and year selection, education rendering, and stat row alignment.
