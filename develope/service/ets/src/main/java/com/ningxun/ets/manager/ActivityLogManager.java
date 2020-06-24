package com.ningxun.ets.manager;

import com.ningxun.ets.dao.ActivityLogDAO;
import com.ningxun.ets.entity.ActivityLogEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ActivityLogManager {
    @Autowired
    ActivityLogDAO activityLogDAO;

    public ActivityLogEntity save(ActivityLogEntity activityLogEntity) {
        return activityLogDAO.save(activityLogEntity);
    }

    public boolean whetherLogToday(String guid, Integer source, Integer type) {
        Integer num = activityLogDAO.countToday(guid, source, type);
        if (null != num && num > 0) {
            return true;
        } else {
            return false;
        }
    }

}
