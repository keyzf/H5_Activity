package com.ningxun.ets.dao;

import com.ningxun.ets.entity.PrizeCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PrizeCodeDAO extends JpaRepository<PrizeCodeEntity, Integer> {

    @Query(value = "SELECT * FROM prize_code WHERE prize_id = ? AND state = 0 LIMIT 1", nativeQuery = true)
    PrizeCodeEntity findOneByPrizeId(Integer prizeId);

}
