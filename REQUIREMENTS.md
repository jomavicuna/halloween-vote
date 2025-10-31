# Halloween Costume Voting App - Requirements Document

**Project Name:** Halloween Vote
**Client:** Jorge (Internal Project)
**Date:** 2025-10-31
**Developer:** Jorge with Claude Code AI
**Timeline:** As soon as possible

---

## 1. Project Overview

### Purpose
Web application to allow friends to vote for the best Halloween costume at a party. Each participant registers themselves with their costume photo and can vote once for their favorite costume.

### Key Goals
- Simple, fast registration process
- One vote per person (honor system)
- Real-time results visible to all participants
- Mobile-first design (participants will only use mobile devices)
- All data stored in Airtable

---

## 2. User Roles

### Participant (Single Role)
- Can register themselves with name and costume photo
- Can vote once for any costume (including their own)
- Can view real-time voting results
- **Total participants:** Up to 25 people

---

## 3. Core Features

### 3.1 User Registration
**Page:** `/register`

**Fields:**
- Name (text input, required)
- Costume Photo (image upload, required, stored in Airtable)

**Validations:**
- Name cannot be empty
- Photo must be uploaded (JPEG/PNG format)
- Photo size limit: TBD (reasonable for mobile uploads)

**Behavior:**
- User fills form and submits
- Data saved to Airtable `Participants` table
- Success message + redirect to voting page

---

### 3.2 Voting
**Page:** `/vote`

**Display:**
- Grid/list of all registered participants
- Show: Name + Costume Photo thumbnail
- Mobile-optimized layout

**Interaction:**
- User selects one costume to vote for
- User enters their name to submit vote (honor system, no technical verification)
- Confirmation: "Vote submitted successfully"

**Validations:**
- Must select a costume
- Must enter voter name
- Each name can only vote once (checked in Airtable)
- If name already voted: Show message "You already voted"

**Behavior:**
- Vote recorded in Airtable `Votes` table
- Auto-redirect to results page after successful vote

---

### 3.3 Real-Time Results
**Page:** `/results`

**Display:**
- List of all participants ordered by vote count (highest to lowest)
- Show for each participant:
  - Rank position (#1, #2, #3...)
  - Name
  - Costume Photo
  - Vote count

**Behavior:**
- Auto-refresh or live updates to show real-time results
- Accessible to everyone at any time during the event

---

## 4. Navigation Flow

```
Home (/)
  ↓
Register (/register)
  ↓
Vote (/vote)
  ↓
Results (/results)
```

**Navigation Options:**
- Simple header/menu to jump between pages
- Mobile-friendly navigation (hamburger menu or bottom nav)

---

## 5. Technical Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **UI Approach:** Mobile-first, clean white background (#FAF9F6)
- **Deployment:** Vercel

### Backend
- **Database:** Airtable
- **API:** Next.js API Routes to interact with Airtable
- **Image Storage:** Airtable Attachments

### Airtable Schema

**Table 1: Participants**
| Field Name | Type | Description |
|------------|------|-------------|
| id | Auto number | Unique identifier |
| name | Single line text | Participant name |
| photo | Attachment | Costume photo |
| created_at | Created time | Registration timestamp |

**Table 2: Votes**
| Field Name | Type | Description |
|------------|------|-------------|
| id | Auto number | Unique identifier |
| voter_name | Single line text | Name of person voting |
| voted_for | Link to Participants | Participant who received the vote |
| created_at | Created time | Vote timestamp |

**Computed in Frontend:**
- Vote count per participant (aggregate from Votes table)

---

## 6. Design Requirements

### Color Palette
- **Background:** #FAF9F6 (clean white)
- **Text:** #0F0F0F (dark)
- **CTA Buttons:** #0B6E4F (green)

### Typography
- System fonts (default)

### Layout
- Mobile-first (320px - 428px width priority)
- Responsive for tablets if needed
- Clean, minimal interface
- High contrast for accessibility

### UI Components
- Use Catalyst UI (Tailwind UI) components where applicable
- Simple form inputs
- Clear, large touch targets for mobile
- Photo thumbnails optimized for mobile viewing

---

## 7. User Experience (UX)

### Registration Flow
1. User lands on `/register`
2. Enters name
3. Uploads photo (camera or gallery on mobile)
4. Submits
5. See success message
6. Redirected to voting page

### Voting Flow
1. User sees all costumes with photos
2. Taps to select favorite
3. Enters their name
4. Confirms vote
5. See success message
6. Redirected to results

### Results Viewing
1. User can access `/results` anytime
2. See live ranking
3. Celebrate the winners!

---

## 8. Edge Cases & Validations

### Registration
- ❌ Duplicate names allowed (friends might have same name)
- ✅ Photo required
- ✅ Name required

### Voting
- ❌ Cannot vote twice with same name (honor system check)
- ✅ Can vote for yourself
- ✅ Must select a costume before submitting
- ⚠️ If someone tries to vote with already-used name: show friendly error

### Results
- Handle tie scores (same rank displayed)
- Show "No votes yet" if voting hasn't started

---

## 9. Security & Data

### Security Level
- **Low security required** (friendly party app, honor system)
- No passwords or authentication
- No sensitive data

### Data Privacy
- Photos uploaded by participants (assumed consent)
- Names visible to all participants
- No data encryption needed (non-sensitive party app)

### Secrets Management
- Airtable API key stored in environment variables
- Use 1Password CLI for secret management
- Never commit `.env` files

---

## 10. Deployment

### Environment Variables Required
```
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

### Deployment Platform
- **Vercel** (automatic deployment from Git)

### Pre-Deployment Checklist
- ✅ Test registration flow
- ✅ Test voting flow
- ✅ Test results display
- ✅ Test on mobile devices
- ✅ Verify Airtable connection
- ✅ Check environment variables

---

## 11. Success Criteria

### Must Have (MVP)
- ✅ Users can register with name + photo
- ✅ Users can vote once
- ✅ Results display in real-time, ordered by votes
- ✅ Mobile-friendly interface
- ✅ Data persists in Airtable

### Nice to Have (Future)
- Photo compression/optimization on upload
- Vote confirmation with preview
- Admin panel to reset votes or remove participants
- Share results on social media
- Download final results as PDF/image

---

## 12. Timeline & Milestones

**Phase 1: Setup (1 session)**
- Create Next.js project
- Set up Airtable base and tables
- Configure environment variables

**Phase 2: Core Features (2-3 sessions)**
- Build registration page + Airtable integration
- Build voting page + vote logic
- Build results page + real-time display

**Phase 3: Testing & Polish (1 session)**
- Test full flow on mobile
- Fix bugs and edge cases
- Deploy to Vercel

**Target:** Ready ASAP for Halloween event

---

## 13. Out of Scope

- User authentication/login system
- SMS or email verification
- Payment processing
- Multiple voting categories
- Chat or comments feature
- Photo editing tools
- Historical data/analytics beyond current event

---

## 14. Questions & Assumptions

### Assumptions
- Participants have smartphones with cameras
- Good internet connection at party venue
- All participants speak English
- Event happens in one session (not multi-day)

### Open Questions for Development
- [ ] What should happen if photo upload fails?
- [ ] Should there be a "close voting" mechanism?
- [ ] Maximum photo file size limit?
- [ ] Should admin (Jorge) have special controls?

---

## 15. Contact & Support

**Project Owner:** Jorge
**Email:** vicuna@hey.com
**Phone:** +51 943 891 428
**Location:** Lima, Peru (UTC-5)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-31
**Status:** Ready for Development
