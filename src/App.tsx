import { useEffect, useRef, useState } from "react";
import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from "react-media-recorder-2";

function App() {
  const [status, setStatus] = useState("idle");
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<{
    video: string;
    audio: string;
  }>({
    video: "",
    audio: "",
  });

  const MediaRecorderScreen = useReactMediaRecorder({
    screen: true,
  });
  const MediaRecorderPreviewWebcam = useReactMediaRecorder({
    video: {
      deviceId: selectedDevice.video,
    },
  });
  const MediaRecorderWebcam = useReactMediaRecorder({
    video: {
      deviceId: selectedDevice.video,
    },
  });
  const MediaRecorderAudio = useReactMediaRecorder({
    audio: {
      deviceId: selectedDevice.audio,
    },
  });
  const recordStart = async () => {
    setStatus("recording");
    await MediaRecorderScreen.startRecording();
    await MediaRecorderWebcam.startRecording();
    await MediaRecorderAudio.startRecording();
  };
  const recordStop = async () => {
    await MediaRecorderScreen.stopRecording();
    await MediaRecorderWebcam.stopRecording();
    await MediaRecorderAudio.stopRecording();
    setStatus("idle");
  };
  const clearBlobUrl = () => {
    MediaRecorderScreen.clearBlobUrl();
    MediaRecorderWebcam.clearBlobUrl();
    MediaRecorderAudio.clearBlobUrl();
  };
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setVideoDevices(devices.filter((device) => device.kind === "videoinput"));
      setAudioDevices(devices.filter((device) => device.kind === "audioinput"));
      setSelectedDevice({
        video: devices.filter((device) => device.kind === "videoinput")[0]
          .deviceId,
        audio: devices.filter((device) => device.kind === "audioinput")[0]
          .deviceId,
      });
    });
  }, []);
  useEffect(() => {
    status === "idle"
      ? MediaRecorderPreviewWebcam.startRecording()
      : status === "recording"
      ? MediaRecorderPreviewWebcam.stopRecording()
      : MediaRecorderPreviewWebcam.clearBlobUrl();
  }, [MediaRecorderPreviewWebcam, status]);

  const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);
    if (!stream) {
      return null;
    }
    if (stream.active === false) {
      return null;
    }

    return <video ref={videoRef} width={500} height={500} autoPlay controls />;
  };
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-800 text-center align-middle text-white gap-3 py-9 px-3">
        <span className="font-bold text-4xl text-white">
          Interv Media Recorder
        </span>
        <div>
          <h1 className=" font-bold text-xl">Devices</h1>
          <h2 className="text-lg">Video Devices</h2>
          <ul>
            {videoDevices.map((device) => (
              <li key={device.deviceId}>
                <input
                  type="radio"
                  name="videoDevices"
                  value={device.deviceId}
                  checked={selectedDevice.video === device.deviceId}
                  onChange={() => {
                    MediaRecorderPreviewWebcam.stopRecording();
                    setSelectedDevice({
                      ...selectedDevice,
                      video: device.deviceId,
                    });
                  }}
                />
                {device.label}
              </li>
            ))}
          </ul>
          <h2 className="text-lg">Audio Devices</h2>
          <ul>
            {audioDevices.map((device) => (
              <li key={device.deviceId}>
                <input
                  type="radio"
                  name="audioDevices"
                  value={device.deviceId}
                  checked={selectedDevice.audio === device.deviceId}
                  onChange={() =>
                    setSelectedDevice({
                      ...selectedDevice,
                      audio: device.deviceId,
                    })
                  }
                />
                {device.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 items-center justify-center">
            {" "}
            <span>
              {"Screen status: " + MediaRecorderScreen.status + " , "}
            </span>
            <span>
              {"Webcam status: " + MediaRecorderWebcam.status + " , "}
            </span>
            <span>{"Audio status: " + MediaRecorderAudio.status}</span>
          </div>
          <div>
            <ReactMediaRecorder
              video
              render={() => {
                return (
                  <VideoPreview
                    stream={MediaRecorderPreviewWebcam.previewStream}
                  />
                );
              }}
            />
          </div>

          <div className="flex flex-row gap-3 items-center justify-center align-middle">
            {status === "recording" ? (
              <button
                onClick={recordStop}
                className="bg-red-700 p-4 rounded-2xl"
              >
                Stop Recording
              </button>
            ) : (
              <button
                onClick={recordStart}
                className="bg-green-700 p-4 rounded-2xl"
              >
                Start Recording
              </button>
            )}

            <button
              onClick={clearBlobUrl}
              className="bg-gray-700 p-4 rounded-2xl"
            >
              Clear video
            </button>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center">
            {MediaRecorderScreen.mediaBlobUrl && (
              <div className="w-1/4 h-1/4 flex flex-row gap-4 items-center justify-center text-center">
                <span className="text-lg font-bold">Screen Preview: </span>
                <video
                  src={MediaRecorderScreen.mediaBlobUrl}
                  controls
                  autoPlay
                  loop
                ></video>
              </div>
            )}
            {MediaRecorderWebcam.mediaBlobUrl && (
              <div className="w-1/4 h-1/4 flex flex-row gap-4 items-center justify-center text-center">
                <span className="text-lg font-bold">Webcam Preview: </span>
                <video
                  src={MediaRecorderWebcam.mediaBlobUrl}
                  controls
                  autoPlay
                  loop
                ></video>
              </div>
            )}
            {MediaRecorderAudio.mediaBlobUrl && (
              <div className="w-1/4 h-1/4 flex flex-row gap-4 items-center justify-around text-center">
                <span className="text-lg font-bold">Audio Preview: </span>
                <audio
                  src={MediaRecorderAudio.mediaBlobUrl}
                  controls
                  autoPlay
                  loop
                ></audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
