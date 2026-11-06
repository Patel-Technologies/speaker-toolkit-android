package com.speakertoolkitapp

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlin.concurrent.thread

class AudioToneModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var audioTrack: AudioTrack? = null
    private var isPlaying = false
    private val sampleRate = 44100
    private var playbackThread: Thread? = null

    override fun getName(): String = "AudioToneModule"

    @ReactMethod
    fun playTone(frequency: Double, volume: Double, pan: Double, stream: String, promise: Promise) {
        try {
            stopCurrentTone()

            isPlaying = true
            val targetFreq = frequency.coerceIn(20.0, 20000.0)
            val targetVol = volume.coerceIn(0.0, 1.5).toFloat()
            val targetPan = pan.coerceIn(-1.0, 1.0).toFloat() // -1 = Left only, 0 = Center, +1 = Right only

            val isEarpiece = stream.equals("earpiece", ignoreCase = true)

            val audioManager = reactApplicationContext.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
            if (isEarpiece) {
                audioManager?.mode = AudioManager.MODE_IN_COMMUNICATION
                audioManager?.isSpeakerphoneOn = false
            } else {
                audioManager?.mode = AudioManager.MODE_NORMAL
                audioManager?.isSpeakerphoneOn = true
            }

            val usage = if (isEarpiece) {
                AudioAttributes.USAGE_VOICE_COMMUNICATION
            } else {
                AudioAttributes.USAGE_MEDIA
            }

            val channelMask = AudioFormat.CHANNEL_OUT_STEREO
            val minBufSize = AudioTrack.getMinBufferSize(sampleRate, channelMask, AudioFormat.ENCODING_PCM_16BIT)
            val bufferSize = Math.max(minBufSize, sampleRate / 10)

            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(usage)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(channelMask)
                        .build()
                )
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            // Calculate Stereo Gains: -1.0 = left 1.0, right 0.0; +1.0 = left 0.0, right 1.0
            val leftGain = if (targetPan <= 0f) targetVol else targetVol * (1f - targetPan)
            val rightGain = if (targetPan >= 0f) targetVol else targetVol * (1f + targetPan)

            audioTrack?.setStereoVolume(leftGain.coerceIn(0f, 1f), rightGain.coerceIn(0f, 1f))
            audioTrack?.play()

            // Background synthesis thread
            playbackThread = thread(start = true) {
                var phase = 0.0
                val chunkSize = 2048
                val shortBuffer = ShortArray(chunkSize * 2) // interleaved L, R

                while (isPlaying) {
                    val phaseIncrement = 2.0 * Math.PI * targetFreq / sampleRate
                    var idx = 0
                    for (i in 0 until chunkSize) {
                        val sample = (Math.sin(phase) * Short.MAX_VALUE * 0.9).toInt().toShort()
                        shortBuffer[idx++] = sample // Left
                        shortBuffer[idx++] = sample // Right
                        phase += phaseIncrement
                        if (phase >= 2.0 * Math.PI) {
                            phase -= 2.0 * Math.PI
                        }
                    }
                    audioTrack?.write(shortBuffer, 0, shortBuffer.size)
                }
            }

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("AUDIO_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopTone(promise: Promise) {
        try {
            stopCurrentTone()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_ERROR", e.message, e)
        }
    }

    private fun stopCurrentTone() {
        isPlaying = false
        try {
            playbackThread?.join(200)
            playbackThread = null
        } catch (ignored: Exception) {}

        try {
            audioTrack?.pause()
            audioTrack?.flush()
            audioTrack?.stop()
            audioTrack?.release()
        } catch (ignored: Exception) {}
        audioTrack = null

        val audioManager = reactApplicationContext.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
        audioManager?.mode = AudioManager.MODE_NORMAL
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        stopCurrentTone()
    }
}
