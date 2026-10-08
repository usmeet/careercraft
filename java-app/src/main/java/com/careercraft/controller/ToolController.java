package com.careercraft.controller;

import com.careercraft.dto.ToolRequest;
import com.careercraft.dto.ToolResponse;
import com.careercraft.model.User;
import com.careercraft.service.GuestLimitService;
import com.careercraft.service.HistoryService;
import com.careercraft.service.UserService;
import com.careercraft.tools.CareerTool;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tool")
public class ToolController {

    private final List<CareerTool> tools;
    private final GuestLimitService guestLimitService;
    private final HistoryService historyService;
    private final UserService userService;

    public ToolController(List<CareerTool> tools,
                          GuestLimitService guestLimitService,
                          HistoryService historyService,
                          UserService userService) {
        this.tools = tools;
        this.guestLimitService = guestLimitService;
        this.historyService = historyService;
        this.userService = userService;
    }

    /** List available tools. */
    @GetMapping("/list")
    public ResponseEntity<?> listTools() {
        var toolInfo = tools.stream()
                .map(t -> Map.of("id", t.getId(), "name", t.getDisplayName()))
                .toList();
        return ResponseEntity.ok(toolInfo);
    }

    /** Run a tool. */
    @PostMapping("/run")
    public ResponseEntity<?> runTool(@Valid @RequestBody ToolRequest req,
                                      HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        boolean isGuest = (userId == null);

        // Guest limit check
        if (isGuest && guestLimitService.hasReachedLimit(session)) {
            return ResponseEntity.status(403).body(Map.of(
                "error", true,
                "message", "You've used your free tries. Create a free account to keep going. You'll get unlimited use and a private history of your results.",
                "remaining", 0
            ));
        }

        // Input length cap (10,000 characters max)
        if (req.getInput() != null && req.getInput().length() > 10000) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", true,
                "message", "Input text is too long. Please limit to 10,000 characters."
            ));
        }

        // Find the tool
        CareerTool tool = tools.stream()
                .filter(t -> t.getId().equals(req.getTool()))
                .findFirst()
                .orElse(null);

        if (tool == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", true,
                "message", "Unknown tool: " + req.getTool()
            ));
        }

        // Run
        String result = tool.run(req.getInput());

        // Save to history if logged in
        boolean saved = false;
        if (!isGuest) {
            Optional<User> user = userService.findById(userId);
            if (user.isPresent()) {
                historyService.save(user.get(), tool.getDisplayName(), req.getInput(), result);
                saved = true;
            }
        } else {
            guestLimitService.increment(session);
        }

        return ResponseEntity.ok(new ToolResponse(tool.getDisplayName(), result, saved));
    }
}
