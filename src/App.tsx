import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Castle,
  ChevronRight,
  Clock3,
  Compass,
  Crown,
  DatabaseZap,
  FileSearch,
  Filter,
  Flag,
  Flame,
  Gem,
  GraduationCap,
  LayoutDashboard,
  Map,
  MessageSquareText,
  ScrollText,
  Search,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
  Trees,
  WandSparkles,
} from "lucide-react";

type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  mode: "Remote" | "Hybrid" | "Onsite";
  stipend: string;
  quality: number;
  legitimacy: number;
  fit: number;
  competition: number;
  tags: string[];
  suspiciousSignals: string[];
  valueSignals: string[];
  strategy: string[];
  description: string;
  embedding: string;
  deadline: string;
};

type View = "overview" | "opportunities" | "analysis" | "matching" | "strategy" | "agents";

const internships: Internship[] = [
  {
    id: 1,
    title: "NLP Product Analyst Intern",
    company: "BrightForge Labs",
    location: "Bengaluru",
    mode: "Hybrid",
    stipend: "Rs 28k/mo",
    quality: 93,
    legitimacy: 96,
    fit: 91,
    competition: 74,
    tags: ["NLP", "Python", "Product", "Mentorship"],
    suspiciousSignals: ["No exaggerated earning claims", "Verified domain", "Clear mentor assignment"],
    valueSignals: ["Ships a model card", "Weekly product reviews", "Strong portfolio artifact"],
    strategy: ["Lead with your text-analysis project", "Mention how you compare internship quality", "Ask how success will be measured"],
    description:
      "Build text-quality features, review labeled internship posts, and translate model findings into product decisions.",
    embedding: "resume_nlp_quality_vector <-> role_text_384d = 0.18",
    deadline: "4 days",
  },
  {
    id: 2,
    title: "Data Trust & Safety Intern",
    company: "CedarGate Careers",
    location: "Pune",
    mode: "Remote",
    stipend: "Rs 18k/mo",
    quality: 81,
    legitimacy: 89,
    fit: 84,
    competition: 58,
    tags: ["Scikit-learn", "Moderation", "SQL", "Dashboards"],
    suspiciousSignals: ["Public hiring page exists", "Named recruiter", "Reasonable work sample"],
    valueSignals: ["Fraud taxonomy work", "Balanced model evaluation", "Good student hours"],
    strategy: ["Show how you would test review accuracy", "Share examples of risky posts you noticed", "Suggest simple dashboard improvements"],
    description:
      "Improve automated review queues for suspicious opportunities and create analyst-friendly triage dashboards.",
    embedding: "resume_ml_ops_vector <-> trust_safety_role_384d = 0.24",
    deadline: "9 days",
  },
  {
    id: 3,
    title: "Growth AI Intern",
    company: "Moonlit Metrics",
    location: "Delhi NCR",
    mode: "Onsite",
    stipend: "Performance based",
    quality: 42,
    legitimacy: 51,
    fit: 67,
    competition: 39,
    tags: ["AI", "Growth", "Unclear", "Cold Outreach"],
    suspiciousSignals: ["Unclear stipend", "No mentor listed", "Vague AI responsibilities"],
    valueSignals: ["Fast interview process", "Some exposure to campaign data"],
    strategy: ["Ask for written stipend terms", "Request a clear project scope", "Avoid unpaid trial tasks"],
    description:
      "A broad role mixing AI tools, content campaigns, and lead generation with limited technical detail.",
    embedding: "resume_general_vector <-> vague_growth_role_384d = 0.49",
    deadline: "2 days",
  },
  {
    id: 4,
    title: "Search Engineering Intern",
    company: "Northstar Archive",
    location: "Chennai",
    mode: "Hybrid",
    stipend: "Rs 35k/mo",
    quality: 95,
    legitimacy: 94,
    fit: 88,
    competition: 86,
    tags: ["PostgreSQL", "Vector Search", "APIs", "FastAPI"],
    suspiciousSignals: ["Company registry match", "Specific stack", "Clear interview loop"],
    valueSignals: ["Vector search ownership", "API design", "Production retrieval metrics"],
    strategy: ["Bring a small search or matching demo", "Explain how you compare resumes with roles", "Prepare examples of clean API design"],
    description:
      "Prototype resume-to-internship matching services using search APIs and FastAPI endpoints.",
    embedding: "resume_backend_vector <-> semantic_role_768d = 0.16",
    deadline: "11 days",
  },
];

const agentCards = [
  {
    name: "Safety Checker",
    icon: ShieldAlert,
    copy: "Looks for risky signs like unclear pay, fake domains, vague recruiters, and suspicious wording.",
    color: "bg-ember/15 text-bark",
    load: 82,
  },
  {
    name: "Quality Checker",
    icon: Trees,
    copy: "Checks whether the role offers real learning, mentorship, clear work, and portfolio value.",
    color: "bg-fern/20 text-moss",
    load: 94,
  },
  {
    name: "Skill Match Checker",
    icon: Brain,
    copy: "Compares the internship requirements with the student's skills, projects, and resume.",
    color: "bg-river/15 text-river",
    load: 88,
  },
  {
    name: "Competition Checker",
    icon: Swords,
    copy: "Estimates how urgent or competitive the role may be based on deadline, popularity, and role demand.",
    color: "bg-berry/15 text-berry",
    load: 71,
  },
];

const questStages = [
  { label: "Browse internships", value: "Find internships and filter by work mode or risk.", icon: Search },
  { label: "Check your match", value: "See how well the role matches your skills and projects.", icon: Map },
  { label: "Prepare application", value: "Get resume points, interview questions, and what to mention.", icon: ScrollText },
  { label: "Apply with confidence", value: "Know what to ask before applying and how to follow up.", icon: Castle },
];

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "opportunities", label: "Internships", icon: BriefcaseBusiness },
  { id: "analysis", label: "Internship Review", icon: FileSearch },
  { id: "matching", label: "Skill Match", icon: DatabaseZap },
  { id: "strategy", label: "Apply Plan", icon: ScrollText },
  { id: "agents", label: "How It Works", icon: WandSparkles },
];

function scoreTone(score: number) {
  if (score >= 85) return "text-moss bg-moss/10";
  if (score >= 65) return "text-river bg-river/10";
  if (score >= 50) return "text-ember bg-ember/10";
  return "text-berry bg-berry/10";
}

function App() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("All");
  const [riskOnly, setRiskOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved] = useState<number[]>([1, 4]);
  const [activeView, setActiveView] = useState<View>("overview");

  const filtered = useMemo(() => {
    return internships.filter((job) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [job.title, job.company, job.location, job.mode, ...job.tags].some((field) =>
          field.toLowerCase().includes(q),
        );
      const matchesMode = mode === "All" || job.mode === mode;
      const matchesRisk = !riskOnly || job.legitimacy < 70 || job.quality < 60;
      return matchesQuery && matchesMode && matchesRisk;
    });
  }, [mode, query, riskOnly]);

  const selected = internships.find((job) => job.id === selectedId) ?? internships[0];
  const best = internships.reduce((top, job) => (job.fit + job.quality > top.fit + top.quality ? job : top));
  const riskyCount = internships.filter((job) => job.legitimacy < 70 || job.quality < 60).length;

  const chooseJob = (id: number, view: View = "analysis") => {
    setSelectedId(id);
    setActiveView(view);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-parchment text-ink">
      <div className="forest-backdrop" />
      <div className="app-layout relative mx-auto w-full max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
        <aside className="side-rail">
          <div className="brand-lockup">
            <span className="brand-mark">
              <Compass size={22} />
            </span>
            <div>
              <p className="brand-wordmark">InternSight</p>
              <p className="brand-subheading">Internship advisor</p>
            </div>
          </div>

          <nav className="side-nav" aria-label="InternSight dashboards">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`side-nav-item ${activeView === item.id ? "side-nav-item-active" : ""}`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="side-quest-card">
            <p className="eyebrow text-parchment/60">Currently selected</p>
            <h2>{selected.title}</h2>
            <p>{selected.company}</p>
            <button onClick={() => setActiveView("strategy")}>
              Create apply plan <ArrowUpRight size={16} />
            </button>
          </div>
        </aside>

        <div className="content-stage">
          <TopBar
            activeView={activeView}
            query={query}
            setQuery={setQuery}
            mode={mode}
            setMode={setMode}
          />

          {activeView === "overview" && (
            <OverviewDashboard
              best={best}
              riskyCount={riskyCount}
              selected={selected}
              chooseJob={chooseJob}
              setActiveView={setActiveView}
            />
          )}

          {activeView === "opportunities" && (
            <OpportunitiesDashboard
              filtered={filtered}
              selected={selected}
              mode={mode}
              setMode={setMode}
              riskOnly={riskOnly}
              setRiskOnly={setRiskOnly}
              chooseJob={chooseJob}
            />
          )}

          {activeView === "analysis" && (
            <AnalysisDashboard
              selected={selected}
              saved={saved}
              setSaved={setSaved}
            />
          )}

          {activeView === "matching" && <MatchingDashboard selected={selected} />}

          {activeView === "strategy" && <StrategyDashboard selected={selected} />}

          {activeView === "agents" && <AgentsDashboard />}
        </div>
      </div>
    </main>
  );
}

function TopBar({
  activeView,
  query,
  setQuery,
  mode,
  setMode,
}: {
  activeView: View;
  query: string;
  setQuery: (value: string) => void;
  mode: string;
  setMode: (value: string) => void;
}) {
  const title = navItems.find((item) => item.id === activeView)?.label ?? "Dashboard";

  return (
    <header className="top-dock">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1>{title}</h1>
      </div>
      <div className="top-search">
        <Search className="shrink-0 text-moss" size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by role, company, skill, city, or work mode..."
        />
      </div>
      <div className="mode-tabs">
        {["All", "Remote", "Hybrid", "Onsite"].map((item) => (
          <button key={item} onClick={() => setMode(item)} className={`mode-pill ${mode === item ? "mode-pill-active" : ""}`}>
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}

function OverviewDashboard({
  best,
  riskyCount,
  selected,
  chooseJob,
  setActiveView,
}: {
  best: Internship;
  riskyCount: number;
  selected: Internship;
  chooseJob: (id: number, view?: View) => void;
  setActiveView: (view: View) => void;
}) {
  return (
    <div className="dashboard-stack">
      <section className="overview-summary panel">
        <div className="overview-copy">
          <p className="eyebrow">Overview</p>
          <h2>Internship decision dashboard</h2>
          <p>
            Review internships by safety, quality, skill match, competition, and the next steps to take before applying.
          </p>
        </div>
        <div className="overview-actions">
          <ActionTile icon={BriefcaseBusiness} label="Browse internships" value="View and filter available roles" onClick={() => setActiveView("opportunities")} />
          <ActionTile icon={FileSearch} label="Review selected internship" value="Check safety, quality, and match" onClick={() => setActiveView("analysis")} />
          <ActionTile icon={ScrollText} label="Prepare application" value="Create a practical apply plan" onClick={() => setActiveView("strategy")} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={BadgeCheck} label="Safer internships" value="72%" detail="safety pass rate" />
        <Metric icon={FileSearch} label="Review model" value="94.2" detail="quality score accuracy" />
        <Metric icon={DatabaseZap} label="Skill match" value="Ready" detail="resume comparison flow" />
        <Metric icon={Flame} label="Risk watch" value={`${riskyCount}`} detail="needs extra questions" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <div className="panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Best match for you</p>
              <h2>{best.title}</h2>
            </div>
            <button onClick={() => chooseJob(best.id)} className="filter-button bg-ink text-parchment">
              Review <ArrowUpRight size={17} />
            </button>
          </div>
          <p className="mt-4 leading-7 text-bark/70">{best.description}</p>
          <div className="score-grid mt-6">
            <ScoreRing label="Quality" value={best.quality} icon={Crown} description="How useful this internship is for learning and portfolio growth." />
            <ScoreRing label="Safety" value={best.legitimacy} icon={ShieldAlert} description="How trustworthy and clearly explained this internship looks." />
            <ScoreRing label="Skill match" value={best.fit} icon={Target} description="How well this role fits the student's skills and projects." />
            <ScoreRing label="Competition" value={best.competition} icon={Swords} description="How difficult or crowded this opportunity may be." />
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Selected internship</p>
          <h2 className="mt-1 text-2xl font-bold">{selected.title}</h2>
          <div className="mt-5 grid gap-3">
            {questStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.label} className="strategy-card">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-parchment text-bark">
                    <Icon size={18} />
                  </span>
                  <p>
                    <strong className="block text-ink">{stage.label}</strong>
                    <span className="text-sm text-bark/60">{stage.value}</span>
                  </p>
                  <span className="ml-auto text-sm font-black text-bark/35">0{index + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function OpportunitiesDashboard({
  filtered,
  selected,
  mode,
  setMode,
  riskOnly,
  setRiskOnly,
  chooseJob,
}: {
  filtered: Internship[];
  selected: Internship;
  mode: string;
  setMode: (value: string) => void;
  riskOnly: boolean;
  setRiskOnly: (value: boolean) => void;
  chooseJob: (id: number, view?: View) => void;
}) {
  const comparisonTarget =
    filtered
      .filter((job) => job.id !== selected.id)
      .sort((a, b) => internshipBenchmark(b) - internshipBenchmark(a))[0] ?? selected;

  return (
    <section className="dashboard-grid">
      <div className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Internship board</p>
            <h2>Available internships</h2>
          </div>
          <button
            onClick={() => setRiskOnly(!riskOnly)}
            className={`filter-button ${riskOnly ? "bg-ember text-white" : "bg-white text-bark"}`}
          >
            <Filter size={17} />
            Show risky only
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Remote", "Hybrid", "Onsite"].map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`mode-pill bg-white/60 ${mode === item ? "mode-pill-active" : ""}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} selected={selected.id === job.id} onClick={() => chooseJob(job.id, "analysis")} />
          ))}
        </div>
      </div>

      <div className="right-dashboard">
        <div className="panel">
          <p className="eyebrow">Selection summary</p>
          <h2 className="mt-1 text-2xl font-bold">{selected.title}</h2>
          <p className="mt-3 text-bark/65">
            {selected.company} / {selected.location} / {selected.stipend}
          </p>
          <div className="score-grid mt-6">
            <ScoreRing label="Quality" value={selected.quality} icon={Crown} description="How useful this internship is for learning and portfolio growth." />
            <ScoreRing label="Skill match" value={selected.fit} icon={Target} description="How well this role fits the student's skills and projects." />
          </div>
        </div>
        <ComparisonPanel
          left={selected}
          right={comparisonTarget}
          chooseJob={(id) => chooseJob(id, "analysis")}
        />
      </div>
    </section>
  );
}

function internshipBenchmark(job: Internship) {
  return Math.round(job.quality * 0.3 + job.legitimacy * 0.3 + job.fit * 0.25 + (100 - job.competition) * 0.15);
}

function ComparisonPanel({
  left,
  right,
  chooseJob,
}: {
  left: Internship;
  right: Internship;
  chooseJob: (id: number) => void;
}) {
  const rows = [
    { label: "Quality", left: left.quality, right: right.quality, higherIsBetter: true },
    { label: "Safety", left: left.legitimacy, right: right.legitimacy, higherIsBetter: true },
    { label: "Match", left: left.fit, right: right.fit, higherIsBetter: true },
    { label: "Ease", left: 100 - left.competition, right: 100 - right.competition, higherIsBetter: true },
  ];

  return (
    <div className="panel compare-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Side-by-side comparison</p>
          <h2>Compare internships</h2>
        </div>
      </div>

      <div className="compare-head">
        <CompareJobHeader label="Selected" job={left} benchmark={internshipBenchmark(left)} />
        <CompareJobHeader label="Alternative" job={right} benchmark={internshipBenchmark(right)} />
      </div>

      <div className="compare-table" aria-label="Internship comparison scores">
        {rows.map((row) => {
          const leftWins = row.higherIsBetter ? row.left >= row.right : row.left <= row.right;
          const rightWins = row.higherIsBetter ? row.right >= row.left : row.right <= row.left;
          return (
            <div className="compare-row" key={row.label}>
              <span className="compare-label">{row.label}</span>
              <ScoreBar value={row.left} active={leftWins} />
              <ScoreBar value={row.right} active={rightWins} />
            </div>
          );
        })}
      </div>

      <div className="compare-actions">
        <button onClick={() => chooseJob(left.id)}>Review selected</button>
        <button onClick={() => chooseJob(right.id)}>Review alternative</button>
      </div>
    </div>
  );
}

function CompareJobHeader({ label, job, benchmark }: { label: string; job: Internship; benchmark: number }) {
  return (
    <div className="compare-job">
      <span>{label}</span>
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <strong>{benchmark}</strong>
    </div>
  );
}

function ScoreBar({ value, active }: { value: number; active: boolean }) {
  return (
    <div className={`compare-score ${active ? "compare-score-active" : ""}`}>
      <span>{value}</span>
      <div>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AnalysisDashboard({
  selected,
  saved,
  setSaved,
}: {
  selected: Internship;
  saved: number[];
  setSaved: (value: number[] | ((items: number[]) => number[])) => void;
}) {
  return (
    <section className="dashboard-stack">
      <div className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Internship review</p>
            <h2>{selected.title}</h2>
          </div>
          <button
            onClick={() =>
              setSaved((items) =>
                items.includes(selected.id) ? items.filter((id) => id !== selected.id) : [...items, selected.id],
              )
            }
            className="filter-button bg-ink text-parchment"
          >
            <Gem size={17} />
            {saved.includes(selected.id) ? "Saved" : "Save"}
          </button>
        </div>

        <p className="mt-4 leading-7 text-bark/70">{selected.description}</p>
        <div className="score-grid mt-6">
          <ScoreRing label="Quality" value={selected.quality} icon={Crown} description="How useful this internship is for learning and portfolio growth." />
          <ScoreRing label="Safety" value={selected.legitimacy} icon={ShieldAlert} description="How trustworthy and clearly explained this internship looks." />
          <ScoreRing label="Skill match" value={selected.fit} icon={Target} description="How well this role fits the student's skills and projects." />
          <ScoreRing label="Competition" value={selected.competition} icon={Swords} description="How difficult or crowded this opportunity may be." />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SignalList title="Risk checks" items={selected.suspiciousSignals} icon={ShieldAlert} />
        <SignalList title="Why this looks valuable" items={selected.valueSignals} icon={Sparkles} />
      </div>

      <ApplyQuestions />
    </section>
  );
}

function MatchingDashboard({ selected }: { selected: Internship }) {
  return (
    <section className="dashboard-grid">
      <div className="panel">
        <p className="eyebrow">Skill matching</p>
        <h2 className="mt-1 text-3xl font-bold">Why this matches you</h2>
        <p className="mt-4 text-base leading-7 text-bark/70">
          InternSight compares your skills and projects with the internship description to estimate fit.
        </p>
        <div className="vector-orb my-5">
          <DatabaseZap size={38} />
        </div>
        <details className="technical-detail">
          <summary>Technical detail</summary>
          <p className="mt-3 rounded-2xl bg-ink px-4 py-3 font-mono text-sm text-fern">{selected.embedding}</p>
          <p className="mt-3 text-sm leading-6 text-bark/68">
            In the full version, this can use resume embeddings and vector search to compare resumes with internship
            descriptions more accurately.
          </p>
        </details>
      </div>

      <div className="panel">
        <p className="eyebrow">Resume match</p>
        <h2 className="mt-1 text-3xl font-bold">{selected.fit}% aligned</h2>
        <div className="mt-5 grid gap-3">
          {selected.tags.map((tag, index) => (
            <div key={tag} className="strategy-card">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-parchment text-bark">{index + 1}</span>
              <p>{tag}</p>
              <span className="ml-auto rounded-full bg-moss/10 px-3 py-1 text-sm font-bold text-moss">match</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StrategyDashboard({ selected }: { selected: Internship }) {
  return (
    <section className="dashboard-grid">
      <div className="panel">
        <p className="eyebrow">Application plan</p>
        <h2 className="mt-1 text-3xl font-bold">What to do next</h2>
        <div className="mt-5 grid gap-3">
          {selected.strategy.map((item, index) => (
            <div key={item} className="strategy-card">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-parchment text-bark">{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-moss px-4 py-3 font-bold text-white shadow-insetline transition hover:bg-bark">
          Draft application <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="panel">
        <p className="eyebrow">Application toolkit</p>
        <h2 className="mt-1 text-3xl font-bold">Prepare the application kit</h2>
        <div className="mt-5 grid gap-3">
          <ActionTile icon={MessageSquareText} label="Interview questions" value="Generate recruiter-safe clarifiers" />
          <ActionTile icon={BookOpenCheck} label="Skill gaps" value="Rank what to learn before applying" />
          <ActionTile icon={GraduationCap} label="Portfolio proof" value="Match projects to role evidence" />
        </div>
      </div>
    </section>
  );
}

function AgentsDashboard() {
  return (
    <section className="dashboard-stack">
      <div className="grid gap-4 lg:grid-cols-4">
        {agentCards.map((agent) => {
          const Icon = agent.icon;
          return (
            <article key={agent.name} className="agent-card">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${agent.color}`}>
                <Icon size={22} />
              </span>
              <h3>{agent.name}</h3>
              <p>{agent.copy}</p>
              <div className="mt-5 h-2 rounded-full bg-bark/10">
                <div className="h-full rounded-full bg-moss" style={{ width: `${agent.load}%` }} />
              </div>
            </article>
          );
        })}
      </div>
      <div className="panel">
        <p className="eyebrow">How InternSight decides</p>
        <h2 className="mt-1 text-3xl font-bold">A simple review process for every internship</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {questStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="score-card">
                <Icon className="text-moss" size={22} />
                <p className="mt-3">{stage.label}</p>
                <span className="mt-2 block text-sm leading-6 text-bark/60">{stage.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ForestMap({ best }: { best: Internship }) {
  return (
    <div className="forest-map h-full rounded-[24px] p-5">
      <div className="grid h-full content-between gap-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-parchment/70">Currently selected</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white">{best.title}</h2>
          </div>
          <span className="rounded-full bg-parchment px-3 py-2 text-sm font-semibold text-ink">{best.fit}% match</span>
        </div>
        <div className="grid gap-3">
          {questStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="quest-row">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-parchment/95 text-bark">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-white">{stage.label}</p>
                  <p className="text-sm text-parchment/72">{stage.value}</p>
                </div>
                <span className="ml-auto text-sm text-parchment/55">0{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, selected, onClick }: { job: Internship; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`job-card ${selected ? "job-card-active" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-moss shadow-insetline">
              {job.mode}
            </span>
            <span className="text-xs text-bark/55">{job.deadline} left</span>
          </div>
          <h3 className="text-left text-lg font-bold text-ink">{job.title}</h3>
          <p className="mt-1 text-left text-sm text-bark/65">
            {job.company} / {job.location} / {job.stipend}
          </p>
        </div>
        <ChevronRight className="mt-5 shrink-0 text-bark/35" size={20} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        <MiniScore label="Quality" value={job.quality} />
        <MiniScore label="Safety" value={job.legitimacy} />
        <MiniScore label="Match" value={job.fit} />
        <MiniScore label="Ease" value={job.competition} invert />
      </div>
    </button>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof BadgeCheck; label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <Icon className="text-moss" size={22} />
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function MiniScore({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const display = invert ? 100 - value : value;
  return (
    <div className="mini-score">
      <div className="flex items-center justify-between gap-2">
        <p>{label}</p>
        <span>{display}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-bark/10">
        <div className="h-full rounded-full bg-moss" style={{ width: `${display}%` }} />
      </div>
    </div>
  );
}

function ScoreRing({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: number;
  icon: typeof Crown;
  description?: string;
}) {
  return (
    <div className="score-card" title={description}>
      <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${scoreTone(value)}`}>
        <Icon size={15} />
        {value}
      </div>
      <p>{label}</p>
      {description && <span className="mt-2 block text-sm leading-6 text-bark/60">{description}</span>}
      <div className="mt-3 h-2 rounded-full bg-bark/10">
        <div className="h-full rounded-full bg-gradient-to-r from-moss via-river to-ember" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ApplyQuestions() {
  const questions = [
    "Is the stipend fixed and written clearly?",
    "Who will mentor or review my work?",
    "What project or deliverable will I complete by the end?",
  ];

  return (
    <div className="panel">
      <p className="eyebrow">Before you apply</p>
      <h2 className="mt-1 text-2xl font-bold">Before you apply, ask these questions</h2>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {questions.map((question, index) => (
          <div key={question} className="strategy-card">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-parchment text-bark">{index + 1}</span>
            <p>{question}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalList({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof ShieldAlert }) {
  return (
    <div className="signal-box">
      <h3>
        <Icon size={17} />
        {title}
      </h3>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p key={item}>
            <Flag size={14} />
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ActionTile({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button className="action-tile" onClick={onClick}>
      <Icon size={20} />
      <span>
        <strong>{label}</strong>
        <small>{value}</small>
      </span>
    </button>
  );
}

export default App;
