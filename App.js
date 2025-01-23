import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs'; // 按需导入 Stomp 类
import axios from 'axios';
import { Table, Button, Space } from 'antd';

function App() {
  const [audioSrc, setAudioSrc] = useState('');
  const [audioLinks, setAudioLinks] = useState([]);
  const stompClientRef = useRef(null); // 使用 useRef 存储 stompClient
  const audioRefs = useRef([]);

  useEffect(() => {
    function connect() {
      const socket = new SockJS('http://localhost:8080/ws'); // 创建 SockJS 连接
      stompClientRef.current = Stomp.over(socket); // 使用 Stomp.over 方法创建 STOMP 客户端
      stompClientRef.current.connect({}, frame => {
        console.log('Connected: ' + frame);
        stompClientRef.current.subscribe('/topic/audio-link', messageOutput => {
          showGreeting(messageOutput.body);
        });
      });
    }

    function showGreeting(message) {
      console.log('Received: ' + message);
      setAudioLinks(prevLinks => [...prevLinks, message]);
    }

    connect();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  async function serverSendAudioLink() {
    try {
      const response = await axios.post('http://localhost:8080/send-audio-link', {
        audioUrl: 'https://www.soundjay.com/button/beep-07.wav'
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending audio link:', error);
    }
  }

  function playAudio(index) {
    const audioElement = audioRefs.current[index];
    if (audioElement) {
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  const columns = [
    {
      title: 'Audio Links',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
          <Space size="middle">
            <Button type="primary" onClick={() => playAudio(index)}>Play</Button>
            <audio ref={(el) => audioRefs.current[index] = el} src={record.link} style={{ display: 'none' }}></audio>
          </Space>
      ),
    },
  ];

  const data = audioLinks.map((link, index) => ({
    key: index,
    link: link,
  }));

  return (
      <div className="App">
        <h1>STOMP over WebSocket Audio Test</h1>
        <Button type="primary" onClick={serverSendAudioLink}>Server Send Audio Link</Button>
        <Table dataSource={data} columns={columns} style={{ marginTop: 20 }} />
      </div>
  );
}

export default App;
