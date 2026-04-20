import { useState, useMemo } from "react";
import { RadioGroup } from "../Components/SharedComponents";
import AiChatInterface from "../Components/AiChatInterface";

const riskProfiles = [
  {
    range: [0, 3],
    label: "Low Risk",
    description: "Controls appear strong and vacancy exposure is limited.",
    cta: "Maintain monitoring cadence",
  },
  {
    range: [4, 6],
    label: "Moderate Risk",
    description: "Several controls need attention to avoid claim challenges.",
    cta: "Brief insurance advisor",
  },
  {
    range: [7, 12],
    label: "High Risk",
    description: "Vacancy gaps could trigger exclusions or denied claims.",
    cta: "Secure vacancy coverage now",
  },
];

const categoryMap = {
  vacancy: ["vacant", "utilities", "water"],
  security: ["secure", "locks", "yard"],
};

const questions = [
  {
    id: "vacant",
    question: "Has the property been vacant for more than 30 days?",
    category: "vacancy",
    context:
      "Most carriers downgrade coverage after 30 days without occupancy notice.",
  },
  {
    id: "utilities",
    question: "Are utilities turned on?",
    category: "vacancy",
    context:
      "Climate control protects plumbing and electrical systems from loss.",
  },
  {
    id: "secure",
    question: "Are doors and windows secure?",
    category: "security",
    context:
      "Insurers expect documented security to mitigate vandalism exposure.",
  },
  {
    id: "yard",
    question: "Is the yard maintained?",
    category: "security",
    context: "Visible neglect invites trespassers and accelerates citations.",
  },
  {
    id: "water",
    question: "Has water been shut off?",
    category: "vacancy",
    context:
      "If left pressurized, burst lines are frequently denied without inspections.",
  },
  {
    id: "locks",
    question: "Have locks been changed?",
    category: "security",
    context:
      "Changing locks establishes control over access logs post-transition.",
  },
];

const ProbatePropertyInsuranceRiskChecker = () => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const maxPoints = questions.length * 2;

  const categoryScores = useMemo(() => {
    return Object.entries(categoryMap).map(([category, ids]) => {
      const penalties = ids.reduce((sum, id) => {
        if (answers[id] === "no") return sum + 2;
        if (answers[id] === "unsure") return sum + 1;
        return sum;
      }, 0);
      const percent = Math.max(
        0,
        100 - Math.round((penalties / (ids.length * 2)) * 100),
      );
      return {
        category,
        label:
          category === "vacancy" ? "Vacancy Controls" : "Security Controls",
        percent,
        status:
          percent >= 80
            ? "On Track"
            : percent >= 50
              ? "Monitor"
              : "High Attention",
      };
    });
  }, [answers]);

  const deriveProfile = (score) =>
    riskProfiles.find(
      (profile) => score >= profile.range[0] && score <= profile.range[1],
    ) || riskProfiles[0];

  const calculateRisk = () => {
    const totalPoints = Object.values(answers).reduce((sum, answer) => {
      if (answer === "no") return sum + 2;
      if (answer === "unsure") return sum + 1;
      return sum;
    }, 0);
    const scorePercent = Math.round((totalPoints / maxPoints) * 100);
    const profile = deriveProfile(totalPoints);

    const highAlerts = questions
      .filter((q) => answers[q.id] === "no")
      .map((q) => q.question);
    const watchItems = questions
      .filter((q) => answers[q.id] === "unsure")
      .map((q) => q.question);

    const advisorNotes = [
      "Document vacancy mitigation steps (photos, invoices, inspections).",
      "Notify the carrier in writing when occupancy status changes.",
      "Keep a standing log of whoever accesses the property.",
    ];

    const coverageRecommendation =
      totalPoints <= 3
        ? "Standard coverage appears sufficient; confirm conditions annually."
        : totalPoints <= 6
          ? "Discuss DP-1 or DP-3 vacancy riders to keep claim language clear."
          : "Escalate to an insurance specialist for tailored vacant-property coverage.";

    setResults({
      totalPoints,
      scorePercent,
      profile,
      coverageRecommendation,
      highAlerts,
      watchItems,
      advisorNotes,
      categoryScores,
    });
  };

  const resetForm = () => {
    setAnswers({});
    setResults(null);
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                Insurance Governance
              </p>
              <h1 className="text-2xl md:text-4xl font-extrabold mt-1">
                Probate Property Insurance Risk Checker
              </h1>
              <p className="text-sm md:text-base text-white/90 mt-3 max-w-3xl">
                Surface insurance blind spots before they expose the estate to
                coverage gaps or denied claims.
              </p>
            </div>
            <div className="bg-white/15 rounded-lg px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                Questions Answered
              </p>
              <p className="text-4xl font-black mt-1">
                {Object.keys(answers).length}/{questions.length}
              </p>
              <p className="text-xs mt-2 text-white/80">
                Complete all checkpoints to unlock recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0097A7]/10 border border-[#0097A7]/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0097A7]">
                Status
              </p>
              <p className="text-3xl font-black text-[#0097A7] mt-2">
                {results ? results.profile.label : "Awaiting Data"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {results
                  ? results.profile.description
                  : "Answer each control to see the current disposition."}
              </p>
            </div>
            <div className="bg-[#FD7702]/10 border border-[#FD7702]/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FD7702]">
                Exposure Score
              </p>
              <p className="text-3xl font-black text-[#FD7702] mt-2">
                {results ? `${results.scorePercent}%` : "--"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Higher percentages indicate more underwriting scrutiny.
              </p>
            </div>
            <div className="bg-[#007A87]/10 border border-[#007A87]/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#007A87]">
                Action Cue
              </p>
              <p className="text-lg font-bold text-[#007A87] mt-2">
                {results ? results.profile.cta : "Complete the checklist"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {results
                  ? results.coverageRecommendation
                  : "Guidance unlocks once all answers are captured."}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 className="text-xl font-bold text-[#0097A7]">
                Vacancy Risk Assessment
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-semibold border border-[#0097A7]/40 text-[#0097A7] rounded-md hover:border-[#0097A7]"
                >
                  Clear Responses
                </button>
                <button
                  type="button"
                  onClick={calculateRisk}
                  disabled={!allAnswered}
                  className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 ${
                    allAnswered
                      ? "bg-[#0097A7] text-white hover:bg-[#007A87]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Run Analysis
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Control {index + 1}
                      </p>
                      <h3 className="font-semibold text-[#0097A7] text-base sm:text-lg">
                        {q.question}
                      </h3>
                      <p className="text-xs text-gray-500 max-w-2xl">
                        {q.context}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      {answers[q.id] ? answers[q.id].toUpperCase() : "Pending"}
                    </div>
                  </div>
                  <div className="mt-4">
                    <RadioGroup
                      name={q.id}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      options={[
                        { value: "yes", label: "Yes", color: "teal" },
                        { value: "no", label: "No", color: "orange" },
                        { value: "unsure", label: "Unsure", color: "teal" },
                      ]}
                      direction="horizontal"
                      gap="gap-2 sm:gap-4"
                      distributeWidth
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                      Risk Profile
                    </p>
                    <h2 className="text-3xl font-black text-[#0097A7]">
                      {results.profile.label}
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {results.profile.description}
                    </p>
                  </div>
                  <div className="bg-white border border-[#0097A7]/30 rounded-lg p-4 text-center min-w-[220px]">
                    <p className="text-xs uppercase text-[#0097A7] tracking-[0.2em]">
                      Exposure Index
                    </p>
                    <p className="text-5xl font-black text-[#0097A7]">
                      {results.totalPoints} / {maxPoints}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Points accrue when answers are &quot;No&quot; or
                      &quot;Unsure&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0097A7] mb-3">
                    Action Signals
                  </h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold text-[#FD7702] uppercase tracking-wide text-xs">
                        Critical Alerts
                      </p>
                      {results.highAlerts.length ? (
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {results.highAlerts.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-gray-500">
                          No unresolved critical alerts.
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0097A7] uppercase tracking-wide text-xs">
                        Watch Items
                      </p>
                      {results.watchItems.length ? (
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {results.watchItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-gray-500">
                          No watch items flagged.
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#007A87] uppercase tracking-wide text-xs">
                        Advisor Notes
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {results.advisorNotes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0097A7] mb-3">
                    Control Strength
                  </h3>
                  <div className="space-y-4">
                    {categoryScores.map((score) => (
                      <div key={score.category}>
                        <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
                          <span>{score.label}</span>
                          <span>
                            {score.percent}% · {score.status}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-[#0097A7] to-[#007A87]"
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AiChatInterface
                contextData={results}
                contextLabel="Insurance Risk Assessment"
              />

              <p className="text-center text-xs text-gray-500 italic">
                Disclaimer: This tool is for scenario planning. Always consult a
                licensed insurance professional before binding coverage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProbatePropertyInsuranceRiskChecker;
