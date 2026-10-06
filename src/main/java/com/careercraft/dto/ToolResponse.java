package com.careercraft.dto;

public class ToolResponse {

    private String tool;
    private String result;
    private boolean saved;

    public ToolResponse() {}

    public ToolResponse(String tool, String result, boolean saved) {
        this.tool = tool;
        this.result = result;
        this.saved = saved;
    }

    public String getTool() { return tool; }
    public void setTool(String tool) { this.tool = tool; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public boolean isSaved() { return saved; }
    public void setSaved(boolean saved) { this.saved = saved; }
}
