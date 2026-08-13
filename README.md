# ICU OVERWATCH - Clinical Deterioration Warning System

This repository contains the interactive presentation and prototype dashboard for **ICU OVERWATCH** (a clinical deterioration and organ failure early warning system). It is deployed live at **[https://icu-overwatch.vercel.app](https://icu-overwatch.vercel.app)**.

---

## 📋 Context Summary for IDE Agents

If you are an AI assistant starting a new session on this repository, read the sections below to understand the current design constraints, slide layouts, and mathematical formulas implemented in the codebase.

### 🎨 Visual & Design Guidelines
* **Palette:**
  * Background: Soft clinical light green/teal gradient (`#f6fbf9` to `#e8f5f1`).
  * Text Headers: CSS linear text-gradients of dark clinical teal (`#0b3c46`) to mint green (`#00a79d`).
  * Accent/Active Metrics: Mint green (`#00a79d`).
* **Animations:**
  * A subtle, slow-drifting live background of blurred green blobs (`.bg-blob` in CSS).
  * An animated EKG heart monitor line scrolling at the bottom of the canvas layer (`#ekgCanvas`).
  * An animated pulsing EKG shield logo on the title slide.

---

## 🗂️ Presentation Slide Directory

1. **Slide 1: Title (Clinical Vision)**
   * Animated EKG shield logo, header, and vision statement.
2. **Slide 2: The Deterioration Challenge**
   * Single-line statistics layout showing ICU deterioration data.
3. **Slide 3: Standardised Predictive Panel**
   * Lead time specifications for the 5 prediction endpoints (Circulatory Failure, Sepsis, Hyperglycaemia, Kidney Failure, Liver Failure).
4. **Slide 4: Interactive Prototype**
   * Embeds **[Interactive-Prototype-HTML.html](Interactive-Prototype-HTML.html)** inside an iframe to show the live clinical dashboard.
5. **Slide 5: Model Performance & Validation**
   * Interactive AUROC graph. Toggle buttons switch validation curves and update descriptive metrics dynamically.
6. **Slide 6: Why This Matters for Patients**
   * Summary of the TREWS study mortality reductions and an animated SOFA score reduction comparison chart.
7. **Slide 7: Why This Matters for Hospitals**
   * Details operational stress mitigations, staff burnout reduction, and capacity enhancement.
8. **Slide 8: Public Healthcare Savings (National Level)**
   * 3D card-flip interaction with front-facing dynamic metrics and back-facing mathematical calculations.
   * **Calculations Slider:** An efficacy range slider controls the Optimization vs Prevention savings distribution.
9. **Slide 9: Private Healthcare Efficacy & Value**
   * Explores insurer preference, legal risk protection, and features a dynamic SaaS licensing slider.
10. **Slide 10: Technology Readiness Level (TRL) Timeline**
    * Execution roadmap tracking phases TRL 4, TRL 5 (Current Phase: Silent Validation), TRL 6-7 (Bedside Pilot), TRL 8 (Clinical Trials), and TRL 9 (Rollout).
11. **Slide 11: Next Steps & Partnership Ask**
    * Three ask cards with the **Clinical Pilots** card enlarged, highlighted, and styled in gold gradient to indicate the primary call-to-action.

---

## 🧮 Custom Formulas & JavaScript Logic

### 1. Slide 8: Public Savings Efficacy Split
* **Baseline Assumptions:**
  * `Occupied Beds` = 800 national beds × 85% occupancy = 680 active beds.
  * `At-Risk Patients` = 680 beds × 35% daily deterioration rate = 238 patients/day.
  * `Daily Sepsis Cost` = RM 2,500/day.
* **Optimization Savings (card-opt):**
  * Cuts stay lengths by 10% (equivalent to saving RM 250 per bed-day).
  * $Daily = 238 \times (P_{\text{opt}} / 100) \times RM 250$.
* **Prevention Savings (card-prev):**
  * Avoids deterioration entirely (saving full RM 2,500 bed-day cost).
  * $Daily = 238 \times (P_{\text{prev}} / 100) \times RM 2500$.
* **Combined Savings (card-combined):**
  * Sum of Optimization + Prevention savings (e.g., at default 60% Opt / 40% Prev split, total annual savings are **RM 99.90 Million**).

### 2. Slide 9: SaaS Commercialization Model
* **Baseline Assumptions:**
  * Standard 15-bed private ICU operating at 80% occupancy = 12 active occupied beds.
* **SaaS Pricing Slider:**
  * Range: **RM 0 to RM 2,000** (defaults to **RM 99**).
  * `Daily Monitoring Charge` displays the selected slider value.
  * `Hospital Annual Revenue` is calculated dynamically:
    $$Annual = 12 \text{ occupied beds} \times \text{Daily Charge} \times 365 \text{ days}$$
    *(At default RM 99/day, this equals **RM 433,620 / year**).*

---

## 🚀 How to Run Locally
Just open `index.html` in a web browser. For ideal local rendering of the Slide 4 dashboard iframe, start a simple HTTP static server in the root directory:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
