import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder-2";
function App() {
  const [status, setStatus] = useState("idle");
  const MediaRecorderScreen = useReactMediaRecorder({
    screen: true,
  });
  const MediaRecorderWebcam = useReactMediaRecorder({
    video: true,
  });
  const MediaRecorderAudio = useReactMediaRecorder({
    audio: true,
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
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-800 text-center align-middle text-white gap-3 py-9 px-3">
        <span className="font-bold text-4xl text-white">
          Interv Media Recorder
        </span>
        <div className="flex flex-col gap-3">
          <p>{"Screen status: " + MediaRecorderScreen.status}</p>
          <p>{"Webcam status: " + MediaRecorderWebcam.status}</p>
          <p>{"Audio status: " + MediaRecorderAudio.status}</p>
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
