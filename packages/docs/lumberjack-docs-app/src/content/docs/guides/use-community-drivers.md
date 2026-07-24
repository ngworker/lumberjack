---
title: Use a Community Driver
description: How to find community Lumberjack log drivers and list your own.
---

Community packages implement the same
[`LumberjackLogDriver`](/lumberjack/reference/core/interfaces/lumberjacklogdriver/)
contract as the built-in drivers. Install the package, register its provide
function next to `provideLumberjack()`, and configure it per that package’s
docs.

## Known drivers

- [@ngworker/lumberjack-firestore-driver](https://github.com/marcinmilewicz/lumberjack-firestore-driver) —
  [Cloud Firestore](https://firebase.google.com/docs/firestore) store
- [@ngworker/lumberjack-applicationinsights-driver](https://github.com/ngworker/lumberjack-applicationinsights-driver) —
  [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

## List your driver

Open a PR against this page using the same bullet format (package link + one-line
description + store technology link).

The ngworker team can host community drivers under the
[ngworker GitHub](https://github.com/ngworker) and
[@ngworker npm](https://www.npmjs.com/org/ngworker) organizations.

## Next steps

- [Create a custom driver](/lumberjack/guides/create-a-custom-driver/)
- [Understanding: log drivers](/lumberjack/understanding/log-drivers/)
