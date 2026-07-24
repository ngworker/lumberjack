---
title: How Log Drivers Work
description: Why Lumberjack routes logs through drivers and how level filtering and failures behave.
---

A **log driver** is the sink Lumberjack uses to output or persist a log. Feature
code never talks to drivers directly: it logs through `LumberjackService` or a
logger class, and Lumberjack fans the log out to every registered driver that
accepts its level.

## The contract

Every driver implements `LumberjackLogDriver`:

- `config` — at least `levels` and `identifier`
- `logCritical` / `logError` / `logWarning` / `logInfo` / `logDebug` / `logTrace` —
  each receives a `LumberjackLogDriverLog` with:
  - `formattedLog` — string from the root `format` function
  - `log` — the structured `LumberjackLog` (message, level, scope, payload, timestamp)

Built-in drivers:

| Driver  | Entry point                           | Typical use                |
| ------- | ------------------------------------- | -------------------------- |
| Console | `@ngworker/lumberjack/console-driver` | Local development          |
| HTTP    | `@ngworker/lumberjack/http-driver`    | Remote log store over POST |

## Registration

Drivers register with the multi-provider token `lumberjackLogDriverToken`.
Provide functions (`provideLumberjackConsoleDriver`,
`provideLumberjackHttpDriver`, or your own) push another multi provider so
several drivers can run together.

## Level filtering

1. Root `provideLumberjack({ levels })` sets the default driver level filter
   (and development/production defaults when omitted).
2. Each driver may override `levels` in its own config.
3. A driver with `levels: ['verbose']` accepts every level. Otherwise the log’s
   level must be listed on that driver.

That is why you can keep a chatty console driver and a strict HTTP driver in the
same app.

## Failures

If a driver throws while handling a log, Lumberjack records a driver error and
tries to forward an error log about that failure to the **remaining stable**
drivers. If no stable driver remains, the error is written with
`console.error`.

## Payloads

`LumberjackLog.payload` is optional structured data. Drivers that care about it
read `log.payload`; others ignore it. Logger classes and `LumberjackLogFactory`
can attach payloads so feature code stays consistent.

## Related guides

- [Create a custom driver](/lumberjack/guides/create-a-custom-driver/)
- [Send logs over HTTP](/lumberjack/guides/send-logs-over-http/)
- [Configure Lumberjack](/lumberjack/guides/configure-lumberjack/)
