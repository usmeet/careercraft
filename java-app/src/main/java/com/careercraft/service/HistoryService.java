package com.careercraft.service;

import com.careercraft.dto.HistoryEntryDto;
import com.careercraft.model.HistoryEntry;
import com.careercraft.model.User;
import com.careercraft.repository.HistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final HistoryRepository historyRepository;

    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public HistoryEntry save(User user, String toolName, String inputText, String resultText) {
        HistoryEntry entry = new HistoryEntry(user, toolName, inputText, resultText);
        return historyRepository.save(entry);
    }

    public List<HistoryEntryDto> getHistoryForUser(Long userId) {
        return historyRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(e -> new HistoryEntryDto(
                        e.getId(),
                        e.getToolName(),
                        e.getInputText(),
                        e.getResultText(),
                        e.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public boolean deleteEntry(Long entryId, Long userId) {
        return historyRepository.findById(entryId)
                .filter(e -> e.getUser().getId().equals(userId))
                .map(e -> {
                    historyRepository.delete(e);
                    return true;
                }).orElse(false);
    }
}
