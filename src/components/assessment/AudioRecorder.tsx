"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, RotateCcw } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const AudioRecorder: React.FC<{ onRecordingComplete: (base64: string) => void }> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        // Microphone access requires a secure context (HTTPS or localhost)
        if (typeof window !== "undefined" && !window.isSecureContext) {
            alert("Microphone access is blocked on non-secure connections. Please use http://localhost:3000 instead of your network IP (192.168.x.x).");
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Microphone access is not supported in this browser or requires a secure connection.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Priority: webm (Chrome/Firefox), mp4 (Safari), default
            let mimeType = "";
            if (MediaRecorder.isTypeSupported("audio/webm")) {
                mimeType = "audio/webm";
            } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
                mimeType = "audio/mp4";
            }

            const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
                const reader = new FileReader();
                reader.onloadend = () => {
                    onRecordingComplete(reader.result as string);
                    setAudioUrl(URL.createObjectURL(audioBlob));
                };
                reader.readAsDataURL(audioBlob);

                // Stop all tracks to release the mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err: any) {
            console.error("Recording error:", err);
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                alert("Microphone access denied. Please allow microphone access in your browser settings (usually in the address bar or phone settings) and try again.");
            } else {
                alert(`Microphone error: ${err.message || "Access denied"}`);
            }
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const resetRecording = () => {
        setAudioUrl(null);
        onRecordingComplete("");
    };

    return (
        <div className="group/recorder overflow-hidden">
            {!audioUrl ? (
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                        "flex items-center gap-4 p-4 w-full bg-slate-900/5 backdrop-blur-sm rounded-2xl border border-slate-900/5 transition-all duration-300 text-left",
                        isRecording
                            ? "bg-red-50/50 border-red-100 ring-4 ring-red-500/5"
                            : "hover:bg-slate-900/10 hover:border-slate-900/10"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shrink-0",
                        isRecording
                            ? "bg-red-500 scale-105"
                            : "bg-primary group-hover/recorder:scale-105"
                    )}>
                        {isRecording ? (
                            <Square size={18} fill="white" className="text-white" />
                        ) : (
                            <Mic size={20} className="text-white" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-xs font-black uppercase tracking-widest",
                                isRecording ? "text-red-500 animate-pulse" : "text-slate-500"
                            )}>
                                {isRecording ? "Live Recording" : "Microphone Ready"}
                            </span>
                            {isRecording && (
                                <div className="flex gap-0.5 items-end h-3">
                                    {[1, 2, 3, 2, 1].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-0.5 bg-red-400 rounded-full animate-bounce"
                                            style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium truncate">
                            {isRecording ? "Click to stop" : "Click to start voice recording"}
                        </p>
                    </div>
                </button>
            ) : (
                <div className="flex items-center gap-3 w-full p-4 bg-slate-900/5 backdrop-blur-sm rounded-2xl border border-slate-900/5 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex-1 bg-white/40 rounded-xl p-1.5 border border-white/20 shadow-inner">
                        <audio src={audioUrl} controls className="w-full h-8 custom-audio-player block" />
                    </div>
                    <button
                        type="button"
                        onClick={resetRecording}
                        className="w-10 h-10 rounded-xl bg-slate-200/50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-slate-500 shrink-0"
                        title="Retry"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
