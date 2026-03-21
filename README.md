# Plan4U — AI Clarity & Structuring Tool

> Transform messy ideas into clear, actionable plans with AI-powered analysis

![Plan4U](https://img.shields.io/badge/AI-Powered-purple) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 🎯 Project Overview

**Plan4U** is a web application that helps users turn vague, unstructured ideas into clear, actionable plans. Instead of a simple text input, the app uses an innovative **chatbot quiz interface** that asks targeted clarifying questions to extract context before generating comprehensive analysis.

### The Problem

Individuals often have ideas or plans that are vague, unstructured, and incomplete — leading to poor execution and decision-making.

### The Solution

Plan4U provides:
- **Structured breakdown** of any idea (Goal, Method, Steps, Timeline)
- **Missing elements detection** with severity indicators
- **Actionable next steps** with priorities
- **Clarity score** (0-100) with transparent scoring logic
- **Before vs After comparison** to visualize improvement

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 **Chatbot Quiz** | AI asks 5 targeted questions to understand your idea better |
| 📊 **Structured Analysis** | Breaks down your idea into Goal, Method, Steps, Timeline |
| ⚠️ **Gap Detection** | Identifies missing elements with High/Medium/Low severity |
| ✅ **Action Steps** | Provides prioritized, practical next steps |
| 📈 **Clarity Score** | 0-100 score with 4-category breakdown |
| 🔄 **Iteration** | Modify and re-run to improve your plan |
| 📚 **History** | View all your past analyses (stored in MongoDB) |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Challasujanreddy@gmail.com/plan4u.git
   cd plan4u
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=plan4u
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel Dashboard:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`
   - `MONGODB_DB`
4. Deploy!

---

## 🧠 Prompt Design Explanation

### Quiz Generation Prompt

The quiz prompt is designed to:
1. **Analyze the raw idea** for existing clarity
2. **Generate exactly 5 targeted questions** covering:
   - Goal specificity
   - Method/approach
   - Concrete steps
   - Timeline expectations
   - Required resources
3. **Adapt questions** based on what's already clear vs missing

```
You are an expert plan clarity coach. Your job is to ask exactly 5 targeted 
clarifying questions that will help extract the missing information from 
a user's vague plan.

Categories covered:
- Goal: What specifically do you want to achieve?
- Method: How do you plan to approach this?
- Steps: What concrete actions will you take?
- Timeline: When do you want to achieve this?
- Resources: What do you need to make this happen?
```

### Analysis Prompt

The analysis prompt structures output into:
1. **Structured Plan** — Extracted goal, method, steps, timeline
2. **Missing Elements** — Gaps with severity (high/medium/low)
3. **Simplified Version** — Concise 2-3 sentence restatement
4. **Action Steps** — 5-7 prioritized next actions
5. **Clarity Score** — Calculated breakdown across 4 categories

---

## 📊 Clarity Score Logic

The clarity score (0-100) is calculated across **4 equal categories** (25 points each):

| Category | Max Points | Scoring Criteria |
|----------|------------|------------------|
| **Goal Clarity** | 25 | Is there a specific, measurable goal? |
| **Steps Definition** | 25 | Are there concrete, actionable steps? |
| **Timeline** | 25 | Is there a realistic timeframe? |
| **Completeness** | 25 | Are resources, constraints, and context addressed? |

### Scoring Rubric

- **0-25**: Very vague — major gaps in most areas
- **26-50**: Somewhat unclear — several important elements missing
- **51-75**: Moderately clear — has structure but needs refinement
- **76-100**: Very clear — well-defined, actionable plan

The AI evaluates each category based on:
- Presence of specific details
- Measurability of outcomes
- Actionability of steps
- Realism of timeline

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  Landing → IdeaInput → QuizChat → Analysis Dashboard    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTIONS                 │
│  /api/quiz     → Generate 5 quiz questions              │
│  /api/analyze  → Full analysis + save to DB             │
│  /api/history  → Fetch past analyses                    │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │  GEMINI API   │         │   MONGODB     │
      │  (AI Engine)  │         │  (Storage)    │
      └───────────────┘         └───────────────┘
```

---

## 📁 Project Structure

```
plan4u/
├── api/                      # Vercel Serverless Functions
│   ├── lib/
│   │   ├── gemini.ts         # Gemini AI configuration
│   │   └── mongodb.ts        # MongoDB connection
│   ├── quiz.ts               # Quiz generation endpoint
│   ├── analyze.ts            # Analysis endpoint
│   └── history.ts            # History endpoint
│
├── src/                      # React Frontend
│   ├── components/
│   │   ├── Landing.tsx       # Hero landing page
│   │   ├── IdeaInput.tsx     # Idea input form
│   │   ├── QuizChat.tsx      # Chatbot quiz interface
│   │   ├── AnalyzingScreen.tsx
│   │   ├── AnalysisDashboard.tsx
│   │   ├── ClarityScore.tsx
│   │   └── History.tsx
│   ├── services/
│   │   └── api.ts            # API client
│   ├── types.ts              # TypeScript interfaces
│   └── App.tsx               # Main app component
│
├── vercel.json               # Vercel configuration
├── .env.example              # Environment template
└── README.md                 # This file
```

---

## 📝 Challenges & Approach

### Challenges Faced

1. **Extracting structured data from AI** — LLMs can be unpredictable. Solved by using strict JSON schema instructions and fallback parsing.

2. **Making the quiz feel natural** — Instead of dumping 5 questions at once, implemented a conversational flow with typing indicators and encouragements.

3. **Balancing detail vs. overwhelm** — The analysis output needed to be comprehensive but not intimidating. Used cards, collapsible sections, and visual hierarchy.

### AI Prompting Approach

- **Explicit structure**: Every prompt specifies exact JSON output format
- **Role assignment**: "You are an expert plan clarity coach..."
- **Category constraints**: Questions must cover specific categories
- **Fallback handling**: If AI returns malformed JSON, use regex extraction
- **Context accumulation**: Quiz answers are passed to analysis prompt for full context

---

## 🎨 Design Decisions

1. **Dark theme** — Reduces eye strain, feels modern and professional
2. **Chatbot interface** — More engaging than a simple form; naturally surfaces missing info
3. **Animated clarity score** — Visual feedback makes the score feel rewarding
4. **Severity badges** — Color-coded (red/yellow/green) for quick scanning
5. **Before/After comparison** — Shows tangible value of the tool

---

## 📄 License

MIT License — Feel free to use and modify.

---

Built with ❤️ for the KALNET Intern Assignment
