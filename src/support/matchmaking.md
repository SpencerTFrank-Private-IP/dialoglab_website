---
layout: support-doc.njk
title: Matchmaking
description: How pairing works, waiting states, and what affects your matches.
order: 6
group: Deep Dives
---

## How pairing works

Dialog Lab matches you **one-on-one** with another user who holds an **opposing view** on a topic you have both marked. There is no carousel of profiles to swipe through — the system selects a topic and partner for you.

Matching considers:

- Topics both users have marked with opposing stances (support vs oppose).
- Whether you started a **broad search** (all marked topics) or a **single-topic** search from a Topic Detail Page.
- Who is currently available in the matchable pool.

<div class="beta-docs__callout beta-docs__callout--warning">
  <strong>Matching can take a while</strong>
  During slower periods, finding a partner may take longer. Keep notifications enabled, mark several topics, and consider leaving matching running while you go about your day.
</div>

## Starting and cancelling a search

From the Convos tab, tap **Express Match** to enter the matchable pool — or start from a specific topic on its detail page. While searching:

- The Convos hero shows your current status.
- You can **cancel** at any time to leave the pool.
- You can **add topics** without restarting a broad search.

If you start a single-topic search while a broader search is already running, the app may ask whether to replace your current search.

Cancelling has no penalty — you can start again whenever you are ready.

## Waiting phases

As your search progresses, the lobby may show different states:

| Phase | What it means |
|---|---|
| **Searching for a Partner** | Actively looking for a match on your marked topics. |
| **Taking a While** | No match yet. You can keep waiting or opt to be notified. |
| **We'll notify you** | You can leave the app — Dialog Lab will push a notification when a match is found. |
| **Match preview** | A partner was found. Review the topic and stances before chat opens. |

<div class="beta-docs__shots">
  {% docShot "v1-matchmaking-searching.png", "Searching for a partner lobby state", "Searching" %}
  {% docShot "matchmaking-taking-a-while.webp", "Taking a while lobby state", "Taking a while" %}
  {% docShot "matchmaking-notify.webp", "We'll notify you lobby state", "We'll notify you" %}
</div>

<div class="beta-docs__callout beta-docs__callout--warning">
  <strong>Notifications required to leave</strong>
  If you denied notification permission, you must keep the app open while searching. The lobby will prompt you to enable notifications in Settings.
</div>

{% docShot "v1-notifications-approve.png", "Prompt to enable notifications while matching", "Enable notifications" %}

## Match preview

Before chat begins, you see which topic was selected and each person's viewpoint — for example, "You supported this" and your partner opposed it. A short countdown gives both people time to prepare, then you are taken directly into the chat.

{% docShot "v1-matchmaking-match-found.png", "Match found preview with topic and opposing stances", "Match preview" %}

## If your match cancels

Sometimes a partner declines or cancels before chat starts. Dialog Lab returns you to searching automatically. This is normal when the matchable pool is small.

{% docShot "matchmaking-match-cancelled.webp", "Match cancelled screen returning you to search", "Match cancelled" %}

## Tips for better matches

1. Mark several topics to widen the pool.
2. Keep notifications enabled.
3. Add topics while waiting if the search is taking a while.
4. Tap **Express Match** and leave matching running during slow periods — a match may arrive later.
