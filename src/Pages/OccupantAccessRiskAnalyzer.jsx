import { useMemo, useState } from "react";
import { Checkbox } from "../Components/SharedComponents";
import AiChatInterface from "../Components/AiChatInterface";

const riskBands = [
  {
    min: 6,
    max: 9,
    label: "Low Friction",
    description:
      "Access is under control. Vendors can mobilize on standard timelines.",
    cta: "Maintain cadence",
    delays: ["Minimal delays expected"],
  },
  {
    min: 10,
    max: 13,
    label: "Managed Tension",
    description: "Some cooperation gaps exist. Expect moderate rescheduling.",
    cta: "Escalate communications",
    delays: [
      "Referee valuation may take longer",
      "Vendor access could be delayed",
      "Photography and showings may be impacted",
    ],
  },
  {
    min: 14,
    max: 18,
    label: "High Risk",
    description: "Occupant or access issues could stall the probate sale.",
    cta: "Activate contingency plan",
    delays: [
      "Referee valuation delays",
      "Vendor access problems",
      "Photography restrictions",
      "Pre-sale prep challenges",
      "Buyer showing difficulties",
    ],
  },
];

const questions = [
  {
    id: "vacant",
    question: "Is the property vacant or occupied?",
    category: "Occupancy",
    options: [
      {
        text: "Vacant",
        points: 1,
        insight: "Vacant homes enable immediate vendor access.",
      },
      {
        text: "Occupied by cooperative family/friends",
        points: 2,
        insight: "Track commitments in writing to preserve cooperation.",
      },
      {
        text: "Occupied by uncooperative occupants",
        points: 3,
        insight: "Engage counsel to formalize notices and expectations.",
      },
    ],
  },
  {
    id: "keys",
    question: "Do you have keys to the property?",
    category: "Access",
    options: [
      {
        text: "Yes, all keys available",
        points: 1,
        insight: "Log key transfers and store spares in a lockbox.",
      },
      {
        text: "Some keys available, others missing",
        points: 2,
        insight: "Schedule a locksmith and document restricted areas.",
      },
      {
        text: "No keys available",
        points: 3,
        insight: "Coordinate legal entry authority with counsel immediately.",
      },
    ],
  },
  {
    id: "cooperation",
    question: "What is the occupant cooperation level?",
    category: "Engagement",
    options: [
      {
        text: "Fully cooperative",
        points: 1,
        insight: "Keep weekly touchpoints to cement trust.",
      },
      {
        text: "Somewhat cooperative",
        points: 2,
        insight: "Provide written schedules and confirm receipt.",
      },
      {
        text: "Uncooperative or hostile",
        points: 3,
        insight: "Use attorney-led communication only.",
      },
    ],
  },
  {
    id: "condition",
    question: "What is the interior condition?",
    category: "Readiness",
    options: [
      {
        text: "Clean and well-maintained",
        points: 1,
        insight: "Prioritize photography and disclosures.",
      },
      {
        text: "Average condition",
        points: 2,
        insight: "Budget extra prep days for staging.",
      },
      {
        text: "Poor condition, needs significant work",
        points: 3,
        insight: "Sequence remediation vendors before marketing.",
      },
    ],
  },
  {
    id: "conflict",
    question: "Is there heir/family conflict?",
    category: "Alignment",
    options: [
      {
        text: "No conflict",
        points: 1,
        insight: "Share milestone updates bi-weekly to stay aligned.",
      },
      {
        text: "Minor disagreements",
        points: 2,
        insight: "Clarify decision rights and document consensus.",
      },
      {
        text: "Major conflict or disputes",
        points: 3,
        insight: "Use mediator or attorney to avoid escalation.",
      },
    ],
  },
  {
    id: "security",
    question: "Are there security concerns?",
    category: "Security",
    options: [
      {
        text: "No security issues",
        points: 1,
        insight: "Continue property checks twice weekly.",
      },
      {
        text: "Minor security concerns",
        points: 2,
        insight: "Install temporary cameras or sensors.",
      },
      {
        text: "Significant security risks",
        points: 3,
        insight: "Engage security patrol until access stabilizes.",
      },
    ],
  },
];

const OccupantAccessRiskAnalyzer = () => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleAnswer = (questionId, optionIndex, checked) => {
    setAnswers((prev) => {
      if (checked) {
        return { ...prev, [questionId]: optionIndex };
      }
      if (prev[questionId] === optionIndex) {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      }
      return prev;
    });
  };

  const totalPossible = questions.length * 3;
  const answeredCount = Object.keys(answers).length;

  const categoryHealth = useMemo(() => {
    return questions.reduce((acc, question) => {
      const idx = answers[question.id];
      const points =
        idx === undefined ? 0 : (question.options[idx]?.points ?? 0);
      if (!acc[question.category]) {
        acc[question.category] = { total: 0, count: 0 };
      }
      acc[question.category].total += points;
      acc[question.category].count += 1;
      return acc;
    }, {});
  }, [answers]);

  const deriveBand = (score) =>
    riskBands.find((band) => score >= band.min && score <= band.max) ||
    riskBands[0];

  const calculateRisk = () => {
    const totalPoints = questions.reduce((sum, question) => {
      const idx = answers[question.id];
      if (idx === undefined) return sum;
      return sum + (question.options[idx]?.points || 0);
    }, 0);
    const band = deriveBand(totalPoints || riskBands[0].min);
    const scorePercent = Math.round((totalPoints / totalPossible) * 100);
    const frictionDrivers = questions
      .filter((question) => {
        const idx = answers[question.id];
        if (idx === undefined) return false;
        return (question.options[idx]?.points || 0) >= 3;
      })
      .map((question) => question.question);
    const watchList = questions
      .filter((question) => {
        const idx = answers[question.id];
        if (idx === undefined) return false;
        return (question.options[idx]?.points || 0) === 2;
      })
      .map((question) => question.question);
    const insightPills = {
      frictionDrivers,
      watchList,
    };

    const communicationPlan = [
      "Document every access granted (time, purpose, contact).",
      "Issue a weekly readiness summary to heirs and occupants.",
      "Align with counsel before delivering any notices or lock changes.",
    ];

    setResults({
      totalPoints,
      band,
      scorePercent,
      insightPills,
      communicationPlan,
      categoryHealth,
    });
  };

  const resetAnalyzer = () => {
    setAnswers({});
    setResults(null);
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                Occupant Command Deck
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1">
                Occupant Access Risk Analyzer
              </h1>
              <p className="text-sm sm:text-base md:text-lg mt-3 max-w-3xl text-white/90">
                Quantify friction from occupants, keys, and coordination so you
                can stage the property with confidence.
              </p>
            </div>
            <div className="bg-white/15 rounded-lg px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                Responses Captured
              </p>
              <p className="text-4xl font-black mt-1">
                {answeredCount}/{questions.length}
              </p>
              <p className="text-xs mt-2 text-white/80">
                Complete all scenarios to unlock live guidance
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0097A7]/10 border border-[#0097A7]/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0097A7]">
                Risk Tier
              </p>
              <p className="text-3xl font-black text-[#0097A7] mt-2">
                {results ? results.band.label : "Awaiting Data"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {results
                  ? results.band.description
                  : "Answer each lever to determine your access posture."}
              </p>
            </div>
            <div className="bg-[#FD7702]/10 border border-[#FD7702]/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FD7702]">
                Friction Score
              </p>
              <p className="text-3xl font-black text-[#FD7702] mt-2">
                {results ? `${results.scorePercent}%` : "--"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Higher percentages indicate more schedule disruption.
              </p>
            </div>
            <div className="bg-[#007A87]/10 border border-[#007A87]/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#007A87]">
                Next Move
              </p>
              <p className="text-lg font-bold text-[#007A87] mt-2">
                {results ? results.band.cta : "Complete questionnaire"}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {results
                  ? `Top delay drivers: ${results.insightPills.frictionDrivers.length || 0}`
                  : "Guidance unlocks when all responses are captured."}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 className="text-xl font-bold text-[#0097A7]">
                Risk Assessment Questions
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetAnalyzer}
                  className="px-4 py-2 text-sm font-semibold border border-[#0097A7]/40 text-[#0097A7] rounded-md hover:border-[#0097A7]"
                >
                  Reset Analyzer
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
                  Activate Insights
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-gray-50 border border-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Checkpoint {index + 1} · {q.category}
                      </p>
                      <h3 className="font-semibold text-[#0097A7] text-base sm:text-lg">
                        {q.question}
                      </h3>
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      {answers[q.id] !== undefined
                        ? q.options[answers[q.id]].text
                        : "Pending"}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="w-full">
                        <Checkbox
                          name={`${q.id}-${optionIndex}`}
                          label={option.text}
                          checked={answers[q.id] === optionIndex}
                          onChange={(e) =>
                            handleAnswer(q.id, optionIndex, e.target.checked)
                          }
                          containerClass="text-gray-700 text-sm sm:text-base leading-relaxed break-words"
                          width="full"
                        />
                        <p className="text-xs text-gray-500 ml-10">
                          {option.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {results && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                      Access Tier
                    </p>
                    <h2 className="text-3xl font-black text-[#0097A7]">
                      {results.band.label}
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      {results.band.description}
                    </p>
                  </div>
                  <div className="bg-white border border-[#0097A7]/30 rounded-lg p-4 text-center min-w-[220px]">
                    <p className="text-xs uppercase text-[#0097A7] tracking-[0.2em]">
                      Friction Score
                    </p>
                    <p className="text-5xl font-black text-[#0097A7]">
                      {results.totalPoints} / {totalPossible}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Lower scores indicate smoother access operations
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0097A7] mb-3">
                    Delay Intelligence
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Potential delays based on current tier:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {results.band.delays.map((delay, index) => (
                      <li key={index}>{delay}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#0097A7] mb-3">
                    Communication Playbook
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {results.communicationPlan.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0097A7] mb-4">
                  Risk Drivers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#FD7702]">
                      Critical Drivers
                    </p>
                    {results.insightPills.frictionDrivers.length ? (
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                        {results.insightPills.frictionDrivers.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">
                        No critical drivers flagged.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#007A87]">
                      Watch List
                    </p>
                    {results.insightPills.watchList.length ? (
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                        {results.insightPills.watchList.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">
                        No watch items currently.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-[#0097A7] uppercase tracking-wide mb-2">
                    Capability Tracker
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(categoryHealth).map(([category, data]) => {
                      const percent =
                        100 - Math.round((data.total / (data.count * 3)) * 100);
                      return (
                        <div
                          key={category}
                          className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                        >
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {category}
                          </p>
                          <p className="text-2xl font-bold text-[#0097A7]">
                            {percent}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Stability rating
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <AiChatInterface
                contextData={results}
                contextLabel="Occupant Access Risk Analysis"
              />

              <p className="text-center text-xs text-gray-500 italic">
                Disclaimer: Coordinate with your attorney for legal access
                direction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OccupantAccessRiskAnalyzer;
