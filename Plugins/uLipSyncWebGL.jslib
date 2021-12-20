mergeInto(LibraryManager.library, {
    InitWebGLuLipSync: function(targetObjectNamePtr, targetMethodNamePtr) {
        const targetObjectName = UTF8ToString(targetObjectNamePtr);
        const targetMethodName = UTF8ToString(targetMethodNamePtr);
        var outputHookNode = WEBAudio.audioContext.createScriptProcessor();
        outputHookNode.onaudioprocess = function (stream) {
            SendMessage(targetObjectName, targetMethodName, event.inputBuffer.getChannelData(0).join(','));
        };

        const jobId = setInterval(function() {
            for (var i = 0; i < WEBAudio.audioInstances.length; i++) {
                if (WEBAudio.audioInstances[i] != null && WEBAudio.audioInstances[i].hasOwnProperty("gain")) {
                    // connect gain -> outputHookNode
                    WEBAudio.audioInstances[i].gain.connect(outputHookNode);
                    // connect outputHookNode -> dest (dummy: no output data will go to dest)
                    outputHookNode.connect(WEBAudio.audioContext.destination);
                    console.log("Connected outputHookNode successfully");
                    clearInterval(jobId);
                    break;
                }
            }
        }, 200);
    },
});
