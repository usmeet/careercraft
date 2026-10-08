package com.careercraft.controller;

import com.careercraft.dto.HistoryEntryDto;
import com.careercraft.service.HistoryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<?> getHistory(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", true,
                "message", "You must be logged in to view your history."
            ));
        }
        List<HistoryEntryDto> entries = historyService.getHistoryForUser(userId);
        return ResponseEntity.ok(entries);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHistory(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", true,
                "message", "You must be logged in."
            ));
        }
        boolean deleted = historyService.deleteEntry(id, userId);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "History entry deleted"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", true, "message", "Entry not found"));
        }
    }
}
