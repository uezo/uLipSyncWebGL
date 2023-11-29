mergeInto(LibraryManager.library, {
    InitWebGLuLipSync: function(targetObjectNamePtr, targetMethodNamePtr) {
        const targetObjectName = UTF8ToString(targetObjectNamePtr);
        const targetMethodName = UTF8ToString(targetMethodNamePtr);

        const outputHookNode = WEBAudio.audioContext.createScriptProcessor();
        outputHookNode.onaudioprocess = function (stream) {
            SendMessage(targetObjectName, targetMethodName, event.inputBuffer.getChannelData(0).join(','));
        };

        const connectAudioNodes = function (audioInstance) {
            if (audioInstance != null && audioInstance.hasOwnProperty("gain")) {
                // connect gain -> outputHookNode
                audioInstance.gain.connect(outputHookNode);
                // connect outputHookNode -> dest (dummy: no output data will go to dest)
                outputHookNode.connect(WEBAudio.audioContext.destination);
                console.log("Connected audio nodes successfully");
                return true;
            } else {
                return false;
            }
        };

        const jobId = setInterval(function() {
            for (var key in WEBAudio.audioInstances) {
                if (connectAudioNodes(WEBAudio.audioInstances[key])) {
                    // Continuously reconnect gain -> outputHookNode (they will be disconnected silently, I don't know why...)
                    setInterval(function() {
                        WEBAudio.audioInstances[key].gain.connect(outputHookNode);
                    }, 200);
                    clearInterval(jobId);
                    break;
                }
            }
        }, 200);
    },
});
