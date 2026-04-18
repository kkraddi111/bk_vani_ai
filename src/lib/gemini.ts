import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede' | 'Orpheus' | 'Leda' | 'Despina' | 'Achernar' | 'Sulafat';
export type Language = 'Kannada' | 'Hindi';

export async function generateSpeech(text: string, language: Language, voice: VoiceName = 'Kore', speechRate: number = 0.9) {
  try {
    // Using prompt-based speed control as a workaround for explicit speechRate config
    const speedDescription = speechRate < 1.0 ? "slowly" : speechRate > 1.0 ? "fast" : "at a normal pace";
    const prompt = `Say ${speedDescription} (speed: ${speechRate}x) in ${language}: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data received from Gemini");
    }

    // Gemini TTS returns raw PCM (16-bit, mono, 24kHz)
    // We need to add a WAV header for it to be playable in a standard <audio> tag
    return pcmToWav(base64Audio, 24000);
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
}

function pcmToWav(base64Pcm: string, sampleRate: number): string {
  const binary = atob(base64Pcm);
  const pcmData = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    pcmData[i] = binary.charCodeAt(i);
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const fileSize = 36 + dataSize;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(pcmData);

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

export async function extractTextWithAI(fileBase64: string, mimeType: string, language: Language) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: `Extract the full text from this document. The language is ${language}. Ensure the output is in proper Unicode characters (Devanagari for Hindi, Kannada script for Kannada). Even if the document uses legacy fonts, convert it to standard Unicode text. Do not include any commentary, only the extracted text.`
            },
            {
              inlineData: {
                data: fileBase64,
                mimeType: mimeType,
              }
            }
          ]
        }
      ],
    });

    return response.text || "";
  } catch (error) {
    console.error("AI OCR Error:", error);
    throw error;
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
