package com.careercraft.tools;

/**
 * Common interface for all CareerCraft AI tools.
 * Each tool takes free-text input and returns a structured result string.
 */
public interface CareerTool {

    /** Machine-readable tool identifier (e.g. "jd-decoder"). */
    String getId();

    /** Human-readable tool name (e.g. "JD Decoder"). */
    String getDisplayName();

    /** Run the tool on the given input and return a formatted result. */
    String run(String input);
}
