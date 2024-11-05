import React, {useEffect} from 'react';
import './App.css'
import {io} from "socket.io-client";

function App() {
    //Url kết nối socket đến server
    const baseUrl = 'https://seastock.aseansc.com.vn';
    //SDK_INFO yêu cầu server
    const SDK_INFO = {
        '__sails_io_sdk_version': '1.2.1',
        '__sails_io_sdk_platform': 'browser',
        '__sails_io_sdk_language': 'javascript',
    };
    // Khởi tạo socket client kết nối tới server
    const socket = io(baseUrl, {
        path: '/realtime/socket.io',
        transports: ['websocket'],
        query: SDK_INFO,
        autoConnect: false
    });

    const _subscribeToTopics = (topics) => {
        const token = 'Uk42SElHRVM3WDpDNUNkdEN2TUU1dGNtVUhRWlF3ZHpXcVU5dWNXVVo='; //token chuỗi mã hóa base64 cặp clientid với clientsecret được cấp khi gọi openapi
        socket.emit('get', {
                url: '/client/send',
                method: 'get',
                headers: {},
                data: {
                    op: 'subscribe',
                    args: topics,
                    token: token
                }
            }, (response) => {
                if (response.statusCode === 200) {
                    console.log('Subscribed to topics ' + topics.join(', '));
                } else {
                    console.log('Fail to subscribe to topics ' + topics.join(', '));
                }
            }
        );

        return true;
    };

    const _unsubscribeFromTopics = (topics) => {
        socket.emit('get', {
                url: '/client/send',
                method: 'get',
                headers: {},
                data: {
                    op: 'unsubscribe',
                    args: topics
                }
            }, (response) => {
                if (response.statusCode === 200) {
                    console.log('Unsubscribed from topics ' + topics.join(', '));
                } else {
                    console.log('Fail to unsubscribe from topics ' + topics.join(', '));
                }
            }
        );
    };
    let reqid = '20241021593774'
    useEffect(() => {
        // Gửi yêu cầu "subscribe" tới room "rpt:reqid" với reqid là giá trị reqid khi mở tài khoản bước đầu nhận được
        socket.open();

        _subscribeToTopics(['rpt:' + reqid]);
        // Lắng nghe phản hồi từ server
        socket.on('rpt:' + reqid, (data) => {
            console.log('Response server:', data);
        });

        // Gửi yêu cầu "unsubscribe" tới room "rpt:reqid" với reqid là giá trị reqid khi mở tài khoản bước đầu nhận được
        return () => {
            _unsubscribeFromTopics(['rpt:' + reqid]);
            return socket.close();
        };
    }, []);
    return (
        <div>aadsd</div>
    );
}

export default App;
