# AI Safety Net

AI Safety Net is a local-first checklist tool for small teams that are starting to use AI at work and want a plain-language way to spot obvious risks.

It helps a user:

- answer a short set of practical questions;
- see a simple risk summary;
- export or save a working action list;
- discuss AI use with a manager, board, client, or team without jargon.

## What this is

This is a readiness and reflection tool. It is not legal advice, compliance certification, security assurance, medical advice, therapy, crisis care, or an emergency service.

The tool is designed to help people ask better questions before adopting AI. It cannot prove that an AI system is safe, lawful, private, fair, or secure.

## Who it helps

- founders and operators who need a first AI risk conversation;
- community organisations that need a simple checklist;
- small teams without a dedicated AI governance function;
- contributors who want a small open-source tool to improve.

## What you can do now

1. Start the assessment.
2. Answer what you know and skip what you do not.
3. Review the generated risk notes.
4. Save or export the result for a human review conversation.

## Safety boundaries

- Do not paste secrets, credentials, private client data, medical information, or legal documents into the tool.
- Treat the output as a draft checklist, not a decision.
- Ask a qualified professional for legal, privacy, cybersecurity, medical, financial, or compliance advice.
- If an AI system may affect safety, health, housing, employment, finance, education, legal rights, or access to essential services, get specialist review before deployment.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Checks

```bash
npm test
npm run lint
npm run build
```

## Public demo

Public GitHub Pages evidence was checked unauthenticated on 2026-07-04:

- `https://almost-magic.github.io/ai-safety-net/`

This confirms a reachable page, not release readiness. Review the current build, README, licence, safety wording, and issue list before any public release claim.

## Contributing

Good first issues:

- add examples for a small charity, school, clinic, or local business;
- improve export wording so a stranger can understand the result in 60 seconds;
- add tests for risk scoring and skipped answers;
- add accessibility checks for keyboard and mobile use;
- add a short threat model for data entered into the browser.

## Licence

MIT. See [LICENSE](LICENSE).
