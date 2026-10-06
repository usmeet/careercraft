# CareerCraft AI

CareerCraft AI is an AI career assistant for job seekers. Instead of hopping between tools to decode job postings, rewrite your resume, fix your LinkedIn, and prepare for interviews, you do it all here, and each result is ready to use in an application.

This project was built by Manasvi Sawant for the **Advanced Java Programming Lab** course.

## Tech Stack

*   **Frontend**: HTML5, CSS3 (Custom Design System), Vanilla JS (No frameworks)
*   **Backend**: Java 17, Spring Boot 3.2, Spring MVC, Spring Data JPA
*   **Database**: H2 (In-memory for development), MySQL (For production)

## Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/careercraft-ai.git
    cd careercraft-ai
    ```

2.  **Run with Maven:**
    By default, the application runs using the `dev` profile which uses an in-memory H2 database. You don't need to configure MySQL to run it locally.
    ```bash
    mvn spring-boot:run
    ```

3.  **Access the application:**
    Open your browser and navigate to `http://localhost:8080`.

## Production Deployment

To run with MySQL:

1. Create a MySQL database named `careercraft`.
2. Run the application with the `prod` profile and provide database credentials via environment variables:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=careercraft
export DB_USER=your_user
export DB_PASS=your_password
export SPRING_PROFILES_ACTIVE=prod

mvn spring-boot:run
```

A `Dockerfile` is also included for containerized deployment.

## Project Structure

*   `src/main/java`: Backend source code (Controllers, Services, Models, Tools)
*   `src/main/resources/static`: Frontend HTML, CSS, and JS files
*   `src/main/resources/application.properties`: Configuration files
*   `sql/`: Database schema definitions
*   `docs/`: Syllabus mapping and other documentation
*   `postman/`: API test collection
