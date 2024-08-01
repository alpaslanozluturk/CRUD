package com.crud.backend.datainitializer;

import com.crud.backend.entities.GymRecord;
import com.crud.backend.repositories.GymRecordsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Random;

@Configuration
public class DataInitializer {

    private final GymRecordsRepository gymRecordsRepository;

    public DataInitializer(GymRecordsRepository gymRecordsRepository) {
        this.gymRecordsRepository = gymRecordsRepository;
    }

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            Random random = new Random();
            String[] exercises = {"Alpaslan123", "Emre345", "Alpaslan", "Emre", "Ahmet1234"};

            for (int i = 0; i < 10000; i++) {
                GymRecord record = GymRecord.builder()
                        .exercise(exercises[random.nextInt(exercises.length)])
                        .weight(10 + random.nextInt(100)) 
                        .created(LocalDateTime.now().minusDays(random.nextInt(365))) 
                        .modified(LocalDateTime.now())
                        .build();

                gymRecordsRepository.save(record);
            }
        };
    }
}
