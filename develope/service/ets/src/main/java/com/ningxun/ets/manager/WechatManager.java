package com.ningxun.ets.manager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSONObject;

@Component
public class WechatManager {

    @Autowired
    RestTemplate restTemplate;

    @Value("${wechat.appid}")
    private String appid;
    @Value("${wechat.secret}")
    private String secret;

    private static final String USERINFO_OPENID_URL = "https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
    private static final String ACCESS_TOKEN_CODE_URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";

    /**
     * 通过code获取网页授权
     * @param code
     * @return
     */
    public JSONObject tokenByCode(String code) {
        String url = ACCESS_TOKEN_CODE_URL.replace("APPID", appid).replace("SECRET", secret).replace("CODE", code);
        ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
        return JSONObject.parseObject(resp.getBody());
    }


    /**
     * 拉取用户信息
     * @param openid
     * @param access_token
     */
    public JSONObject obtainUserinfo(String openid, String access_token) {
        String url = USERINFO_OPENID_URL.replace("ACCESS_TOKEN", access_token).replace("OPENID", openid);
        ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
        return JSONObject.parseObject(resp.getBody());
    }

}
