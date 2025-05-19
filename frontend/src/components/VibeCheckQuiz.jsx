import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { io } from "socket.io-client";

// const socket = io("http://localhost:3001");
const socket = io("https://vibequiz.onrender.com/");

const questions = [
  {
    question: "Pick a snack:",
    answers: [
      { text: "Grapes", vibe: "chill" },
      { text: "Takis", vibe: "chaotic" },
      { text: "Leftover chicken", vibe: "feral" },
      { text: "Matcha", vibe: "zen" },
    ],
  },
  {
    question: "Your weekend plan?",
    answers: [
      { text: "Reading a book", vibe: "zen" },
      { text: "Last-minute road trip", vibe: "chaotic" },
      { text: "Video games in bed", vibe: "chill" },
      { text: "No plans. Just vibes.", vibe: "feral" },
    ],
  },
  {
    question: "Pick a vibe anthem:",
    answers: [
      { text: "Lo-fi beats", vibe: "chill" },
      { text: "Death metal", vibe: "feral" },
      { text: "Pop bangers", vibe: "chaotic" },
      { text: "Nature sounds", vibe: "zen" },
    ],
  },
];

const resultDescriptions = {
  chill: {
    title: "You're Chill 😌",
    description: "You keep it low-key and breezy. Everyone loves being around your calming energy.",
  },
  chaotic: {
    title: "You're Chaotic ⚡",
    description: "You bring the storm—and the party. Nobody knows what's coming next (including you).",
  },
  feral: {
    title: "You're Feral 🐾",
    description: "You're a wild card. Instinct over logic. Vibes over rules. We respect it.",
  },
  zen: {
    title: "You're Zen 🌿",
    description: "Balanced. Grounded. Mindful. You probably meditate... or at least think about it.",
  },
};

export default function VibeCheckQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [liveVotes, setLiveVotes] = useState({ chill: 0, chaotic: 0, feral: 0, zen: 0 });

  useEffect(() => {
    socket.on("voteUpdate", (data) => {
      setLiveVotes(data);
    });
    return () => {
      socket.off("voteUpdate");
    };
  }, []);

  function handleAnswer(vibe) {
    const newAnswers = [...answers, vibe];
    if (currentQuestion + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      const topVibe = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
      setResult(topVibe);
      socket.emit("submitVote", topVibe);
    }
  }

  const totalVotes = Object.values(liveVotes).reduce((a, b) => a + b, 0);

  if (result) {
    const { title, description } = resultDescriptions[result];
    return (
      <Card className="max-w-xl mx-auto mt-10 p-6 text-center shadow-2xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-6">{description}</p>

        <h3 className="text-xl font-semibold mb-4">Live Results</h3>
        {Object.entries(liveVotes).map(([vibe, count]) => (
          <div key={vibe} className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{vibe}</span>
              <span>{count} votes</span>
            </div>
            <div className="bg-gray-200 h-3 rounded">
              <div
                className="bg-indigo-500 h-3 rounded"
                style={{ width: `${(count / totalVotes) * 100}%` }}
              />
            </div>
          </div>
        ))}

        <Button className="mt-6" onClick={() => {
          setAnswers([]);
          setCurrentQuestion(0);
          setResult(null);
        }}>Retake Quiz</Button>
      </Card>
    );
  }

  const q = questions[currentQuestion];

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6 shadow-2xl rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
        <div className="grid gap-3">
          {q.answers.map((a, i) => (
            <Button key={i} variant="outline" onClick={() => handleAnswer(a.vibe)}>
              {a.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
