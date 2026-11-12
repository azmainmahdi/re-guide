# Guide format

A guide is a plain text file (.md or .txt). Write it in any editor and open it in Re;Guide.

```
# Freelancer study guide
## Warm-up (5 min)
Say: Thanks for joining. This takes about an hour.
Ask: How did you start freelancing?
Probe: What made you choose it?
Note: Skip if they already said it.
```

| Line | Meaning |
|---|---|
| `# Title` | Optional. The file name is used if missing. |
| `## Section (5 min)` | Starts a section. Minutes are optional and turn on its clock. `5 min`, `5 minutes`, `5m` all work. |
| `Say:` | Read aloud, like a welcome or consent line. One cue. |
| `Ask:` | A question. Numbered through the guide. One cue; the time you first reach it is logged. |
| `Probe:` | A follow-up to the Ask above it. |
| `Note:` | Private, for you only. It sits with the cue above it. |

Edge cases:
- A line with no word in front joins the line above, so wrapped text stays together.
- Capitals don't matter. A leading `-`, `*` or `1.` is ignored. `Q:` works for Ask, `Follow-up:` for Probe.
- An unknown word like `Tip:` is kept as a private note and flagged.
- A Probe with no Ask, an empty section, or a file with no questions is listed at the top of the guide. No line is dropped.
