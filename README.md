# Re;Guide

Re;Guide is a free desktop app for running semi-structured interviews from a plain-text guide. It runs on Mac and Windows, and nothing leaves your computer.

> **Beta.** It works, but some edges are still rough and things will change. I'm aiming for a first full release in 2027.

![Re;Guide during an interview](docs/interview-day.png)

It started as the guide I used to run the interviews for my own study. This version works with any guide you write.

## What you can do with it

The window has three panes. The interview outline is on the left, the script in the middle and your notes on the right. You can fold either side away.

The script shows one cue at a time. A cue is one thing you say or one question you ask, with its follow-up probes and your private notes next to it. You can switch to the full script whenever you like.

The bar across the top shows the session time, the time left in the current section, and whether you're ahead of or behind your plan. Pause it for a break and the break isn't counted.

You can open a later section to check something while the clock stays on the one you're in. Click **Return to live** to go back.

Each question gets a time stamp the first time you reach it.

Write notes for each section, and press M to bookmark a moment. If you tick when your recorder started, bookmarks show the time in the recording, so you can find the quote later.

The recording and consent ticks are optional. You can hide them.

Moved on to the next section by mistake? **Undo section** takes you back and gives the time back too.

The interview saves as you go, in a file next to your guide. If the app closes halfway through, it opens again paused where you left off.

At the end you get a summary, and you can export the times, notes and bookmarks as CSV.

There's a Day and a Night look, text size controls, and keyboard shortcuts. The arrow keys move between cues and N moves to the next section.

![The full script view](docs/full-script-day.png)
![The summary at night](docs/summary-night.png)

## Where your data lives

The guide is a text file on your computer, and each interview is saved as a JSON file beside it. There's no account and no server, and nothing is sent anywhere.

## Install

Download the latest installer from [Releases](../../releases):

- Mac: `aarch64.dmg` for Apple Silicon (M1 and later), `x64.dmg` for Intel.
- Windows: the `.msi` or the `-setup.exe`.

The installers aren't signed yet, so your computer will warn you the first time you open the app.

- On a Mac, open the app once, then go to System Settings → Privacy & Security and click **Open Anyway**.
- On Windows, when you see "Windows protected your PC", click **More info**, then **Run anyway**.

Click **Try the sample** in the app to open a short made-up guide about working from cafés.

## Guide format

```
# Freelancer study guide
## Warm-up (5 min)
Say: Thanks for joining. This takes about an hour.
Ask: How did you start freelancing?
Probe: What made you choose it?
Note: Skip if they already said it.
```

The full rules, odd cases included, are in [docs/guide-format.md](docs/guide-format.md).

## Build from source

You need Node.js, Python 3 and [Rust](https://rustup.rs).

```
npm install
node tests/guide.test.js
npm run build        # installers land in src-tauri/target/release/bundle
```

`sh dev/serve.sh` opens the page in a normal browser at http://127.0.0.1:8733, with a stand-in for the desktop shell.

## Planned

Guides in two languages, with a switch between them. A link to Re;Code, so question times can mark where each answer starts in the transcript.

## Re;Code

[Re;Code](https://github.com/azmainmahdi/re-code) is for afterwards: reflexive thematic analysis of your transcripts.

## Licence

MIT. Fonts and icons keep their own licences, listed in [THIRD-PARTY.md](THIRD-PARTY.md).
