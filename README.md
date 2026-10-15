# Noufal portfolio — v2

Serve `dist/` with an HTTP server. The site is a static HTML/CSS/JavaScript project using GSAP 3.13.0, ScrollTrigger and Motion 12.23.24's vanilla API. No React build or backend is required.

## Scroll story

- The introduction pins for two viewport heights on desktop and 1.65 on phones.
- A separate hand/forearm layer provides one smooth greeting wave while the head and torso remain still; a matching holding pose introduces the résumé. The alternative wave image is retained as an asset.
- The résumé sheet leaves the hand, follows two joined cubic curves through one gentle loop, turns toward the viewer, and scales beyond all four screen edges. About text appears only after full coverage.
- The timeline pins for two viewport heights, showing education, Intronsoft, Panchathan Logistics, and Aquaconnect chronologically.
- Desktop projects pin for three viewport heights. Phone projects remain vertically stacked.
- Reverse scrolling reverses each chapter. Chapter navigation and Skip intro use exact scroll destinations.
- System reduced-motion preferences, the motion toggle, unavailable assets/libraries, and viewports under 620px high retain the readable document layout. The avatar poses are images animated through page transforms, not a video or live 3D model.

## Editing

`dist/index.html` contains résumé-based content and section order. `dist/app.js` contains project summaries, scroll timelines, navigation and motion controls. `dist/style.css` contains base styling; `dist/story.css` contains the v2 scenes and responsive chapter layouts.

Project covers are captured screenshots of the reviewed live websites (October 2026). Project chapters use corresponding brand colors: Dr.Grow Labs sage/green, Aquaconnect blue, Panchathan green/amber, Fish Choice warm cream/red, and VJoin lilac. Project buttons open contribution summaries and live links. Email and phone links open the visitor's mail/phone app; the original résumé PDF is downloadable.

## Character assets

Generated using the built-in image tool from the user's identity photo and supplied style reference. Prompts are in `IMAGE-PROMPTS-V2.md`.

- [Wave A](dist/assets/avatar-wave-a.png)
- [Wave B](dist/assets/avatar-wave-b.png)
- [Holding pose](dist/assets/avatar-hold.png)

Google Fonts is the only external rendering dependency; system fonts provide fallbacks. Animation libraries and character assets are served locally with the site.

## Verification

Checked desktop (1280×800) and phone (390×844), paper coverage, Skip intro, chronological timeline, project forward/reverse scrolling, project detail dialog and Escape close, motion-off layout, direct chapter navigation, and horizontal overflow. Checks and browser console showed no JavaScript errors.


## Reference interaction update — October 2026

The current editable site remains in `dist/`. `reference.css` adapts the supplied Modulify visual direction; `app.js` implements equivalent interactions with the existing local GSAP assets.

- The greeting and flying résumé transition are retained. The paper reveals a large About statement, whose words darken with scroll. Full biography, profile, Dubai clock and count-up statistics follow in document flow.
- Desktop project browsing is a horizontal track, including its introductory heading. At widths below 600px, low viewport heights or with motion disabled, projects use the normal grid/stacked layout.
- Profile and service cards use spring-smoothed mouse tilt (6° and 8°) and a moving light. The existing character image responds to the mouse; it remains an image, not the reference’s procedural Three.js character.
- Includes services, toolkit, technology marquee, chronological experience and a contact draft form. The form validates required fields and opens an email draft. No message is submitted to a server and no database/email credentials are required.
- Source material: user-supplied recording, screenshots, React components and portfolio constants. No Modulify services, storage or cookie instrumentation were copied.

Validation: JavaScript syntax; desktop 1280×850 and phone 390×844; horizontal overflow; project dialog and Escape; native form constraints; mouse tilt; motion-off layout with zero pin wrappers; section pin order. No browser JavaScript errors observed. Screenshot in `reference/preview-services.jpg`.

Horizontal gallery check: at 615×724, scrolling down 724px moved the track left 724px while its top stayed at 0. The final card stops inside the right edge, the section unpins afterward, and reverse scrolling restores the pinned track. Progress now sits below the introductory copy.

Flying résumé update: the animated A4 sheet now displays `dist/assets/resume-page.png`, rendered directly from the supplied original PDF at 2200px height. All résumé downloads serve that same original PDF. The animation uses the measured sheet dimensions to preserve the flight and full-screen coverage.

Responsive verification — October 15, 2026: checked 320×568, 320×740, 390×844, 615×724, 768×1024, 1024×768, 1440×900, and 844×390 browser viewports. All have matching page/viewport width and contained profile/contact cards. Fixed toolkit grid minimum sizing and the greeting bubble on 320px phones. Projects stack on phones/short landscapes and use the pinned horizontal track at widths >=600px and heights >=640px. Browser console reported no JavaScript errors. These checks cover browser viewport emulation, not physical-device testing.

Panchathan preview refreshed October 15, 2026: `project-logistics-20261015.jpg` captures the live redesigned homepage after a fresh page request. The previous cached homepage had the older rectangular navigation and simpler hero.

Gallery order: Fish Choice, Panchathan Logistics, Dr.Grow Labs, Aquaconnect Global, VJoin. All five share the same continuous project track; the counter derives its progress from the project count. VJoin no longer appears in a separate section. Verified the fifth card fits inside the viewport and the counter reaches 05/05.

Experience redesign: larger date/role labels, 18px desktop and 16px phone contribution text, bordered career cards, skill tags, and clickable year navigation. The pinned chronology is enabled at >=900px width and >=720px height; smaller screens use a readable vertical list. Verified year selection, the longest card at 1024×720, and phone layout at 390×844 without horizontal overflow or browser errors.
