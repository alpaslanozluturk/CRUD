package com.crud.backend.mappers;

import com.crud.backend.dtos.GymRecordDto;
import com.crud.backend.entities.GymRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GymRecordMapper {


    GymRecord toGymRecord(GymRecordDto gymRecordDto);

    @Mapping(target = "date", source = "created")
    GymRecordDto toGymRecordDto(GymRecord gymRecord);

    List<GymRecordDto> toGymRecordDtos(List<GymRecord> gymRecords);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "created", ignore = true)
    @Mapping(target = "modified", ignore = true)
    void updateGymRecord(@MappingTarget GymRecord target, GymRecord source);
}
