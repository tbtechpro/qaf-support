# QAF Support
## Product Requirements Document — Version 1

**Programme:** Qubators AI Foundry  
**Prepared for:** Sanda Ismail Oladimeji  
**Date:** 6 October 2026  
**Status:** Refined product draft for review  
**Scope:** Product behaviour, learner experience and operating responsibilities. Technical specifications are excluded.

## 1. Product definition

QAF Support is a web-based AI support assistant for participants in Qubators AI Foundry. It helps learners find accurate programme information, understand learning-platform instructions, work through appropriate learning questions and stay organized while building AI products.

The product reduces repetitive questions directed to organizers while preserving a clear route to human help. Learners can open a link shared in their WhatsApp group and ask questions privately in the web application. When an organizer is needed, they can review a short message and open the organizer’s confirmed WhatsApp inbox.

**Product promise:** Give learners a relevant, supported answer and a practical next step; acknowledge uncertainty and offer human help when the available information is insufficient.

The assistant should feel friendly, encouraging and engaging. Its usefulness comes from understanding the learner’s question and context, rather than repeating a general motivational message.

## 2. Problem and opportunity

Learners may struggle to locate instructions, understand what to do next, access learning resources or distinguish current announcements from older information. Repeated questions increase organizers’ workload, while unanswered or unclear questions interrupt learning.

These are the problems described by the product owner, not findings from a completed learner study. Their frequency and impact should be measured during the pilot.

| User | Need | Intended improvement |
| --- | --- | --- |
| Learner | Find the correct instruction without searching many messages | Ask one question and receive a relevant answer with a source |
| Learner | Understand a concept or choose a next project step | Receive an explanation suited to their difficulty and project stage |
| Learner | Manage learning alongside other responsibilities | Use a manageable weekly plan and optional reminders |
| Organizer | Reduce repeat explanations | Provide approved information once and improve it when gaps emerge |
| Organizer | Identify issues requiring attention | Review unresolved questions, information gaps and learner feedback |

## 3. Version 1 boundaries

The first working release serves **one programme and one pilot cohort**. The pilot cohort must be confirmed by the organizers before programme-specific content is made available.

### Included

- A mobile-friendly web support conversation.
- Optional learner context, relevant follow-up questions and conversation continuity.
- Answers grounded in approved documents, FAQs, designated website pages and authorized learning-platform resources.
- Supplementary learning and productivity guidance from reviewed, reliable external sources.
- A personal weekly plan and opt-in early reminders for approved assessment deadlines and live sessions (24h + 3h + 1h before, same verified cohort join link shown personally) plus weekly learning check-ins. In-app by default, with optional WhatsApp/email/push where the learner has opted in.
- Helpfulness feedback, optional star ratings and a repair journey for unsatisfactory answers.
- A learner-controlled WhatsApp handoff to a confirmed organizer.
- An organizer workspace for content review, confirmed schedules, support gaps and feedback, plus organizer reminders for upcoming sessions and deadlines.

### Deferred

- A bot operating inside WhatsApp groups or private WhatsApp conversations.
- Unsolicited bulk WhatsApp broadcasts, email or push without learner/organizer opt-in and verified contact.
- Support for multiple organizations or multiple cohorts in the first pilot.
- Access to private course content without organizer authorization.
- Automated grading, certificate decisions, deadline extensions or account-permission changes.
- A replacement for the learning platform or a full course-delivery system.

**Reminder boundary:** Version 1 reminders appear in-app by default, with optional 24h/3h/1h early reminders via WhatsApp/email/push only where the learner has opted in and the contact is verified. Learners must be told where each reminder appears, that in-app does not guarantee an alert while the application is closed, and that each category can be paused or switched off. Live sessions use the same verified cohort join link for all learners, shown personally; never invent a link.

## 4. Goals and success measures

The goals are to reduce repeated organizer questions, increase reliable self-service resolution, help learners take useful next steps and make unresolved issues visible.

The following pilot targets are proposed starting points, not achieved results or promises. Organizers should confirm them against an initial support baseline.

| Measure | Definition | Proposed pilot target |
| --- | --- | --- |
| Answer accuracy | Organizer-reviewed answers that correctly represent the relevant approved information | At least 95% of the reviewed sample |
| Self-service resolution | Eligible support conversations confirmed resolved by the learner without a human handoff | At least 60% |
| Repeat-question reduction | Change in repeated organizer questions compared with a comparable baseline period | At least 30% reduction |
| Helpfulness | Positive helpfulness responses divided by all helpfulness responses received | At least 80% |
| Appropriate escalation | Reviewed cases requiring an organizer in which human help was clearly offered | All reviewed cases |
| Deadline integrity | Learner-facing programme dates traceable to a current, approved cohort schedule | All published programme dates |

Report the number of conversations reviewed, feedback response rate and unresolved cases alongside percentages. A five-star rating does not prove accuracy, and a WhatsApp link click does not prove resolution.

## 5. Learner entry and personalization

Learners arrive through a shared web link. They immediately see the support conversation, suggested question topics and a visible way to contact an organizer.

The welcome should be brief: “Welcome to QAF Support. What would you like help with today?” The assistant may ask what to call the learner, but a name must not be required to ask a question.

Useful optional context includes first name, project stage, preferred explanation depth, device and available study time. Collect it when relevant instead of presenting a long intake form. Learners can change or skip it.

**Personalization rules:**

- Use the learner’s stated context and the current conversation; do not invent background, progress or skill level.
- Adapt the next step, explanation and amount of detail to the actual difficulty.
- Ask for clarification when the question could mean several things.
- Ask one useful follow-up question at a time.
- Avoid repeating questions the learner has already answered.
- Use names naturally, without inserting them into every response.
- Explain any constraint relevant to the device without assuming a phone can perform every lab activity.
- Let learners distinguish a suggested personal plan from their official course progress and workload.

## 6. Answer sources and trust rules

| Information type | Permitted source | Required treatment |
| --- | --- | --- |
| Deadlines, assessment rules, attendance, eligibility and certificates | Current organizer-approved cohort information | Provide only supported facts and identify the relevant announcement or document |
| Learning-platform navigation and access instructions | Official portal guidance and approved support material | Explain supported steps; escalate permissions and personal account issues |
| Programme lessons and project guidance | Authorized course resources and approved facilitator material | Respect course scope; do not claim access to material that is unavailable |
| Study habits, organization and supplementary explanations | Reviewed external educational or primary sources | Label as general learning advice and link the source |
| Individual decisions and exceptions | Confirmed organizer | Explain that an organizer must decide; prepare a handoff |

The assistant must not use external advice to invent a programme rule or overrule an approved instruction. Public website content can inform answers only within its stated scope; a public page does not establish a private cohort’s assessment deadline.

When sources conflict, the assistant must not guess which instruction applies. It should identify the uncertainty, ask for the relevant cohort or assessment if needed, and refer the conflict to an organizer.

Sources must be reviewed for relevance and currency before use. Organizer-approved updates replace superseded instructions. Withdrawn or expired material must not continue to support answers.

**Answer standard:** State the answer first, explain the relevant steps, identify the supporting source, and offer a useful next step where appropriate. Avoid filler, unsupported certainty and invented links.

No product can promise zero errors. The working release must demonstrate that its answer checks, source references and escalation behaviour meet the agreed quality standard.

## 7. Conversation and learning support

### Supported questions

- Programme orientation and where to find learning resources.
- Approved assessment instructions, submission steps and confirmed dates.
- Learning-platform navigation and common access problems.
- Clarification of authorized lesson content.
- Understanding an AI concept, identifying a product problem or choosing a prototype/testing step within the programme’s scope.
- Planning learning time, maintaining focus and recovering from missed personal study sessions.

### Relevant response behaviour

A learner who asks “How do I submit?” should receive the approved submission steps, not a description of the programme. If the assessment is unspecified, first ask which assessment they mean.

A learner who says “I don’t understand this lesson” should be asked which concept or step is difficult, then receive a suitable explanation or example. A useful follow-up could be: “Would a simple example or a step-by-step explanation help more?”

A learner who says “I’m behind” should receive a manageable next action based on their available time and project stage. Personal planning advice must not imply permission to miss an official deadline.

### Tone

Use plain language, warmth and occasional light humour when appropriate. Encourage progress without pressure, guilt or exaggerated praise. Keep emojis limited and optional. Be direct and calm when learners are frustrated or asking about important requirements.

The assistant may offer a relevant additional resource, but should not add unrelated lessons or compulsory follow-up prompts to every answer.

## 8. Weekly planning and reminders

Learners can create or accept a small weekly plan suited to their current goal. Suggested steps should be editable, and learners can mark their own tasks complete. Completing a personal checklist must not be presented as completing an official assessment.

Reminder categories are separate choices:

- A weekly check-in with a short planning prompt or encouragement.
- Confirmed assessment deadlines for the learner’s cohort.
- Confirmed live sessions for the learner’s cohort.

Learners can choose reminder timing (default 24h + 3h + 1h before confirmed assessment deadlines and confirmed live sessions), pause categories or switch reminders off. The chosen timezone must be visible; WAT is the starting default for the pilot, with adjustment for learners elsewhere. Delivery is in-app always, plus WhatsApp/email/push only where the learner has opted in and the contact is verified. Learners must be told where each reminder appears.

Each deadline reminder must identify the assessment, exact date and time, timezone, required action and approved source. Session reminders must include the same verified cohort joining link for all learners, shown personally (with first name when known), plus session, date/time/timezone and approved source. Never assume dates, infer missing times, invent a link or promise a session recording.

If the schedule or session link is missing, show “Awaiting organizer confirmation” rather than an invented reminder. When an organizer changes a date or link, the old reminder must be withdrawn and the revised information clearly identified. Avoid duplicate reminders and notifications for unrelated cohorts.

## 9. Satisfaction and answer repair

After an appropriate answer, offer “This helped” and “Not quite.” Learners may also provide an optional one-to-five-star rating. Feedback must not block the next question.

For “Not quite” or a low rating, ask what was missing. Offer relevant choices such as simpler steps, a different explanation, information that appears incorrect, or an organizer.

The assistant should then clarify and revise its answer using the additional context. It should not repeat the same response or enter a loop of rating requests. If the learner remains dissatisfied after a revised attempt, or requests a person at any point, offer a human handoff.

Track helpfulness and resolution separately. Ask whether the issue is resolved only when useful to the support journey. Do not mark an issue resolved solely because the learner stops responding.

Information flagged as inaccurate must be visible to organizers for review. Any correction should address the underlying source or guidance as well as the individual answer.

## 10. Human support through WhatsApp

Human help is required when approved information is missing or conflicting, a personal account needs attention, a learner asks for an exception, or the assistant cannot resolve the issue appropriately. Learners can also request an organizer directly.

The journey is:

1. Explain why an organizer is needed.
2. Prepare a concise summary of the learner’s question and any relevant attempts already made.
3. Let the learner inspect and edit the summary.
4. Open the confirmed organizer’s WhatsApp inbox when the learner chooses.
5. Let the learner decide whether to send the message.

No message is sent automatically. Include only necessary details; do not request passwords or sensitive account credentials.

If no admin contact is confirmed, offer a copyable summary and the existing official support channel, if verified. Do not invent a phone number or imply that a message has reached an organizer.

A contact-link click is recorded as a handoff attempt, not an organizer reply. Show response hours or expected response times only when the organizers have approved them.

## 11. Organizer workspace and operating responsibilities

Organizers need to manage the information that makes support trustworthy and act on gaps identified by learner conversations.

| Organizer activity | Product requirement |
| --- | --- |
| Approve support content | Review documents, FAQs, official pages and authorized learning resources before use |
| Maintain current information | Identify the responsible content owner, relevant cohort and review date; withdraw superseded material |
| Maintain schedules | Publish confirmed assessments and sessions with dates, times, timezones, same-for-cohort verified join link, and 24h/3h/1h reminder schedule |
| Receive organizer reminders | Get 24h confirm-link/schedule nudge and 1h join nudge for own cohort sessions/deadlines, in-workspace plus optional outside-workspace channel where opted in |
| Manage handoff | Confirm the intended WhatsApp contact and any approved response-hour information |
| Review unresolved questions | See the question, relevant context, reason for escalation and review status |
| Review feedback | Distinguish helpfulness, ratings, reported inaccuracies and unresolved issues |
| Improve FAQs | Turn recurring questions and confirmed answers into reviewed support material |
| Monitor the pilot | Review accuracy, self-service resolution, repeated questions and handoffs with sample sizes |

Designate an organizer responsible for content accuracy and a contact responsible for escalated learner issues. Restrict the organizer workspace to authorized organizers. Learners must not be able to approve content or view another learner’s private conversation.

## 12. Core user journeys

| Journey | Expected outcome |
| --- | --- |
| A learner asks a common programme question | Receives the relevant approved answer and a source; can ask a follow-up |
| A learner asks an ambiguous assessment question | Is asked which assessment they mean before instructions or dates are provided |
| A learner needs a concept explained | Receives a suitable explanation and a relevant optional follow-up |
| A learner needs to stay organized | Receives an editable personal plan and clear reminder choices, including 24h/3h/1h early reminders with same cohort link |
| An organizer has an upcoming session | Receives confirm-link and join nudges and can confirm schedule/link |
| A learner rejects an answer | Receives a clarifying question and revised guidance, with a human route available |
| A learner needs a personal decision | Receives an explanation of the limitation and a reviewable WhatsApp message |
| An organizer changes a deadline | The answer and associated 24h/3h/1h reminders reflect the approved revision; the old date is withdrawn |
| An organizer identifies a recurring gap | Adds or corrects approved information and reviews whether the gap is resolved |

## 13. Acceptance criteria for the working release

| Area | Release acceptance condition |
| --- | --- |
| Entry | A learner can open the shared web link and ask for help on a phone or laptop |
| Relevant answers | The response addresses the question; clarification is requested when the missing context changes the answer |
| Source support | Factual programme answers identify the approved source and do not introduce unsupported rules or dates |
| External advice | Supplementary guidance is clearly distinguished from official programme instructions |
| Personalization | Guidance reflects the learner’s supplied context without inventing progress or capabilities |
| Feedback | Helpful, unhelpful and optional star feedback are usable; unhelpful responses lead to clarification or human help |
| Reminders | Only confirmed cohort deadlines/sessions trigger 24h/3h/1h reminders with the same verified link; timing, timezone, channel and opt-out are clear; no duplicates or wrong-cohort alerts |
| Organizer reminders | Organizers receive confirm/join nudges for own cohort sessions via confirmed channel |
| Handoff | Learners review a summary and can open the confirmed admin inbox; nothing is sent automatically |
| Content updates | Withdrawn information no longer supports new answers or reminders |
| Organizer access | Only authorized organizers can manage information or review private support issues |
| Unavailable information | The assistant clearly acknowledges its limit and offers an appropriate next action |
| Service interruption | The learner sees a clear failure message and can retry or reach the verified support route |

Before release, organizers should test representative known questions, ambiguous requests, outdated information, source conflicts, dissatisfied learners and human-help cases. Confirm all programme dates and contact links independently.

## 14. Current preview versus intended release

**Preview:** https://qaf-support.trailblazerent00.chatgpt.site

The current interactive preview demonstrates the conversation layout, example response flows, learner context, feedback controls, a personal checklist, reminder preferences and organizer setup views.

It does not provide live AI answers, access private lessons, save shared organizer records or deliver automatic reminders. Its context, checklist, ratings and configured admin number are session-only demonstrations. They should not be interpreted as completed release requirements.

The PRD defines the intended working release. Interface appearance alone is not evidence that answer quality, privacy, reminder delivery or organizer workflows have been completed.

## 15. Inputs needed and next steps

| Input or decision | Needed from |
| --- | --- |
| Confirmed pilot cohort and intended learners | Programme organizers |
| Current FAQ, learner guide and support policies | Content owner |
| Authorized lesson and learning-platform material | Programme organizers |
| Approved assessment and live-session schedule, including same-for-cohort verified join link per session | Cohort coordinator |
| Learner reminder opt-ins and verified contacts (WhatsApp/email/push) plus timezone | Learners via opt-in, managed by support owner |
| Organizer reminder contacts and channels | Support owner |
| Confirmed admin WhatsApp number and escalation responsibilities | Support owner |
| Pilot baseline, agreed targets and review sample | Product owner and organizers |
| Review of the preview’s tone, journeys and reminder experience | Learners and organizers |

Recommended progression: refine the interface against this PRD, prepare and approve support content, validate answers and handoffs with organizers, then run a limited pilot before wider rollout.

Technical choices, implementation estimates and delivery specifications can be addressed in a later document after the product requirements are settled.

## 16. Source notes

These public pages informed the initial product exploration. They are starting inputs, not organizer approval or access to private course materials.

- Qubators AI Foundry: https://www.qubators.org/aifoundry
- QAF learning portal: https://learn.qubators.org/
- University of North Carolina Learning Center, “Academic Success at Carolina”: https://learningcenter.unc.edu/tips-and-tools/how-to-succeed/

Public information was reviewed during the 6 October 2026 product exploration. Cohort-specific information must be checked with organizers before use. External learning guidance should supplement approved programme content without replacing it.
