# CareerCraft AI Backend Implementation Plan

We have successfully built the frontend assets. To complete the "Build further" request, we need to construct the Java Spring Boot backend that powers the tools, authentication, and history tracking.

## User Review Required

> [!IMPORTANT]
> **Open Decisions from DESIGN.md:**
> 1. **Package Name**: I propose keeping `com.careercraft`. Let me know if you want a different one.
> 2. **Cloud Host**: I will create a standard generic `Dockerfile` and `application.properties` suitable for hosts like Render or Railway. 

> [!WARNING]
> **Frontend Location:**
> The `static/` directory we just built needs to be moved to `src/main/resources/static/` so Spring Boot serves it automatically. I will handle this move as part of the execution.

## Proposed Changes

---

### 1. Project Scaffolding
- Set up the standard Maven `pom.xml` for Spring Boot (Web, Data JPA, MySQL Driver).
- Create `README.md` and `Dockerfile`.
- Move the existing `static/` directory into `src/main/resources/static/`.

### 2. Database & Persistence
- Create `sql/schema.sql` defining `users` and `history` tables.
- Create `application.properties` with MySQL connection placeholders.
- Create Hibernate Entities: `User.java`, `HistoryEntry.java` in `com.careercraft.model`.
- Create Spring Data Repositories: `UserRepository.java`, `HistoryRepository.java` in `com.careercraft.repository`.

### 3. Business Logic (The 5 Tools)
- Create JSON rule files in `src/main/resources/data/` (e.g., `action-verbs.json`, `red-flags.json`).
- Implement the `CareerTool` interface and 5 specific tool classes (`JdDecoder`, `ResumeEnhancer`, `LinkedInBuilder`, `CultureAnalyzer`, `InterviewSimulator`) in `com.careercraft.tools`. These will replicate the rule-based logic we mocked in `demo.js`, but securely on the server.

### 4. Services & API Controllers
- Create DTOs (Data Transfer Objects) in `com.careercraft.dto`.
- Create Services: `UserService.java`, `HistoryService.java`, `GuestLimitService.java`.
- Create REST Controllers: `AuthController.java`, `ToolController.java`, `HistoryController.java`.
- Implement simple token-based or session-based authentication in a `config/` package to fulfill the requirement of tracking logged-in users' histories.

### 5. Documentation & Testing
- Create `docs/syllabus-mapping.md` as required by the course constraints.
- Create `postman/careercraft.postman_collection.json` with API tests.

## Verification Plan

### Automated Tests
- Write basic MockMvc unit tests for the controllers to ensure endpoints return 200 OK and correct JSON structures.

### Manual Verification
- Run the Spring Boot application locally (`mvn spring-boot:run`).
- Verify that the frontend can successfully communicate with the backend via the REST API endpoints.
- Test guest limit tracking and authenticated history persistence.
