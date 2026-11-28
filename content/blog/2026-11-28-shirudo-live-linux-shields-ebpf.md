---
title: "Shirudo: OpenAI and Cisco's open-source shields for unpatched Linux"
description: OpenAI and Cisco released Shirudo, an eBPF-based runtime for temporary protections while patches roll out. What it does, and what to ask before using it.
date: 2026-11-28
tags: [Security, AI, Inventions]
sources:
  - title: OpenAI and Cisco introduce Shirudo, OpenAI
    url: https://openai.com/index/introducing-shirudo/
  - title: eBPF, Wikipedia
    url: https://en.wikipedia.org/wiki/EBPF
aiAssisted: true
---

On 23 November 2026, OpenAI [announced Shirudo](https://openai.com/index/introducing-shirudo/), an open-source runtime built with Cisco to help teams protect Linux systems while patches are still being tested and rolled out. The name is Japanese for "shield", and the idea is to give operators a tested, temporary safeguard that can be applied to a running service without a restart.

## What happened

OpenAI's post starts from a problem every operations team knows: testing and deploying a patch can take days or weeks. In the meantime it can be hard to protect a service, because an exploit and a legitimate request may rely on the same Linux operation, according to the post. Blocking that operation outright could take the service offline.

Shirudo's answer is a "shield": a temporary safeguard that blocks the behaviour exposing a vulnerability while allowing legitimate requests through. Teams can test whether a shield does its job, and once an operator approves it, it can be deployed while the service keeps running.

The announcement includes one concrete attack example, alongside a linked conference walkthrough of applying and verifying a shield. In a controlled test, a shield generated with OpenAI's Codex blocked a Java4Shell exploit attempt against a running Elasticsearch service, with no restart. According to the post, the shield added an input check to Java's Base64 decoder and was attached directly to the running Elasticsearch process. That is a single vendor-run demonstration, not a broad evaluation, and should be read that way.

## Why it matters technically

Shirudo is built on eBPF. Wikipedia's [overview of eBPF](https://en.wikipedia.org/wiki/EBPF) describes it as a technology for running programs in a privileged context such as the operating system kernel, extending the kernel at runtime without changing kernel source or loading kernel modules. Safety comes from an in-kernel verifier that performs static analysis and rejects programs that crash, hang or otherwise interfere with the kernel. Programs attach to hook points and run when the relevant event fires, and the article lists security among eBPF's use cases.

OpenAI says it is designing Shirudo around four capabilities:

- **Live protection.** eBPF shields can block vulnerable code paths without restarting the system, and teams can monitor how a proposed shield would affect applications before enforcing it.
- **Defence at machine speed.** The aim is to give agents programmable controls to investigate vulnerabilities, develop targeted shields and validate them against exploits and real workloads. The post stresses that security teams control what gets deployed.
- **Trusted deployment.** Shields are cryptographically signed and verified before loading. The post notes that Linux's eBPF verifier checks programs against its safety rules, and that kernel security controls restrict unauthorised changes.
- **Hardware-backed verification.** Shirudo uses a Trusted Platform Module (TPM) to support a verifiable record of protections being loaded or removed, which operators can use as evidence when checking compliance.

The project is licensed under BSD 2-Clause, with its BPF programs dual-licensed under BSD and GPL. OpenAI's stated long-term goal is for tested shields to be published alongside vulnerability disclosures, so that operators can evaluate and deploy temporary protections while a permanent fix is prepared. The post also announces a technical deep-dive webinar on 15 December.

## What this means for engineering teams

Treat Shirudo as a promising approach rather than a drop-in product, and ask a few questions before adopting anything like it.

- **A shield is not a patch.** The post frames shields as protection while patches roll out. Keep your patching process and its deadlines; use a shield to shorten the window of exposure, not to remove the need to fix the underlying flaw.
- **Review the shield, not just the source.** If an AI agent drafts a shield, a human still has to understand what it blocks and what it might break. The post says operators approve what is deployed; build that review step into your change process.
- **Test against real traffic.** The central risk the announcement describes is breaking legitimate requests. Use the monitor-before-enforce capability, and rehearse on a staging copy with realistic workloads.
- **Check your kernel and hardware assumptions.** The post describes features built on eBPF and a TPM. Check whether your fleet's kernels and hardware meet the project's documented requirements before planning around it.
- **Keep an audit trail.** Signed shields and a verifiable record of what was loaded are valuable for incident response and compliance. Make sure the evidence ends up somewhere your security team will look.
- **Maintain your own judgement on claims.** The Java4Shell result comes from the vendors announcing the project. Wait for independent testing and community feedback before trusting it in production.

## Closing

The interesting idea here is not any single shield but the workflow: investigate a flaw, craft a narrow mitigation, test it against legitimate traffic, sign it, deploy it live and keep a verifiable record. If the open-source project matures, it could make the gap between disclosure and patch less dangerous. Until then, it is worth following closely and trying in a test environment.
