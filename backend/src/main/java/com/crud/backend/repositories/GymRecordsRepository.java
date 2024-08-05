package com.crud.backend.repositories;

import com.crud.backend.entities.GymRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymRecordsRepository extends JpaRepository<GymRecord, Long> {
    Page<GymRecord> findAll(Pageable pageable);
    Page<GymRecord> findByExerciseContainingIgnoreCase(String query, Pageable pageable);
}
