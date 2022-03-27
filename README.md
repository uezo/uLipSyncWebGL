# uLipSyncWebGL

An experimental plugin to use [uLipSync](https://github.com/hecomi/uLipSync) on WebGL platform.


# 😃 Usage

1. Import [uLipSync WebGL Edition](https://github.com/uezo/uLipSyncWebGL/releases) or import official [uLipSync](https://github.com/hecomi/uLipSync/releases)(v2.2.0) and [remove some files and comment out a method](#✅-use-official-ulipsync).

1. Import [uLipSyncWebGL.unitypackage](https://github.com/uezo/uLipSyncWebGL/releases) to your project.

1. Attach `uLipSyncWebGL.cs` to the object `uLipSync` is attached.


# ⚙ How it works

Originally uLipSync get audio data via `MonoBehaviour.OnAudioFilterRead()` and pass it to `OnDataReceived()` to analyze voice and control shape keys.
However, `OnAudioFilterRead()` is not called on WebGL platform for Unity limited support for audio APIs.
So we get data from WebAudio node in `uLipSyncWebGL.jslib` (interop library) and send it to `uLipSyncWebGL.SetAudioSampleData()` (method in Unity Script), that passes data to `OnDataReceived()`.


# 🧪 Experimental

We provide this plugin as an experimental product because:

- Performance is not tuned well. We use ScriptProcessorNode in browser JS that runs in main thread.
- Use data one channel only even if the audio has 2 channels.
- Deference between native and WebGL has not been compared yet. Data transfer frequency, data itself and so on. Just we see it looks working.


# ✅ Use official uLipSync

The official uLipSync uses microphone that is not supported on WebGL and this causes build error. Follow these steps to solve this issue: 

1. Remove files in uLipSync
    - Runtime/uLipSyncMicrophone
    - Runtime/Core/MicUtil
    - Editor/uLipSyncMicrophoneEditor

1. Comment out `DrawMicSelector` method in `Editor/EditorUtil`


# ❤️ Thanks

[uLipSync](https://github.com/hecomi/uLipSync) by hecomi-san, is an Unity asset to do a realtime lipsync that runs various platforms.
