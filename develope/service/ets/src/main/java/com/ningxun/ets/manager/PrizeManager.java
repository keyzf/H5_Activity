package com.ningxun.ets.manager;

import com.ningxun.ets.dao.PrizeCodeDAO;
import com.ningxun.ets.dao.PrizeDao;
import com.ningxun.ets.entity.PrizeCodeEntity;
import com.ningxun.ets.entity.PrizeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PrizeManager {
    @Autowired
    PrizeDao prizeDao;
    @Autowired
    PrizeCodeDAO prizeCodeDAO;

    /**
     * 查询还有数量的奖品
     *
     * @return
     */
    public List<PrizeEntity> findSurplusPriZeList() {
        return prizeDao.findSurplusPriZeList();
    }

    public PrizeCodeEntity findOneByPrizeId(Integer prizeId) {
        return prizeCodeDAO.findOneByPrizeId(prizeId);
    }

    public PrizeCodeEntity savePrizeCode(PrizeCodeEntity prizeCodeEntity) {
        return prizeCodeDAO.save(prizeCodeEntity);
    }

}
