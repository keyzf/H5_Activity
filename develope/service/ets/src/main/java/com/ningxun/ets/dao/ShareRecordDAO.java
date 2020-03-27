package com.ningxun.ets.dao;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ningxun.ets.entity.ShareRecordEntity;

public interface ShareRecordDAO extends JpaRepository<ShareRecordEntity, Long> {

	@Query(value = "SELECT sr.nick_name,count(sr.id)number,MAX(share_time)share_time,wu.head_img_url FROM share_record sr LEFT JOIN wechat_userinfo wu ON sr.open_id = wu.open_id where sr.delete_state=0 GROUP BY sr.open_id ORDER BY number DESC,share_time", nativeQuery = true)
	Page<List<Object[]>> findShareRecodes(Pageable pageable);

	@Query(value = "SELECT sr.nick_name,sr.id,sr.share_time,wu.head_img_url FROM share_record sr LEFT JOIN wechat_userinfo wu ON sr.open_id = wu.open_id where sr.delete_state=0 ORDER BY sr.id DESC", countQuery = "SELECT count(id) FROM share_record where delete_state=0", nativeQuery = true)
	Page<Map<String, Object>> findShareRecordList(Pageable pageable);

	@Query(value = "SELECT count(id) FROM share_record", nativeQuery = true)
	Integer findAllNumbers();

	@Query(value = "SELECT count(id) FROM share_record WHERE open_id = ?1", nativeQuery = true)
	Integer findPersonalNumbers(String openId);

}
