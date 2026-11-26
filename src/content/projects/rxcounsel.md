---
title: "RxCounsel"
description: "An AI counselling-prep tool I built on my own initiative during my Express Scripts co-op. Piloted with 3 pharmacists, it saved roughly 1–1.5 hours a day per pharmacist."
category: "pharmacy"
date: 2026-08-31
featured: true
heroImage: "../../assets/projects/rxcounsel/rxcounsel-input-screen.png"
heroAlt: "RxCounsel's input form, with fields for age, sex, renal and hepatic impairment, current medications, medical conditions and an input modifier, a New drug(s) section for drug name, dose and sig, and a Generate button."
heroCaption: "RxCounsel's input screen: the pharmacist enters patient details and the new drug, then clicks Generate."
---

## The problem

During my co-op at Express Scripts Canada Pharmacy, I counselled patients by phone on new specialty prescriptions. Before each call, I spent time pulling together the counselling points, dosing details and kidney or liver considerations from several sources.

## What I built

On my own time, I designed RxCounsel, an AI tool that prepares a drug-specific counselling guide for each new prescription. Each guide covers:

- The main counselling messages for the patient
- Dosing, with a check for unusual dose patterns
- Renal and hepatic considerations
- Points tailored to the patient's current medications and demographics

## How it evolved

I worked with a pharmacist who acted as an informal project lead. They set priorities, tested each version and told me what to build next.

The pharmacy also needed every recommendation tied to a referenced source, so I rebuilt RxCounsel as a Copilot agent that cites Canadian clinical guidelines.

## Result

Three pharmacists tested RxCounsel in a pilot. Each handles about 7–12 complex counselling sessions a day, and the tool saved about 8 minutes on each: roughly 1–1.5 hours a day per pharmacist.
