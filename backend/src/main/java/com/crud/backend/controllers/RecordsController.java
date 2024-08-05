package com.crud.backend.controllers;

import com.crud.backend.dtos.GymRecordDto;
import com.crud.backend.services.RecordsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/gym")
@RequiredArgsConstructor
public class RecordsController {

    private final RecordsService recordsService;

    @GetMapping("/records")
    public ResponseEntity<List<GymRecordDto>> allRecords() {
        return ResponseEntity.ok(recordsService.allRecords());
    }

    @GetMapping("/records/page")
    public ResponseEntity<Page<GymRecordDto>> getRecordsPage(@RequestParam int page, @RequestParam int size) {
        Page<GymRecordDto> recordsPage = recordsService.getRecordsPage(page, size);
        return ResponseEntity.ok(recordsPage);
    }

    @GetMapping("/records/search")
    public ResponseEntity<Page<GymRecordDto>> searchRecords(
            @RequestParam String query,
            @RequestParam int page,
            @RequestParam int size) {
        Page<GymRecordDto> recordsPage = recordsService.searchRecords(query, page, size);
        return ResponseEntity.ok(recordsPage);
    }

    @PostMapping("/records")
    public ResponseEntity<GymRecordDto> createGymRecord(@Valid @RequestBody GymRecordDto recordDto) {
        GymRecordDto createdRecord = recordsService.createGymRecords(recordDto);
        return ResponseEntity.created(URI.create("/gym/records/" + recordDto.getId())).body(createdRecord);
    }

    @GetMapping("/records/{id}")
    public ResponseEntity<GymRecordDto> getGymRecord(@PathVariable Long id) {
        return ResponseEntity.ok(recordsService.getGymRecord(id));
    }

    @PutMapping("/records/{id}")
    public ResponseEntity<GymRecordDto> updateGymRecord(@PathVariable Long id, @Valid @RequestBody GymRecordDto recordDto) {
        return ResponseEntity.ok(recordsService.updateGymRecord(id, recordDto));
    }

    @PatchMapping("/records/{id}")
    public ResponseEntity<GymRecordDto> patchGymRecord(@PathVariable Long id, @RequestBody GymRecordDto recordDto) {
        return ResponseEntity.ok(recordsService.patchGymRecord(id, recordDto));
    }

    @DeleteMapping("/records/{id}")
    public ResponseEntity<GymRecordDto> deleteGymRecord(@PathVariable Long id) {
        return ResponseEntity.ok(recordsService.deleteGymRecord(id));
    }
}
