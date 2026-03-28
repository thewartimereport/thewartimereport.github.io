const searchIndex = [
  { title: "Day 1 — Operation Epic Fury Begins — Supreme Leader Khamenei Killed", url: "reports/day-1.html", snippet: "US and Israel launch 900 strikes in 12 hours. Khamenei and dozens of officials killed. Iran retaliates with hundreds of missiles across the region.", date: "Feb 28" },
  { title: "Day 2 — Dubai Airport Hit as Iran Strikes Back Across the Gulf", url: "reports/day-2.html", snippet: "Iranian drone strikes damaged Dubai International Airport. Trump signals openness to Venezuela-style outcome. Missile fire at Israel continues.", date: "Mar 1" },
  { title: "Day 3 — Hezbollah Enters the War — Opens Second Front Against Israel", url: "reports/day-3.html", snippet: "Hezbollah broke its ceasefire and launched missiles and drones into Israel from southern Lebanon, opening a second front.", date: "Mar 2" },
  { title: "Day 4 — Israel Destroys Assembly of Experts Meeting Site", url: "reports/day-4.html", snippet: "Israeli strikes destroyed the building where Iran's Assembly of Experts was expected to convene to select a successor to Khamenei.", date: "Mar 3" },
  { title: "Day 5 — Congress Backs Trump's War — Rejects War Powers Resolutions", url: "reports/day-5.html", snippet: "Both the Senate and the House voted to reject bipartisan war powers resolutions that would have constrained Trump's authority.", date: "Mar 4" },
  { title: "Day 6 — Trump Demands Role in Choosing Iran's Next Leader", url: "reports/day-6.html", snippet: "Trump told Axios he wants to be involved in choosing Khamenei's successor. He declared Mojtaba Khamenei 'unacceptable.'", date: "Mar 5" },
  { title: "Day 7 — Hotel Bombings, British Jets, and a Growing Refugee Crisis", url: "reports/day-7.html", snippet: "Israel bombed a hotel in downtown Beirut. The conflict's geographic and humanitarian toll expanded sharply.", date: "Mar 6" },
  { title: "Day 8 — One Week of War: 3,000+ Targets Struck, $3.7B Spent", url: "reports/day-8.html", snippet: "CENTCOM reported striking over 3,000 targets and destroying 43 Iranian warships. At least 1,332 people have been killed in Iran.", date: "Mar 7" },
  { title: "Day 9 — Oil Infrastructure Targeted for the First Time", url: "reports/day-9.html", snippet: "US and Israel struck Iranian oil storage depots and refining facilities for the first time. Massive fire at the Shahran oil depot.", date: "Mar 8" },
  { title: "Day 10 — Mojtaba Khamenei Named Supreme Leader", url: "reports/day-10.html", snippet: "Iran's Assembly of Experts officially named Mojtaba Khamenei as Iran's new supreme leader, defying Trump's veto.", date: "Mar 9" },
  { title: "Day 11 — $11.3 Billion in Six Days — War Costs Mount", url: "reports/day-11.html", snippet: "Pentagon revealed that the first six days of Operation Epic Fury cost $11.3 billion. Trump searches for an endgame.", date: "Mar 10" },
  { title: "Day 12 — Pentagon Reveals $11.3 Billion Spent in First Six Days", url: "reports/day-12.html", snippet: "Financial and strategic costs becoming impossible to ignore. The first six days of operations cost $11.3 billion.", date: "Mar 11" },
  { title: "Day 13 — Press Crackdown and Embassy Evacuations", url: "reports/day-13.html", snippet: "Trump administration threatens news outlets over critical coverage and floats treason charges. Embassy evacuations continue.", date: "Mar 12" },
  { title: "Day 14 — Kharg Island Struck — U.S. Hits Iran's Oil Lifeline", url: "reports/day-14.html", snippet: "U.S. forces struck military targets on Kharg Island — Iran's main oil export hub responsible for roughly 90% of exports.", date: "Mar 13" },
  { title: "Day 15 — Isfahan Hit, Majority of Americans Oppose the War", url: "reports/day-15.html", snippet: "Strikes on Isfahan killed at least 15. Quinnipiac poll found 53% of Americans oppose the strikes on Iran.", date: "Mar 14" },
  { title: "Day 16 — The Quiet Before the Storm — Both Sides Regroup", url: "reports/day-16.html", snippet: "A relative lull in major strikes. Both the coalition and Iran appeared to be regrouping as diplomatic deadlock holds.", date: "Mar 15" },
  { title: "Day 17 — U.S. Refueling Plane Crashes in Iraq", url: "reports/day-17.html", snippet: "A U.S. aerial refueling aircraft crashed in Iraq, underscoring the punishing operational tempo of the air campaign.", date: "Mar 16" },
  { title: "Day 18 — Ali Larijani Killed, Israel Invades Lebanon", url: "reports/day-18.html", snippet: "Ali Larijani — Iran's de facto leader — was killed. Israel launched a ground invasion of southern Lebanon.", date: "Mar 17" },
  { title: "Day 19 — Civilian Deaths in West Bank and Israel Underscore Toll", url: "reports/day-19.html", snippet: "Three Palestinian women killed in a beauty salon in the West Bank when Iranian missile shrapnel struck.", date: "Mar 18" },
  { title: "Day 20 — Israel Strikes South Pars, Qatar LNG Crippled", url: "reports/day-20.html", snippet: "Israel struck the South Pars gas field. The day the Iran war became a global energy catastrophe.", date: "Mar 19" },
  { title: "Day 21 — Three Weeks of War, No End in Sight", url: "reports/day-21.html", snippet: "Iran warned of 'zero restraint' if its energy infrastructure is targeted. Trump calls NATO 'cowards.'", date: "Mar 20" },
  { title: "Day 22 — Trump Hints at 'Winding Down' as Iran Strikes Diego Garcia", url: "reports/day-22.html", snippet: "Iran fired two ballistic missiles at the US-UK base on Diego Garcia. Trump hinted the war may be winding down.", date: "Mar 21" },
  { title: "Day 23 — 48-Hour Ultimatum — Trump Threatens Iran's Power Grid", url: "reports/day-23.html", snippet: "Trump issued a 48-hour ultimatum: reopen the Strait of Hormuz or the US will 'obliterate' Iran's power plants.", date: "Mar 22" },
  { title: "Day 24 — Trump Blinks — Ultimatum Extended 5 Days", url: "reports/day-24.html", snippet: "Hours before his 48-hour ultimatum expired, Trump extended the deadline by five days, claiming 'productive talks.'", date: "Mar 23" },
  { title: "Day 25 — US Sends 15-Point Peace Plan as Bushehr Nuclear Plant Hit", url: "reports/day-25.html", snippet: "Brent crude crashed 11% to $99.94/barrel. Then Bushehr nuclear plant was struck. Market whiplash continues.", date: "Mar 24" },
  { title: "Day 26 — Iran Dismisses Trump's Peace Claims as 12 Killed in Tehran", url: "reports/day-26.html", snippet: "Trump declared the 'war has been won.' Iran dismissed all claims of negotiations as propaganda.", date: "Mar 25" },
  { title: "Day 27 — Israel Kills Hormuz Blockade Mastermind", url: "reports/day-27.html", snippet: "Israel claims to have killed IRGC Navy commander Alireza Tangsiri — the architect of Iran's Strait of Hormuz blockade.", date: "Mar 26" },
  { title: "Day 28 — Trump Extends Hormuz Deadline to April 6", url: "reports/day-28.html", snippet: "Iranian missile struck Prince Sultan Air Base in Saudi Arabia. Israel launched strikes on two nuclear facilities.", date: "Mar 27" },
  { title: "Day 29 — Iran's 'Heavy Price' Retaliation After Nuclear Strikes", url: "reports/day-29.html", snippet: "Houthis officially joined the war. Iran vowed 'heavy' retaliation after nuclear facility strikes. 300+ US troops wounded.", date: "Mar 28" },
  { title: "War Economics — Markets, Money, and Analysis", url: "economics.html", snippet: "The 2026 Iran War has triggered the worst energy crisis since the 1970s, reshaping global markets and commodity prices." },
  { title: "Investigations", url: "investigations.html", snippet: "Deep research into the power structures, hidden connections, and documented evidence behind the 2026 Iran War." },
  { title: "Timeline — 2026 Iran War Day by Day", url: "timeline.html", snippet: "Complete day-by-day timeline of the 2026 Iran War, from Operation Epic Fury on February 28 through the ongoing conflict." },
  { title: "About The Wartime Report", url: "about.html", snippet: "Open-source, independently produced daily briefing covering the 2026 Iran War." },
  { title: "Who Benefits From This War? — Follow the Money", url: "who-benefits.html", snippet: "Congressional insider trading, Epstein's prediction, Russia's windfall. A collaborative investigation from 4 specialist agents." },
  { title: "The Epstein Files & the Iran War", url: "epstein.html", snippet: "Documented connections from court filings, FBI memos, and credible journalism about the Epstein network and the war." },
  { title: "Corrections & Editorial Policy", url: "corrections.html", snippet: "Our commitment to accuracy. When we get something wrong, we correct it publicly and promptly." },
];

function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  // Determine URL prefix based on current page location
  const isSubdir = window.location.pathname.includes('/reports/');
  const prefix = isSubdir ? '../' : '';

  input.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    if (query.length < 2) {
      results.classList.remove('active');
      results.innerHTML = '';
      return;
    }

    const matches = searchIndex.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.snippet.toLowerCase().includes(query) ||
      (item.date && item.date.toLowerCase().includes(query))
    ).slice(0, 8);

    if (matches.length === 0) {
      results.innerHTML = '<div class="search-no-results">No results found</div>';
      results.classList.add('active');
      return;
    }

    results.innerHTML = matches.map(item => {
      const highlightedTitle = item.title.replace(
        new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'),
        '<mark>$1</mark>'
      );
      return `<a href="${prefix}${item.url}" class="search-result-item">
        <div class="result-title">${highlightedTitle}</div>
        <div class="result-snippet">${item.snippet}</div>
      </a>`;
    }).join('');
    results.classList.add('active');
  });

  // Close on click outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container')) {
      results.classList.remove('active');
    }
  });

  // Close on Escape
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      results.classList.remove('active');
      this.blur();
    }
  });
}

document.addEventListener('DOMContentLoaded', initSearch);
