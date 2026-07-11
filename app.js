/* ==========================================================
   ICU deterioration Early Warning System - Interactive Logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SCROLL SPY & DOT NAVIGATION ---
  const scrollContainer = document.querySelector('.scroll-container');
  const sections = document.querySelectorAll('.slide-section');
  const dots = document.querySelectorAll('.scroll-dot');

  const observerOptions = {
    root: scrollContainer,
    rootMargin: '0px',
    threshold: 0.5 // trigger when slide is 50% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideId = entry.target.id;
        const slideIndex = parseInt(slideId.split('-')[1]) - 1;
        
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === slideIndex);
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Dot clicking logic
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(`slide-${index + 1}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // --- 2. INTERACTIVE ROC CURVE TOGGLE ---
  const cohortButtons = document.querySelectorAll('.cohort-btn');
  const rocCurve = document.getElementById('rocCurve');
  const displayAuroc = document.getElementById('displayAuroc');
  const displayCohortDesc = document.getElementById('displayCohortDesc');

  // Curve vectors for different AUCs (scaled to 200x200 SVG coordinate grid)
  const curvesConfig = {
    internal: { 
      path: "M 10 190 Q 20 20 190 10", 
      auroc: "0.932",
      desc: "<strong>Internal Cohort (210,013 patients):</strong> Robust training baseline across MIMIC-III, MIMIC-IV, and eICU. Sepsis AUROC reached 0.845; Liver Failure reached 0.982."
    },
    nwicu: { 
      path: "M 10 190 Q 15 15 190 10", 
      auroc: "0.935",
      desc: "<strong>Northwest ICU (USA):</strong> External validation on 18,443 patients evaluated with zero retraining, proving excellent real-world generalisability."
    },
    zigong: { 
      path: "M 10 190 Q 40 40 190 10", 
      auroc: "0.854",
      desc: "<strong>Zigong Cohort (China):</strong> Evaluated across distinct clinical and demographic environments in Asia, maintaining highly viable predictive strength."
    },
    pediatric: { 
      path: "M 10 190 Q 65 65 190 10", 
      auroc: "0.798",
      desc: "<strong>Pediatric Cohort:</strong> Performance is more modest due to unique pediatric ICU physiology. Dedicated recalibration is required before pediatric clinical use."
    }
  };

  cohortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      cohortButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cohortKey = btn.getAttribute('data-cohort');
      const config = curvesConfig[cohortKey];

      if (config && rocCurve) {
        // Animate SVG path
        rocCurve.setAttribute('d', config.path);
        
        // Update metric texts
        displayAuroc.textContent = config.auroc;
        displayCohortDesc.innerHTML = config.desc;
      }
    });
  });


  // --- 3. EKG HEART MONITOR BACKGROUND CANVAS ANIMATION ---
  const canvas = document.getElementById('ekgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const ekgSegments = [
      { x: 0, y: 0 },
      { x: 40, y: 0 },
      { x: 45, y: -4 },
      { x: 50, y: 4 },
      { x: 55, y: 0 },
      { x: 70, y: 0 },
      { x: 75, y: -28 },
      { x: 80, y: 38 },
      { x: 85, y: -4 },
      { x: 90, y: 0 },
      { x: 105, y: 0 },
      { x: 112, y: -8 },
      { x: 120, y: 0 },
      { x: 180, y: 0 }
    ];

    const pulseLength = 180;
    const precomputedPulse = new Float32Array(pulseLength);
    
    // Precompute pulse values
    for (let x = 0; x < pulseLength; x++) {
      let val = 0;
      for (let i = 0; i < ekgSegments.length - 1; i++) {
        const segStart = ekgSegments[i];
        const segEnd = ekgSegments[i+1];
        if (x >= segStart.x && x <= segEnd.x) {
          const range = segEnd.x - segStart.x;
          const progress = (x - segStart.x) / range;
          val = segStart.y + (segEnd.y - segStart.y) * progress;
          break;
        }
      }
      precomputedPulse[x] = val;
    }

    let offsetX = 0;
    const speed = 1.0; // slower, less distracting EKG in background

    function getPulseHeight(x) {
      const idx = Math.floor(x % pulseLength);
      const positiveIdx = idx < 0 ? (idx + pulseLength) : idx;
      return precomputedPulse[positiveIdx];
    }

    function drawEKG() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw 3 horizontal rows of pulses
      const rows = [height * 0.2, height * 0.5, height * 0.8];
      
      rows.forEach((yBase, idx) => {
        // Soft teal/mint lines for the light clinical mode background
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(0, 167, 157, 0.04)' : 'rgba(11, 76, 84, 0.05)';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const pulseVal = getPulseHeight(x + offsetX + (idx * 50));
          const y = yBase + (pulseVal * 1.5);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      offsetX = (offsetX - speed) % pulseLength;
      requestAnimationFrame(drawEKG);
    }

    drawEKG();
  }


  // --- 4. CLINICAL DASHBOARD IFRAME ---
  // (Slide 4 now uses an iframe pointing to Interactive-Prototype-HTML.html)


  // --- 6. DYNAMIC SAVINGS CALCULATOR WITH SLIDER (SLIDE 8) ---
  const efficacySlider = document.getElementById('efficacySlider');
  const sliderOptLabel = document.getElementById('sliderOptLabel');
  const sliderPrevLabel = document.getElementById('sliderPrevLabel');

  // Daily Savings Fields (Cards Front)
  const optDailyVal = document.getElementById('optDailyVal');
  const prevDailyVal = document.getElementById('prevDailyVal');
  const combinedDailyVal = document.getElementById('combinedDailyVal');
  const combinedAnnualVal = document.getElementById('combinedAnnualVal');

  // Back of Cards Math Fields
  const optMathBeds = document.getElementById('optMathBeds');
  const optMathDaily = document.getElementById('optMathDaily');
  const optMathAnnual = document.getElementById('optMathAnnual');

  const prevMathBeds = document.getElementById('prevMathBeds');
  const prevMathDaily = document.getElementById('prevMathDaily');
  const prevMathAnnual = document.getElementById('prevMathAnnual');

  const combinedMathDaily = document.getElementById('combinedMathDaily');
  const combinedMathAnnual = document.getElementById('combinedMathAnnual');

  // Baseline variables
  const totalBeds = 800;
  const occupancy = 0.85;
  const activeBeds = totalBeds * occupancy; // 680
  const deteriorationRate = 0.35;
  const atRiskPatients = activeBeds * deteriorationRate; // 238
  
  const dailyBedDayCost = 2500; // RM 2,500
  const optFactor = dailyBedDayCost * 0.10; // RM 250 (10% stay reduction)
  const prevFactor = dailyBedDayCost; // RM 2500 (full day avoided)

  function formatCurrency(value) {
    return "RM " + Math.round(value).toLocaleString();
  }

  function formatMillions(value) {
    const millions = value / 1000000;
    return "RM " + millions.toFixed(2) + " Million";
  }

  function updateSavings() {
    if (!efficacySlider) return;

    // Prevention % is the slider value
    const prevPercent = parseInt(efficacySlider.value);
    // Optimization % is 100 - Prevention %
    const optPercent = 100 - prevPercent;

    // Update Slider UI Labels
    sliderOptLabel.textContent = optPercent + "%";
    sliderPrevLabel.textContent = prevPercent + "%";

    // Patients inside each category
    const optPatients = atRiskPatients * (optPercent / 100);
    const prevPatients = atRiskPatients * (prevPercent / 100);

    // 1. Optimization Savings
    const optDaily = optPatients * optFactor;
    const optAnnual = optDaily * 365;

    // 2. Prevention Savings
    const prevDaily = prevPatients * prevFactor;
    const prevAnnual = prevDaily * 365;

    // 3. Combined Savings
    const combinedDaily = optDaily + prevDaily;
    const combinedAnnual = optAnnual + prevAnnual;

    // Update Card Front Values
    if (optDailyVal) optDailyVal.textContent = formatCurrency(optDaily);
    if (prevDailyVal) prevDailyVal.textContent = formatCurrency(prevDaily);
    
    if (combinedDailyVal) combinedDailyVal.textContent = formatCurrency(combinedDaily) + " / day";
    if (combinedAnnualVal) combinedAnnualVal.textContent = formatMillions(combinedAnnual) + " / yr";

    // Update Card Back Math Values
    if (optMathBeds) optMathBeds.textContent = optPatients.toFixed(1) + " Patients";
    if (optMathDaily) optMathDaily.textContent = formatCurrency(optDaily);
    if (optMathAnnual) optMathAnnual.textContent = formatMillions(optAnnual);

    if (prevMathBeds) prevMathBeds.textContent = prevPatients.toFixed(1) + " Patients";
    if (prevMathDaily) prevMathDaily.textContent = formatCurrency(prevDaily);
    if (prevMathAnnual) prevMathAnnual.textContent = formatMillions(prevAnnual);

    if (combinedMathDaily) combinedMathDaily.textContent = formatCurrency(combinedDaily);
    if (combinedMathAnnual) combinedMathAnnual.textContent = formatMillions(combinedAnnual);
  }

  if (efficacySlider) {
    efficacySlider.addEventListener('input', updateSavings);
    // Initial run
    updateSavings();
  }


  // --- 7. 3D CARD FLIP INTERACTION (SLIDE 8) ---
  const flipCards = document.querySelectorAll('.flip-card');
  
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      card.classList.toggle('flipped');
    });
  });


  // --- 8. DYNAMIC SAAS COMMERCIALIZATION MODEL CALCULATOR (SLIDE 9) ---
  const commChargeSlider = document.getElementById('commChargeSlider');
  const commDailyVal = document.getElementById('commDailyVal');
  const commAnnualVal = document.getElementById('commAnnualVal');

  function updateCommercialModel() {
    if (!commChargeSlider) return;
    const charge = parseInt(commChargeSlider.value);
    const activeBeds = 12; // 15 beds * 80% occupancy
    const annualRevenue = activeBeds * charge * 365;

    if (commDailyVal) {
      commDailyVal.textContent = "RM " + charge.toLocaleString() + " / day";
    }
    if (commAnnualVal) {
      commAnnualVal.textContent = "RM " + Math.round(annualRevenue).toLocaleString() + " / year";
    }
  }

  if (commChargeSlider) {
    commChargeSlider.addEventListener('input', updateCommercialModel);
    // Initial run
    updateCommercialModel();
  }

});
