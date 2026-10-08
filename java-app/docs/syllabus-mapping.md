# CareerCraft AI — Syllabus Mapping

This project fulfills the requirements of the **Advanced Java Programming Lab** course. Specifically, it covers **Experiments 10 through 15**, serving as the final mini-project.

| Experiment | Topic | How CareerCraft AI covers it |
| :--- | :--- | :--- |
| **Exp 10** | Spring Boot & Spring MVC | The backend is built entirely on Spring Boot 3.2. Controllers (`ToolController`, `AuthController`) handle the REST endpoints mapping. |
| **Exp 11** | Spring Data JPA (HQL) | `HistoryRepository` extends `JpaRepository` and contains a custom HQL query to retrieve a user's ordered history. |
| **Exp 12** | Database Integration | MySQL (for production) and H2 (for local dev) are integrated using JDBC/Hibernate. `schema.sql` dictates the structure. |
| **Exp 13** | Session Management | `GuestLimitService` tracks unauthenticated user tries via `HttpSession`. `AuthController` stores logged-in user credentials in the session. |
| **Exp 14** | RESTful Services | All data between the frontend and backend is exchanged via REST endpoints (`/api/tool/run`, `/api/auth/login`, etc.) returning JSON (via Jackson). |
| **Exp 15** | Mini-Project | This constitutes a complete, deployable Java web application solving a real-world problem (job search tool fragmentation). |
