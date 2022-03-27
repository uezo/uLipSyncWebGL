using System;
using System.Linq;
using System.Runtime.InteropServices;
using UnityEngine;
using uLipSyncScript = uLipSync.uLipSync;

namespace ChatdollKit.Extension.uLipSync
{
    public class uLipSyncWebGL : MonoBehaviour
    {
        [DllImport("__Internal")]
        private static extern void InitWebGLuLipSync(string targetObjectName, string targetMethodName);

        private uLipSyncScript ulipSyncScript;

        private void Awake()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            ulipSyncScript = GetComponent<uLipSyncScript>();
            if (ulipSyncScript != null)
            {
                InitWebGLuLipSync(gameObject.name, "SetAudioSampleData");
            }
#endif
        }

        private void SetAudioSampleData(string inputString)
        {
            if (!ulipSyncScript.audioSourceProxy)
            {
                var samplingData = inputString.Split(',').Select(s => Convert.ToSingle(s)).ToArray();
                ulipSyncScript.OnDataReceived(samplingData, 1);
            }
        }
    }
}
