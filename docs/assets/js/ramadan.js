(() => {
  // CONFIG — set to the first fasting day in your target locale
  // Germany (KRM): 2026-02-19 is day 1 (Ramadan begins sunset 2026-02-18)
  const RAMADAN_START = "2026-02-19";
  const TOTAL_DAYS = 30; // typical; you can change to 29 if your local announcement differs

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function toBerlinDateParts(d) {
    // Forces "today" to be interpreted in Europe/Berlin even if viewer is elsewhere
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // en-CA outputs YYYY-MM-DD
    const ymd = fmt.format(d);
    const [y, m, day] = ymd.split("-").map(Number);
    return { y, m, day, ymd };
  }

  function dateFromYMD(ymd) {
    // Create a Date at UTC midnight for stable day-diff math
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  function update() {
    const el1 = document.getElementById("ramadan-line1");
    const el2 = document.getElementById("ramadan-line2");
    if (!el1 || !el2) return;

    const now = new Date();
    const todayBerlin = toBerlinDateParts(now).ymd;

    const start = dateFromYMD(RAMADAN_START);
    const today = dateFromYMD(todayBerlin);

    const diffDays = Math.floor((today - start) / MS_PER_DAY);

    if (diffDays < 0) {
      const daysToGo = Math.abs(diffDays);
      el1.textContent = `Ramadan starts in ${daysToGo} day${daysToGo === 1 ? "" : "s"}.`;
      el2.textContent = `Start date (Berlin): ${RAMADAN_START}`;
      return;
    }

    const dayOfRamadan = diffDays + 1;
    const daysLeft = Math.max(0, TOTAL_DAYS - dayOfRamadan);

    el1.textContent = `Ramadan has started — today is Day ${dayOfRamadan}.`;
    el2.textContent = daysLeft > 0
      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining (assuming ${TOTAL_DAYS} days).`
      : `May Allah accept — Ramadan is at/after its expected end (assuming ${TOTAL_DAYS} days).`;
  }

  update();
  // Refresh every minute (nice if you later add time-to-iftar etc.)
  setInterval(update, 60 * 1000);
})();
