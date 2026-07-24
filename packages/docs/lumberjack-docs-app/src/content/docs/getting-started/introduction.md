---
title: Introduction
description: What Lumberjack is and when to use it for Angular logging.
---

Lumberjack (`@ngworker/lumberjack`) is an Angular logging library built around
**log drivers**: small plugins that receive structured logs and write them
somewhere (the browser console, an HTTP store, a community backend, or your own
sink).

You register Lumberjack once at bootstrap, enable the drivers you need, then
emit logs through `LumberjackService` or — preferably — small
application-specific logger classes.

## Why a driver model?

Most apps need more than `console.log`. Logs may need different destinations
per environment, different severity filters per destination, and structured
fields (scope, payload) that survive the trip to a log store.

Lumberjack keeps that plumbing out of feature code:

1. Feature code calls a logger method with a message (and optional payload).
2. Lumberjack formats the log and filters by level.
3. Each registered driver that accepts the level receives the log.

## What you get out of the box

| Package                                                                               | Role                                                           |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`@ngworker/lumberjack`](/lumberjack/reference/core/readme/)                          | Core: `provideLumberjack`, `LumberjackService`, loggers, types |
| [`@ngworker/lumberjack/console-driver`](/lumberjack/reference/console-driver/readme/) | Browser console driver                                         |
| [`@ngworker/lumberjack/http-driver`](/lumberjack/reference/http-driver/readme/)       | POST logs to an HTTP store with retries                        |

Community drivers cover other backends; see
[Use a community driver](/lumberjack/guides/use-community-drivers/).

## Next steps

- [Quick start](/lumberjack/getting-started/quick-start/) — install, register, log once
- [Write a logger](/lumberjack/guides/write-a-logger/) — structured app loggers
- [How log drivers work](/lumberjack/understanding/log-drivers/) — mental model
