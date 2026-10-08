package com.careercraft.tools;

import com.careercraft.service.MlClient;
import org.springframework.stereotype.Component;

/**
 * Resume vs job description match, powered by the Python ML service (TF-IDF + Linear SVM).
 *
 * Accepts the input in either form:
 *  1. resume text, then a line "=====JOB DESCRIPTION=====", then the job description
 *  2. the wrapper the frontend already builds when a Target JD is set:
 *     "[TARGET JOB DESCRIPTION]:\n<jd>\n\n[USER INPUT]:\n<resume>"
 */
@Component
public class ResumeMatcher implements CareerTool {

    static final String SPLIT = "=====JOB DESCRIPTION=====";
    private static final String TARGET_TAG = "[TARGET JOB DESCRIPTION]:";
    private static final String USER_TAG = "[USER INPUT]:";

    private final MlClient ml;

    public ResumeMatcher(MlClient ml) {
        this.ml = ml;
    }

    @Override public String getId() { return "resume-matcher"; }
    @Override public String getDisplayName() { return "Resume Match Score"; }

    @Override
    public String run(String input) {
        String resume = null;
        String jd = null;

        if (input.startsWith(TARGET_TAG) && input.contains(USER_TAG)) {
            int u = input.indexOf(USER_TAG);
            jd = input.substring(TARGET_TAG.length(), u).trim();
            resume = input.substring(u + USER_TAG.length()).trim();
        } else if (input.contains(SPLIT)) {
            String[] parts = input.split(SPLIT, 2);
            resume = parts[0].trim();
            jd = parts[1].trim();
        }

        if (resume == null || jd == null || resume.isEmpty() || jd.isEmpty()) {
            return "{\"error\":\"Paste your resume, then a line with " + SPLIT
                    + ", then the job description. Or set a Target JD above and paste only your resume.\"}";
        }
        return ml.match(resume, jd);
    }
}
