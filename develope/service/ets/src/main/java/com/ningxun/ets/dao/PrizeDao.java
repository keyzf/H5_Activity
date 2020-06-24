package com.ningxun.ets.dao;

import com.ningxun.ets.entity.PrizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrizeDao extends JpaRepository<PrizeEntity, Integer> {

    @Query(value = "SELECT * FROM prize WHERE id IN(SELECT prize_id FROM prize_code WHERE state = 0) OR state = 1 ORDER BY prize_index", nativeQuery = true)
    List<PrizeEntity> findSurplusPriZeList();

}
