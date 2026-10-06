package com.careercraft.dto;

import java.time.LocalDateTime;

public class HistoryEntryDto {

    private Long id;
    private String toolName;
    private String inputText;
    private String resultText;
    private LocalDateTime createdAt;

    public HistoryEntryDto() {}

    public HistoryEntryDto(Long id, String toolName, String inputText,
                           String resultText, LocalDateTime createdAt) {
        this.id = id;
        this.toolName = toolName;
        this.inputText = inputText;
        this.resultText = resultText;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }

    public String getInputText() { return inputText; }
    public void setInputText(String inputText) { this.inputText = inputText; }

    public String getResultText() { return resultText; }
    public void setResultText(String resultText) { this.resultText = resultText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
