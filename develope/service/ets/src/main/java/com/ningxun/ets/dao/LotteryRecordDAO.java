package com.ningxun.ets.dao;

import com.ningxun.ets.entity.LotteryRecordEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LotteryRecordDAO extends JpaRepository<LotteryRecordEntity, Integer> {

    @Modifying
    @Query(value = "UPDATE lottery_record SET state = 1,prize_id = ?2,prize_code = ?3,user_name = ?4,lottery_time = NOW() WHERE guid = ?1 AND state = 0 LIMIT 1", nativeQuery = true)
    Integer updateStateByGuid(String guid, Integer prizeId, String prizeCode, String userName);

    Integer countByGuidAndState(String guid, Integer state);

    Integer countByGuidAndLotteryType(String guid, Integer lotteryType);

    @Query(value = "SELECT COUNT(id) FROM lottery_record WHERE guid = ?1 AND lottery_type = ?2 AND TO_DAYS(NOW()) = TO_DAYS(create_time)", nativeQuery = true)
    Integer countTodayShareByGuidAndType(String guid, Integer lotteryType);

    @Query(value = "SELECT * FROM lottery_record WHERE guid = ? AND lottery_type = 1 AND TO_DAYS(NOW()) = TO_DAYS(create_time)", nativeQuery = true)
    List<LotteryRecordEntity> findTodayShare(String guid);

    @Query(value = "SELECT lr.user_name,lr.lottery_time,p.prize_name FROM lottery_record lr LEFT JOIN prize p ON lr.prize_id = p.id WHERE lr.guid = ? AND lr.state = 1 AND lr.prize_id IS NOT NULL ORDER BY lottery_time DESC",
            countQuery = "SELECT COUNT(id) FROM lottery_record  WHERE guid = ? AND state = 1 AND prize_id IS NOT NULL", nativeQuery = true)
    Page<Map<String, Object>> listMinePrizes(String guid, Pageable pageable);

    @Query(value = "SELECT lr.user_name,lr.lottery_time,p.prize_name FROM lottery_record lr LEFT JOIN prize p ON lr.prize_id = p.id WHERE lr.state = 1 AND lr.prize_id IS NOT NULL ORDER BY lottery_time DESC",
            countQuery = "SELECT COUNT(id) FROM lottery_record  WHERE state = 1 AND prize_id IS NOT NULL", nativeQuery = true)
    Page<Map<String, Object>> listPrizes(Pageable pageable);

}
