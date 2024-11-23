const axios = require('axios');
const schedule = require('node-schedule');
const scSend = require('serverchan-sdk').scSend;

// 登录函数
async function login() {
    const loginUrl = 'https://api-cdn.taoqitu.me/gateway/tqt/cn/passport/auth/login';
    const loginData = {
        "email": process.env.EMAIL,
        "password": process.env.PASSWORD
    };

    try {
        const response = await axios.post(loginUrl, loginData);
        return response.data.data.auth_data; // 返回authorization
    } catch (error) {
        console.error('登录失败:', error);
        return null;
    }
}

// 签到函数
async function signIn(authorization) {
    const signInUrl = 'https://api-cdn.taoqitu.me/gateway/tqt/cn/user/sign';
    const headers = {
        authorization: authorization
    };

    try {
        const response = await axios.get(signInUrl, { headers: headers });
        console.log('签到成功:', response.data);
        return response.data.message;
    } catch (error) {
        console.error('签到失败:', error);
        return '签到失败';
    }
}

// // 定时任务
// const rule = new schedule.RecurrenceRule();
// rule.hour = 8;
// rule.minute = 0;

// const job = schedule.scheduleJob(rule, async () => {
//     console.log('开始执行定时签到任务...');
//     const authorization = await login();
//     if (authorization) {
//         await signIn(authorization);
//     }
// });

// console.log('定时签到任务已设置，每天8点执行。');


// 执行签到任务
setTimeout(async () => {
    console.log('开始执行定时签到任务...');
    const authorization = await login();
    if (authorization) {
        const result = await signIn(authorization);
        const response = await scSend(process.env.SENDKEY, '自动签到', "签到账号" + process.env.EMAIL + "\n" + result, { tags: "github" });
        console.log('Response:', response);
    }
}, 10); 


