mergeInto(LibraryManager.library, {
    InitWebGLuLipSync: function(targetObjectNamePtr, targetMethodNamePtr) {
        const targetObjectName = UTF8ToString(targetObjectNamePtr);
        const targetMethodName = UTF8ToString(targetMethodNamePtr);

        const outputHookNode = WEBAudio.audioContext.createScriptProcessor();
        outputHookNode.onaudioprocess = function (event) {
            SendMessage(targetObjectName, targetMethodName, event.inputBuffer.getChannelData(0).join(','));
        };

        // Get the audio node before gain (volume) adjustment for lip sync sampling
        const getPreGainNode = function (audioInstance) {
            if (audioInstance.source) return audioInstance.source;
            if (audioInstance.panner) return audioInstance.panner;
            return audioInstance.gain;
        };

        const connectAudioNodes = function (audioInstance) {
            if (audioInstance != null && audioInstance.hasOwnProperty("gain")) {
                // connect pre-gain node -> outputHookNode to sample audio before volume adjustment
                var preGainNode = getPreGainNode(audioInstance);
                preGainNode.connect(outputHookNode);
                // connect outputHookNode -> dest (dummy: no output data will go to dest)
                outputHookNode.connect(WEBAudio.audioContext.destination);
                console.log("Connected audio nodes successfully (pre-gain)");
                return true;
            } else {
                return false;
            }
        };

        // Wait for an audio instance to become available, then connect it
        const jobId = setInterval(function() {
            for (var key in WEBAudio.audioInstances) {
                if (connectAudioNodes(WEBAudio.audioInstances[key])) {
                    // AudioBufferSourceNode (= source) is a one-shot node per the WebAudio API spec.
                    // Once playback ends, the node is discarded and Unity creates a new one internally.
                    // This means our custom connection (source -> outputHookNode) is lost each time.
                    // Since Unity's WEBAudio does not expose any event for new node creation,
                    // we poll and reconnect every 200ms.
                    // This is acceptable for lip sync: connect() is a no-op if already connected,
                    // and a brief gap of up to 200ms is imperceptible in mouth animation.
                    setInterval(function() {
                        var inst = WEBAudio.audioInstances[key];
                        if (inst) {
                            var preGainNode = getPreGainNode(inst);
                            preGainNode.connect(outputHookNode);
                        }
                    }, 200);
                    clearInterval(jobId);
                    break;
                }
            }
        }, 200);
    },
});
