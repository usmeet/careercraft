package com.careercraft.dto;

import jakarta.validation.constraints.NotBlank;

public class ToolRequest {

    @NotBlank(message = "Tool name is required")
    private String tool;

    @NotBlank(message = "Input text is required")
    private String input;

    public String getTool() { return tool; }
    public void setTool(String tool) { this.tool = tool; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }
}
