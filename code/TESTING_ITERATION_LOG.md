# Testing & Iteration Log

## Project
Gabru Groomers booking website

## Purpose
This document records the main problems found during development, the changes made to solve them, and the checks used to confirm that the website works.

## Iteration 1: Build
I created the multi-page barbershop site, including the home, services, barbers, gallery, FAQ, booking, login, and registration experiences. The first priority was creating a consistent visual identity and a clear booking journey.

## Iteration 2: Problems found
- `updateBookingSummary()` could try to use booking elements that did not exist on other pages.
- Shared JavaScript could assume that navigation or FAQ elements always existed.
- The login and registration pages were missing from the repository version that was being used by the shared authentication flow.
- The site needed clearer evidence of testing and refinement.

## Iteration 3: Improvements
- Added defensive checks before using page-specific DOM elements.
- Improved shared navigation and FAQ handling so pages without those components do not crash.
- Added login and registration pages under `code/` and linked both to `code/js/script.js`.
- Kept the browser-only authentication flow clear and easy to test.
- Added readable comments explaining why important sections exist.

## Test checklist
- [ ] Home page loads without console errors.
- [ ] Mobile navigation opens and closes.
- [ ] FAQ questions expand and collapse.
- [ ] Booking summary updates when service, date, barber, or time changes.
- [ ] Login accepts a valid stored account.
- [ ] Register creates a new local account.
- [ ] Invalid login shows a useful error.
- [ ] Booking data saves and receipt navigation works.
- [ ] Logout removes the active session.

## Reflection
The main lesson from testing was that a shared script must not assume every page has the same HTML elements. Adding small safety checks made the project more reliable without changing the overall design. The final goal was not only to make the site look professional, but also to make its main user journeys behave consistently.
