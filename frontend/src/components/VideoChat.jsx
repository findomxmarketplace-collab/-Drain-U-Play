import React, { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

const VideoChat = ({ playerId, players }) => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [myStream, setMyStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  
  const myVideoRef = useRef();
  const peerRef = useRef();

  useEffect(() => {
    if (isVideoOn && myStream) {
      Object.keys(players).forEach(id => {
        if (id !== playerId && !remoteStreams[id]) {
          console.log('Calling player:', id);
          const call = peerRef.current.call(id, myStream);
          call.on('stream', (userRemoteStream) => {
            setRemoteStreams(prev => ({ ...prev, [id]: userRemoteStream }));
          });
          call.on('close', () => {
            setRemoteStreams(prev => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          });
        }
      });
    }
  }, [players, isVideoOn, myStream]);

  useEffect(() => {
    const peer = new Peer(playerId);
    peerRef.current = peer;

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('My peer ID is: ' + id);
    });

    peer.on('error', (err) => {
      console.warn('PeerJS error:', err.type);
      // 'peer-unavailable' is common in P2P if the other person isn't ready
    });

    peer.on('call', (call) => {
      if (myStream) {
        call.answer(myStream);
        call.on('stream', (userRemoteStream) => {
          setRemoteStreams(prev => ({ ...prev, [call.peer]: userRemoteStream }));
        });
      }
    });

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (myStream) myStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleVideo = async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn });
        setMyStream(stream);
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;
        setIsVideoOn(true);

        // Call all other players
        Object.keys(players).forEach(id => {
          if (id !== playerId) {
            const call = peerRef.current.call(id, stream);
            call.on('stream', (userRemoteStream) => {
              setRemoteStreams(prev => ({ ...prev, [id]: userRemoteStream }));
            });
          }
        });
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    } else {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
      setIsVideoOn(false);
      setRemoteStreams({});
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {/* My Video */}
        <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-pink-500/50">
          <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-[10px] uppercase font-bold">You</div>
          {!isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
              <VideoOff size={24} className="text-neutral-700" />
            </div>
          )}
        </div>

        {/* Remote Videos */}
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div key={id} className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
            <video
              autoPlay
              playsInline
              ref={el => { if (el) el.srcObject = stream; }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-[10px] uppercase font-bold">
              {players[id]?.name || id}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-all ${isVideoOn ? 'bg-pink-500 text-white' : 'bg-neutral-700 text-neutral-400'}`}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-pink-500 text-white' : 'bg-neutral-700 text-neutral-400'}`}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
