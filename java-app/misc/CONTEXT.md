# CONTEXT.md: CareerCraft AI

Facts the website should be built from. Everything here comes from the project owner's answers, the source deck, and the course syllabus. Items marked **(later)** are deliberately deferred.

## 1. What the site is

- **Name:** CareerCraft AI
- **Type:** A Java web application, built from scratch, with a public website and a live demo.
- **Concept:** One unified career assistant that replaces the 5+ separate tools job seekers jump between to decode job descriptions, rewrite resumes, optimize LinkedIn, and prep for interviews.
- **Problem it addresses:** The job market is fragmented, which causes "tool fatigue".
- **Goal:** Give job seekers high-fidelity, application-ready career assets in seconds.
- **Tagline from the source deck:** Career prep grounded in strategy, not guesswork.
- **Concept source:** The idea comes from a Google Cloud Gen AI Academy (APAC Edition) deck by **Manasvi Sawant**. Credit her as the concept's source on the site. The original deck described a Python/Google ADK/Gemini agent on Cloud Run. That implementation is **not** being reused; this site is a fresh Java build.

## 2. Who it serves

- **Primary audience:** Job seekers who would use CareerCraft AI.

## 3. What the site must contain

### 3.1 Live demo
- A demo area where visitors try the tools using **example prompts**.

### 3.2 The five tools
| Tool | What it does |
|---|---|
| JD Decoder | Identifies hidden "red flags" and maps must-have technical skills from messy job postings. |
| Resume Enhancer | Uses action-verb injection and the "XYZ Formula" (accomplished X, as measured by Y, by doing Z) to strengthen resume bullets. |
| LinkedIn Builder | Generates SEO-optimized headlines to increase recruiter "InMail" hits. |
| Culture Analyzer | Analyzes company values to suggest "Reverse Interviewing" questions. For now it works from company values the visitor pastes in. Live scraping of company sites is **(later)**. |
| Interview Simulator | Categorizes interview questions into "Behavioral", "Technical", and "Case-based" rounds. |

### 3.3 Accounts and history
- User **signup and login**.
- Each user's requests and results are **saved in the database** as a viewable history.

## 4. What a visitor should do

- Try any of the five tools through the example prompts and get a result.
- Create an account so their history is saved.

## 5. How the intelligence works

- The tools run on **rule-based Java logic** (keyword matching, templates, structured output). No external AI service is required.
- A Gemini integration is an optional enhancement **(later)**.
- The original deck's flow was: user query, then tool selection, then structured output, then a formatted final response. The Java version keeps that idea, with a REST endpoint taking a request, routing it to the right tool, and returning a structured result.

## 6. Technical stack

| Layer | Choice |
|---|---|
| Language | Java |
| Backend | Spring Boot with a REST API returning JSON |
| Persistence | Hibernate (JPA) |
| Database | MySQL |
| Front end | Plain HTML, CSS, and JavaScript calling the REST API |
| API testing | Postman |
| Delivery | Deployed online to a free cloud host with a public link |

## 7. Course constraints (this is a lab mini project)

- Course: **PEC-322 (A) ETC: Advanced Java Programming Lab**, Savitribai Phule Pune University, Third Year Electronics and Telecommunication Engineering (2024 Course).
- Scheme: 2 hours/week practical, 1 credit, 50 marks term work.
- Format: any 9 of 15 listed experiments plus a **compulsory Mini Project**. This app is the mini project.
- Stack must fit the syllabus topics: Collections, Servlets, JSP, JDBC, Hibernate (HQL and annotation-based mapping), Spring Boot, REST APIs with JSON.
- Syllabus experiments the app naturally covers:
  - Exp 10: JDBC insert, update, delete, display
  - Exp 11: HQL queries for data retrieval
  - Exp 12: Annotation-based management system
  - Exp 13: Spring Boot app run with Maven
  - Exp 14: REST API with Spring Boot, tested in Postman
  - Exp 15: Spring Boot app with REST API and JSON responses
- Course outcome targeted: CO3, designing and implementing RESTful and full-stack Java applications using Spring Boot and database integration.

## 8. Status

- Nothing is built or deployed yet; the project starts from scratch.
- No existing endpoint, repository, or domain is available to reuse.
