package com.careercraft.repository;

import com.careercraft.model.HistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<HistoryEntry, Long> {

    /** HQL query for data retrieval — covers syllabus Exp 11. */
    @Query("SELECT h FROM HistoryEntry h WHERE h.user.id = :userId ORDER BY h.createdAt DESC")
    List<HistoryEntry> findByUserIdOrderByCreatedAtDesc(Long userId);
}
