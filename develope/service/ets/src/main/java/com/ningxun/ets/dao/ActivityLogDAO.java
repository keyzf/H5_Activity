package com.ningxun.ets.dao;

import com.ningxun.ets.entity.ActivityLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogDAO extends JpaRepository<ActivityLogEntity, Integer> {

    @Query(value = "SELECT COUNT(id) FROM activity_log WHERE guid = ?1 AND source = ?2 AND log_type = ?3 AND TO_DAYS(NOW()) = TO_DAYS(create_time)", nativeQuery = true)
    Integer countToday(String guid, Integer source, Integer type);

}
