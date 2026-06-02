import { useState, useCallback, useRef, useEffect } from "react";

const PRACTICE_AREAS = [
  "Personal Injury",
  "Family Law",
  "Employment Law",
  "Business/Corporate",
  "Real Estate",
  "Criminal Defense",
  "Immigration",
  "Estate Planning",
  "Intellectual Property",
  "Other",
];

const URGENCY_LEVELS = [
  { value: "low", label: "Low", desc: "No immediate deadline" },
  { value: "medium", label: "Medium", desc: "Within 30 days" },
  { value: "high", label: "High", desc: "Within 7 days" },
  { value: "critical", label: "Critical", desc: "Immediate action needed" },
];

const SAMPLE_INTAKES = [
  {
    id: "sample-1",
    clientName: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(619) 555-0142",
    practiceArea: "Employment Law",
    urgency: "high",
    description: "I was terminated from my position as a senior marketing manager after 6 years at the company. Two weeks before my termination, I filed a complaint with HR about my supervisor making inappropriate comments about my age (I'm 54). The stated reason for termination was 'restructuring' but my role was immediately filled by a 28-year-old who was hired externally. I have the HR complaint documentation and my performance reviews which were all 'exceeds expectations.'",
    priorAttorney: "No",
    preferredContact: "Email",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    assessment: {
      viability: "Strong",
      viabilityScore: 85,
      summary: "This case presents strong indicators of age discrimination and potential retaliation under both federal (ADEA) and state employment laws. The temporal proximity between the HR complaint and termination (2 weeks), combined with the immediate replacement by a significantly younger employee, creates a compelling prima facie case.",
      keyIssues: [
        "Temporal proximity between HR complaint and termination suggests retaliation",
        "Replacement by significantly younger employee supports age discrimination claim",
        "Strong documentation trail with HR complaint and performance reviews",
        "\"Restructuring\" pretext may be undermined by immediate external hire",
        "Potential claims under ADEA, state FEHA, and wrongful termination in violation of public policy"
      ],
      recommendedActions: [
        "Preserve all employment records, emails, and communications immediately",
        "File EEOC charge within 180-day deadline (high urgency)",
        "Request personnel file and any documentation of the restructuring decision",
        "Interview potential witnesses who may corroborate discriminatory environment",
        "Calculate damages including lost wages, benefits, and emotional distress"
      ],
      estimatedComplexity: "Moderate",
      conflictFlags: [],
      practiceNotes: "Client has strong evidentiary foundation. Priority is EEOC filing deadline. Consider demand letter before litigation to explore early settlement."
    }
  },
  {
    id: "sample-2",
    clientName: "James Chen",
    email: "j.chen@techstartup.io",
    phone: "(858) 555-0287",
    practiceArea: "Business/Corporate",
    urgency: "medium",
    description: "I co-founded a SaaS company with my business partner 3 years ago. We have a 50/50 equity split but no formal operating agreement beyond our initial LLC filing. My partner has been making major financial decisions without consulting me, including signing a $200K vendor contract and hiring his brother as CTO at above-market salary. Revenue is about $1.2M annually. I want to either force a buyout or dissolve the partnership but I'm worried about protecting the IP I developed.",
    priorAttorney: "No",
    preferredContact: "Phone",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    assessment: {
      viability: "Moderate",
      viabilityScore: 68,
      summary: "This is a business divorce scenario complicated by the absence of a formal operating agreement. While the client has legitimate grievances regarding fiduciary duty breaches, the 50/50 split without a buyout mechanism creates a deadlock situation that typically requires negotiation or judicial dissolution.",
      keyIssues: [
        "No operating agreement creates ambiguity around decision-making authority and exit mechanisms",
        "50/50 ownership deadlock with no tie-breaking provisions",
        "Potential breach of fiduciary duty through unilateral financial decisions",
        "IP ownership rights need clarification, especially for individually developed technology",
        "Related-party transaction (hiring brother as CTO) may constitute self-dealing"
      ],
      recommendedActions: [
        "Audit all financial records and vendor contracts signed without consent",
        "Document IP contributions and development history with timestamps",
        "Engage forensic accountant to assess company valuation and any misappropriation",
        "Explore mediation before litigation to preserve business value",
        "Draft demand letter outlining fiduciary duty concerns and proposed resolution"
      ],
      estimatedComplexity: "High",
      conflictFlags: [],
      practiceNotes: "Deadlock cases are expensive to litigate. Recommend mediation first. Client should secure independent access to all company financial systems and records before partner becomes aware of legal action."
    }
  }
];

const IntakeForm = ({ onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    practiceArea: "",
    urgency: "medium",
    description: "",
    priorAttorney: "No",
    preferredContact: "Email",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.practiceArea) e.practiceArea = "Select a practice area";
    if (!form.description.trim() || form.description.trim().length < 50)
      e.description = "Please provide at least 50 characters describing your situation";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            className={inputClass("clientName")}
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="e.g. Jane Doe"
          />
          {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            className={inputClass("email")}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            className={inputClass("phone")}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
          <select
            className={inputClass("preferredContact")}
            value={form.preferredContact}
            onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Either">Either</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Practice Area *</label>
        <select
          className={inputClass("practiceArea")}
          value={form.practiceArea}
          onChange={(e) => setForm({ ...form, practiceArea: e.target.value })}
        >
          <option value="">Select practice area...</option>
          {PRACTICE_AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {errors.practiceArea && <p className="text-red-500 text-xs mt-1">{errors.practiceArea}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {URGENCY_LEVELS.map((u) => (
            <button
              key={u.value}
              onClick={() => setForm({ ...form, urgency: u.value })}
              className={`p-2 rounded-lg border text-center transition-all text-sm ${
                form.urgency === u.value
                  ? u.value === "critical"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : u.value === "high"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : u.value === "medium"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">{u.label}</div>
              <div className="text-xs opacity-75">{u.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Have you worked with an attorney on this matter before?
        </label>
        <div className="flex gap-3">
          {["No", "Yes"].map((v) => (
            <button
              key={v}
              onClick={() => setForm({ ...form, priorAttorney: v })}
              className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                form.priorAttorney === v
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Describe your situation *
        </label>
        <textarea
          className={`${inputClass("description")} min-h-[120px] resize-y`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Please describe the facts of your situation, any relevant dates, parties involved, and what outcome you're hoping for..."
          rows={5}
        />
        <div className="flex justify-between mt-1">
          {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          <p className="text-xs text-gray-400 ml-auto">{form.description.length} characters</p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing case details...
          </span>
        ) : (
          "Submit & Generate AI Assessment"
        )}
      </button>
    </div>
  );
};

const ScoreBadge = ({ score }) => {
  const color = score >= 75 ? "green" : score >= 50 ? "yellow" : "red";
  const colors = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border ${colors[color]}`}>
      {score}/100
    </span>
  );
};

const AssessmentView = ({ intake, onBack }) => {
  const a = intake.assessment;
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to dashboard
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{intake.clientName}</h2>
            <p className="text-sm text-gray-500">{intake.practiceArea} · Submitted {new Date(intake.timestamp).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Viability:</span>
            <ScoreBadge score={a.viabilityScore} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-4 border-b border-gray-100">
          <span>{intake.email}</span>
          {intake.phone && <span>{intake.phone}</span>}
          <span>Contact: {intake.preferredContact}</span>
          <span>Prior Attorney: {intake.priorAttorney}</span>
          <span className={`font-medium ${
            intake.urgency === "critical" ? "text-red-600" :
            intake.urgency === "high" ? "text-orange-600" :
            intake.urgency === "medium" ? "text-yellow-600" : "text-green-600"
          }`}>
            Urgency: {intake.urgency.charAt(0).toUpperCase() + intake.urgency.slice(1)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Client Statement</h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{intake.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">AI Case Assessment</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{a.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Issues Identified</h3>
          <ul className="space-y-2">
            {a.keyIssues.map((issue, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-orange-500 mt-0.5 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended Next Steps</h3>
          <ol className="space-y-2">
            {a.recommendedActions.map((action, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-blue-500 font-semibold shrink-0 w-5 text-right">{i + 1}.</span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Complexity</p>
            <p className="text-sm font-medium text-gray-900">{a.estimatedComplexity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Conflict Flags</p>
            <p className="text-sm font-medium text-gray-900">
              {a.conflictFlags.length === 0 ? "None detected" : a.conflictFlags.join(", ")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Case Viability</p>
            <p className="text-sm font-medium text-gray-900">{a.viability}</p>
          </div>
        </div>
        {a.practiceNotes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Practice Notes</p>
            <p className="text-sm text-gray-700 italic">{a.practiceNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const IntakeCard = ({ intake, onClick }) => {
  const urgencyColors = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-gray-900 text-sm">{intake.clientName}</h3>
          <p className="text-xs text-gray-500">{intake.practiceArea}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColors[intake.urgency]}`}>
            {intake.urgency}
          </span>
          {intake.assessment && <ScoreBadge score={intake.assessment.viabilityScore} />}
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{intake.description}</p>
      <p className="text-xs text-gray-400 mt-2">{new Date(intake.timestamp).toLocaleDateString()}</p>
    </div>
  );
};

const Dashboard = ({ intakes, onSelect, onNewIntake, stats }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "Total Intakes", value: stats.total, color: "blue" },
        { label: "Strong Cases", value: stats.strong, color: "green" },
        { label: "Needs Review", value: stats.moderate, color: "yellow" },
        { label: "High Urgency", value: stats.highUrgency, color: "red" },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-gray-900">Recent Intakes</h2>
      <button
        onClick={onNewIntake}
        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        + New Intake
      </button>
    </div>

    {intakes.length === 0 ? (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-sm">No intakes yet. Click "New Intake" to get started.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {intakes.map((intake) => (
          <IntakeCard key={intake.id} intake={intake} onClick={() => onSelect(intake)} />
        ))}
      </div>
    )}
  </div>
);

export default function LegalFlowApp() {
  const [view, setView] = useState("dashboard");
  const [intakes, setIntakes] = useState(SAMPLE_INTAKES);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const stats = {
    total: intakes.length,
    strong: intakes.filter((i) => i.assessment && i.assessment.viabilityScore >= 70).length,
    moderate: intakes.filter((i) => i.assessment && i.assessment.viabilityScore < 70 && i.assessment.viabilityScore >= 40).length,
    highUrgency: intakes.filter((i) => i.urgency === "high" || i.urgency === "critical").length,
  };

  const handleSubmit = useCallback(async (form) => {
    setIsSubmitting(true);
    setApiError(null);

    const prompt = `You are a legal intake AI assistant for a law firm. Analyze the following client intake and produce a structured case assessment. Respond ONLY with valid JSON, no markdown, no backticks, no preamble.

Client Information:
- Name: ${form.clientName}
- Practice Area: ${form.practiceArea}
- Urgency: ${form.urgency}
- Prior Attorney: ${form.priorAttorney}
- Situation: ${form.description}

Respond with this exact JSON structure:
{
  "viability": "Strong" or "Moderate" or "Weak",
  "viabilityScore": number between 0-100,
  "summary": "2-3 sentence overall assessment",
  "keyIssues": ["issue1", "issue2", "issue3", "issue4", "issue5"],
  "recommendedActions": ["action1", "action2", "action3", "action4", "action5"],
  "estimatedComplexity": "Low" or "Moderate" or "High",
  "conflictFlags": [],
  "practiceNotes": "1-2 sentence note for the attorney"
}`;

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      const clean = text.replace(/```json|```/g, "").trim();
      const assessment = JSON.parse(clean);

      const newIntake = {
        ...form,
        id: `intake-${Date.now()}`,
        timestamp: new Date().toISOString(),
        assessment,
      };

      setIntakes((prev) => [newIntake, ...prev]);
      setSelectedIntake(newIntake);
      setView("detail");
    } catch (err) {
      console.error("API error:", err);
      setApiError("Failed to generate assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setView("dashboard"); setSelectedIntake(null); }}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">LegalFlow</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">AI</span>
          </div>
          <div className="flex items-center gap-3">
            {view !== "dashboard" && (
              <button
                onClick={() => { setView("dashboard"); setSelectedIntake(null); }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </button>
            )}
            {view !== "form" && (
              <button
                onClick={() => { setView("form"); setSelectedIntake(null); }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + New Intake
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {view === "dashboard" && (
          <Dashboard
            intakes={intakes}
            stats={stats}
            onSelect={(intake) => { setSelectedIntake(intake); setView("detail"); }}
            onNewIntake={() => setView("form")}
          />
        )}

        {view === "form" && (
          <div>
            <div className="mb-5">
              <h1 className="text-lg font-semibold text-gray-900">New Client Intake</h1>
              <p className="text-sm text-gray-500">Collect client details and generate an AI-powered case assessment.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <IntakeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              {apiError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {apiError}
                </div>
              )}
            </div>
          </div>
        )}

        {view === "detail" && selectedIntake && (
          <AssessmentView
            intake={selectedIntake}
            onBack={() => { setView("dashboard"); setSelectedIntake(null); }}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          LegalFlow AI · Built by Ayoub Rammo · AI-powered case assessment for modern law firms
        </div>
      </footer>
    </div>
  );
}