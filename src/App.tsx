/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, Volume2, Loader2, Music, Languages, Sun, Globe, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { generateSpeech, VoiceName, Language } from "@/src/lib/gemini";

export default function App() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<VoiceName>("Kore");
  const [language, setLanguage] = useState<Language>("Kannada");
  const [speechRate, setSpeechRate] = useState(0.9);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const url = await generateSpeech(text, language, voice, speechRate);
      setAudioUrl(url);
      
      // Auto-play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error("Failed to generate speech:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    Kannada: "ಕನ್ನಡ ವಾಣಿ",
    Hindi: "वाणी एआई"
  };

  const descriptions = {
    Kannada: '"The voice of Kannada, echoing in peaceful resonance."',
    Hindi: '"The essence of speech, captured in divine harmony."'
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-spiritual-bg selection:bg-spiritual-olive/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-spiritual-olive/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-spiritual-olive/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 1, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 text-spiritual-cream mb-6 shadow-xl relative overflow-hidden"
          >
            <Sun size={40} className="relative z-10 animate-pulse" />
            <div className="absolute inset-0 bg-white/20 blur-xl" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight text-spiritual-ink mb-4 transition-all duration-500">
            {titles[language]}
          </h1>
          <p className="text-xl font-serif italic text-spiritual-ink/60 max-w-md mx-auto h-12">
            {descriptions[language]}
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-spiritual-cream/80 backdrop-blur-md rounded-[32px] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-serif font-medium flex items-center gap-2">
                <Sparkles className="text-spiritual-olive" size={20} />
                Generate Voice
              </CardTitle>
              <div className="flex items-center gap-2 bg-spiritual-bg/50 p-1 rounded-full border border-spiritual-olive/10">
                <Button
                  variant={language === "Kannada" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("Kannada")}
                  className={`rounded-full px-4 font-serif ${language === "Kannada" ? "bg-spiritual-olive text-spiritual-cream" : "text-spiritual-ink/60"}`}
                >
                  ಕನ್ನಡ
                </Button>
                <Button
                  variant={language === "Hindi" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("Hindi")}
                  className={`rounded-full px-4 font-serif ${language === "Hindi" ? "bg-spiritual-olive text-spiritual-cream" : "text-spiritual-ink/60"}`}
                >
                  हिन्दी
                </Button>
              </div>
            </div>
            <CardDescription className="font-sans text-spiritual-ink/50">
              {language === "Kannada" ? "Type or paste your text below." : "नीचे अपना टेक्स्ट टाइप करें या पेस्ट करें।"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Textarea
                placeholder={language === "Kannada" ? "ಇಲ್ಲಿ ಬರೆಯಿರಿ..." : "यहाँ लिखें..."}
                className="min-h-[150px] text-lg font-serif bg-spiritual-bg/30 border-spiritual-olive/10 focus:border-spiritual-olive/30 focus:ring-spiritual-olive/20 rounded-2xl resize-none transition-all"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-spiritual-ink/70">Voice Character</Label>
                <Select value={voice} onValueChange={(v) => setVoice(v as VoiceName)}>
                  <SelectTrigger className="bg-spiritual-bg/30 border-spiritual-olive/10 rounded-xl">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent className="bg-spiritual-cream border-spiritual-olive/10">
                    <SelectItem value="Kore">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Kore (Balanced & Wise)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Puck">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Puck (Cheerful & Bright)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Charon">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Charon (Deep & Resonant)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-sans uppercase">Male</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Fenrir">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Fenrir (Strong & Bold)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-sans uppercase">Male</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Zephyr">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Zephyr (Light & Ethereal)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Aoede">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Aoede (Melodic & Soft)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Orpheus">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Orpheus (Classic & Poetic)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-sans uppercase">Male</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Leda">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Leda (Graceful & Calm)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Despina">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Despina (Mystical & Deep)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Achernar">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Achernar (Radiant & Clear)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-sans uppercase">Male</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Sulafat">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Sulafat (Gentle & Warm)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-sans uppercase">Female</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-spiritual-ink/70 flex items-center gap-2">
                    <Gauge size={14} className="text-spiritual-olive" />
                    Speech Pace
                  </Label>
                  <span className="text-xs font-mono text-spiritual-olive bg-spiritual-olive/10 px-2 py-0.5 rounded-full">
                    {(speechRate ?? 1.0).toFixed(1)}x
                  </span>
                </div>
                <div className="pt-2 px-1">
                  <Slider
                    value={[speechRate ?? 1.0]}
                    onValueChange={(vals) => {
                      const val = Array.isArray(vals) ? vals[0] : vals;
                      if (typeof val === "number") {
                        setSpeechRate(val);
                      }
                    }}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="[&_[data-slot=slider-range]]:bg-spiritual-olive [&_[data-slot=slider-thumb]]:border-spiritual-olive"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-spiritual-ink/40 font-sans uppercase tracking-wider">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end md:col-span-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !text.trim()}
                  className="w-full h-11 bg-spiritual-olive hover:bg-spiritual-olive/90 text-spiritual-cream rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {language === "Kannada" ? "ಧ್ವನಿ ರಚಿಸಿ" : "आवाज उत्पन्न करें"}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {audioUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4"
                >
                  <div className="p-4 rounded-2xl bg-spiritual-olive/5 border border-spiritual-olive/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-spiritual-olive/10 flex items-center justify-center text-spiritual-olive">
                      <Volume2 size={20} />
                    </div>
                    <div className="flex-1">
                      <audio
                        key={audioUrl}
                        ref={audioRef}
                        src={audioUrl}
                        controls
                        className="w-full h-8 accent-spiritual-olive"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-spiritual-ink/30">
            <Globe size={20} />
            <div className="w-1 h-1 rounded-full bg-spiritual-ink/20" />
            <Sun size={20} />
            <div className="w-1 h-1 rounded-full bg-spiritual-ink/20" />
            <Sparkles size={20} />
          </div>
          <p className="mt-4 text-xs font-sans uppercase tracking-[0.2em] text-spiritual-ink/40">
            Multi-Language Support • Vani AI
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
