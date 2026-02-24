/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle2, Share2, Send, Loader2, User, MapPin, Briefcase, Wallet, Heart, Home, Bike, ChevronLeft, Users, Trophy } from 'lucide-react';

type Step = 'popup' | 'quiz' | 'loading' | 'game' | 'result';

interface QuizData {
  fullName: string;
  city: string;
  occupation: string;
  income: string;
  married: string;
  livingStatus: string;
  houseStatus: string;
  hasBike: string;
}

export default function App() {
  useEffect(() => {
    console.log("Ramzan Quiz App Loaded");
  }, []);

  const [step, setStep] = useState<Step>('popup');
  const [quizStep, setQuizStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isWinning, setIsWinning] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1);
  const [fakeWinners, setFakeWinners] = useState(482);
  const [formData, setFormData] = useState<QuizData>({
    fullName: '',
    city: '',
    occupation: '',
    income: '',
    married: '',
    livingStatus: '',
    houseStatus: '',
    hasBike: '',
  });

  useEffect(() => {
    // Adsterra Script Injection
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28783956.effectivegatecpm.com/5e89a2a9366dfeef1ed32e95512a79bc/invoke.js';
    document.body.appendChild(script);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'VISITOR_COUNT') {
        setVisitorCount(data.count);
      }
    };

    // Randomly increment fake winners for impression
    const interval = setInterval(() => {
      setFakeWinners(prev => prev + Math.floor(Math.random() * 2));
    }, 15000);

    return () => {
      socket.close();
      clearInterval(interval);
    };
  }, []);

  const questions = [
    { id: 'fullName', label: 'آپ کا پورا نام کیا ہے؟', icon: <User className="w-6 h-6" />, placeholder: 'یہاں اپنا نام لکھیں...' },
    { id: 'city', label: 'آپ کا تعلق کس شہر سے ہے؟', icon: <MapPin className="w-6 h-6" />, placeholder: 'شہر کا نام...' },
    { id: 'occupation', label: 'آپ کا روزگار کیا ہے؟', icon: <Briefcase className="w-6 h-6" />, placeholder: 'آپ کیا کام کرتے ہیں؟' },
    { id: 'income', label: 'آپ کی ماہانہ آمدن کتنی ہے؟', icon: <Wallet className="w-6 h-6" />, placeholder: 'مثلاً: 30,000' },
    { id: 'married', label: 'کیا آپ شادی شدہ ہیں؟', icon: <Heart className="w-6 h-6" />, type: 'select', options: ['جی ہاں', 'جی نہیں'] },
    { id: 'livingStatus', label: 'آپ فیملی کے ساتھ رہتے ہیں یا اکیلے؟', icon: <Home className="w-6 h-6" />, type: 'select', options: ['فیملی کے ساتھ', 'اکیلے'] },
    { id: 'houseStatus', label: 'آپ کا اپنا گھر ہے یا کرائے پہ؟', icon: <Home className="w-6 h-6" />, type: 'select', options: ['اپنا گھر', 'کرائے کا گھر'] },
    { id: 'hasBike', label: 'کیا آپ کے پاس اپنی بائیک ہے؟', icon: <Bike className="w-6 h-6" />, type: 'select', options: ['جی ہاں', 'جی نہیں'] },
  ];

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextQuizStep = () => {
    const currentQuestion = questions[quizStep];
    if (!(formData as any)[currentQuestion.id]) {
      alert('براہ کرم جواب لکھیں');
      return;
    }

    if (quizStep < questions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setStep('loading');
    }
  };

  useEffect(() => {
    if (step === 'loading') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setLoadingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('game'), 800);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleBoxClick = async (index: number) => {
    if (selectedBox !== null) return;
    setSelectedBox(index);
    setIsWinning(true);

    // Send data to backend
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error("Failed to submit data:", error);
    }

    setTimeout(() => {
      setStep('result');
    }, 2500);
  };

  const handleWhatsAppShare = () => {
    const appUrl = window.location.origin;
    const message = `*${formData.fullName}* نے حکومتِ پاکستان کے رمضان انعامات 2026 میں حصہ لے کر ایک اسمارٹ فون جیت لیا ہے! 📱🎁 \n\nآپ بھی ابھی حصہ بنیں اور اپنی عید بہتر بنائیں! \n\nلنک یہاں ہے: \n${appUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-urdu selection:bg-emerald-100 leading-[2.2] relative overflow-x-hidden" dir="rtl">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden p-4 md:p-12">
        <img 
          src="https://icon2.cleanpng.com/lnd/20250116/xk/3661c9b41110c2f875ca1716dda099.webp" 
          alt="Government Logo Watermark" 
          className="max-w-full max-h-full opacity-[0.03] object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Decorative Gifts on Sides (Hidden on very small screens) */}
      <div className="fixed left-[-20px] top-1/4 opacity-20 pointer-events-none hidden md:block">
        <Gift className="w-24 h-24 text-emerald-600 rotate-12" />
      </div>
      <div className="fixed right-[-20px] bottom-1/4 opacity-20 pointer-events-none hidden md:block">
        <Gift className="w-24 h-24 text-emerald-600 -rotate-12" />
      </div>

      {/* Header for all pages except popup */}
      {step !== 'popup' && step !== 'loading' && (
        <div className="bg-emerald-600 text-white py-3 px-4 text-center shadow-lg sticky top-0 z-20">
          <h1 className="text-lg md:text-xl font-bold">حکومتِ پاکستان - رمضان پیکیج 2026</h1>
        </div>
      )}

      <main className="max-w-xl mx-auto p-3 md:p-6 relative z-10">
        {/* Step 1: Welcome Popup */}
        {step === 'popup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/30 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-sm text-center border-t-8 border-emerald-500">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-800 mb-1">السلام علیکم</h2>
              <p className="text-xl text-slate-600 mb-6 font-medium">رمضان پیکیج میں خوش آمدید</p>
              <button
                onClick={() => setStep('quiz')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-xl shadow-xl shadow-emerald-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                شروع کریں
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quiz Questions */}
        {step === 'quiz' && (
          <div className="py-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-center">
              <h2 className="text-xl font-bold text-emerald-800 mb-1">انعامات کی بارش!</h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                نیچے کچھ سوالوں کے جواب دے کر قرعہ اندازی میں شامل ہوجائیں۔ یاد رہے، معلومات درست ہونی چاہیے۔
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 border border-slate-100">
              {/* Progress */}
              <div className="flex justify-between items-center mb-5 text-xs font-bold text-emerald-600">
                <span>سوال {quizStep + 1} از {questions.length}</span>
                <div className="w-2/3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: `${((quizStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                    {questions[quizStep].icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{questions[quizStep].label}</h3>
                </div>

                {questions[quizStep].type === 'select' ? (
                  <div className="grid grid-cols-1 gap-2">
                    {questions[quizStep].options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          handleInputChange(questions[quizStep].id, option);
                          setTimeout(nextQuizStep, 300);
                        }}
                        className={`w-full p-4 rounded-xl text-right text-lg font-semibold border-2 transition-all ${
                          (formData as any)[questions[quizStep].id] === option
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-100 active:border-emerald-200 active:bg-slate-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={(formData as any)[questions[quizStep].id]}
                    onChange={(e) => handleInputChange(questions[quizStep].id, e.target.value)}
                    placeholder={questions[quizStep].placeholder}
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-lg transition-all text-right"
                    autoFocus
                  />
                )}
              </div>

              {questions[quizStep].type !== 'select' && (
                <button
                  onClick={nextQuizStep}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-transform active:scale-95"
                >
                  اگلا سوال
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Loading */}
        {step === 'loading' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white">
            <div className="w-full max-w-xs text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Loader2 className="w-20 h-20 text-emerald-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-emerald-700 text-sm">
                  {loadingProgress}%
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">آپ کی رجسٹریشن کی جا رہی ہے...</h2>
              <p className="text-slate-500 text-sm">براہِ کرم صفحہ بند نہ کریں، یہ چند لمحے لے سکتا ہے۔</p>
            </div>
          </div>
        )}

        {/* Step 4: Game (Play to Win Mobile) */}
        {step === 'game' && (
          <div className="py-4 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-1">خاص انعام! 📱</h2>
              <p className="text-amber-900 font-medium">
                آپ کی رجسٹریشن مکمل ہو گئی ہے۔ اب اپنا لکی گفٹ باکس منتخب کریں اور اسمارٹ فون جیتنے کا موقع پائیں!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <button
                  key={i}
                  onClick={() => handleBoxClick(i)}
                  disabled={selectedBox !== null}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    selectedBox === i 
                      ? 'bg-emerald-500 scale-110 shadow-2xl z-10' 
                      : 'bg-white border-2 border-emerald-100 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  {selectedBox === i ? (
                    <div className="flex flex-col items-center animate-bounce">
                      <Bike className="w-10 h-10 text-white" />
                      <span className="text-white text-[10px] font-bold">مبارک ہو!</span>
                    </div>
                  ) : (
                    <Gift className="w-8 h-8 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {isWinning && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-900/40 backdrop-blur-sm p-6">
                <div className="bg-white rounded-[3rem] p-8 text-center shadow-2xl border-4 border-emerald-500 animate-in zoom-in duration-300">
                  <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-black text-emerald-800 mb-2">آپ جیت گئے!</h2>
                  <p className="text-xl text-slate-700 font-bold">آپ نے ایک نیا اسمارٹ فون جیت لیا ہے!</p>
                  <p className="text-sm text-slate-500 mt-4">اگلے مرحلے پر جا رہے ہیں...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Result & Share */}
        {step === 'result' && (
          <div className="py-4 text-center">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            
            <h2 className="text-3xl font-black text-emerald-800 mb-4">مبارک ہو!</h2>
            
            <div className="bg-white rounded-3xl shadow-2xl p-5 md:p-8 border-2 border-emerald-500 mb-6">
              <p className="text-xl font-bold text-slate-800 mb-3 leading-snug">
                آپ حکومتِ پاکستان کے رمضان پروگرام میں رجسٹر ہو گئے ہیں اور آپ نے ایک اسمارٹ فون بھی جیت لیا ہے!
              </p>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                جلد ہی آپ کو ہمارے نمائندے کی کال آجائے گی۔ یاد رہے کہ آپ کی فراہم کردہ معلومات کی تصدیق کی جائے گی۔
              </p>
              
              <div className="h-px bg-slate-100 w-full my-6" />
              
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                  <h3 className="text-lg font-bold text-amber-800 flex items-center justify-center gap-2 mb-1">
                    <Share2 className="w-4 h-4" />
                    آخری اور اہم مرحلہ
                  </h3>
                  <p className="text-amber-900 text-sm font-medium">
                    اپنا جیتا ہوا موبائل حاصل کرنے کے لیے اس پیکیج کو اپنے کم از کم 5 دوستوں کے ساتھ واٹس ایپ پر شیئر کریں۔
                  </p>
                </div>
                
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full bg-[#25D366] hover:bg-[#22c35e] text-white font-bold py-4 rounded-xl text-xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  واٹس ایپ پر شیئر کریں
                  <Share2 className="w-6 h-6" />
                </button>
                
                <p className="text-slate-400 text-[10px] leading-tight">
                  جتنے زیادہ دوستوں کو بھیجیں گے، آپ کا انعام کنفرم ہونے کے امکانات اتنے ہی بڑھ جائیں گے۔
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Adsterra Native Banner */}
        <div className="my-6 min-h-[100px] flex justify-center items-center bg-white/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div id="container-5e89a2a9366dfeef1ed32e95512a79bc"></div>
        </div>

        <footer className="text-slate-400 text-xs pb-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>{visitorCount + 120}</span>
              </div>
              <span className="text-[10px] text-slate-400">آن لائن صارفین</span>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                <Trophy className="w-4 h-4" />
                <span>{fakeWinners}</span>
              </div>
              <span className="text-[10px] text-slate-400">کل خوش نصیب</span>
            </div>
          </div>
          
          <p className="text-[10px]">&copy; 2026 حکومتِ پاکستان - ڈیجیٹل رمضان ریلیف پورٹل</p>
        </footer>
      </main>
    </div>
  );
}
