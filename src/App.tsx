/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Car, 
  TrainFront, 
  ChevronRight, 
  MapPin, 
  Info, 
  Map as MapIcon, 
  Bus,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  Smartphone,
  Navigation,
  ChevronDown
} from 'lucide-react';

// --- Constants & Assets ---
const BRAND_RED = '#bf1a20';
const INK_PRIMARY = '#1d1d1f';
const INK_SECONDARY = '#86868b';

const IMAGES = {
  // LOGO: '白.png',
  // LOGO: Logo,
  LOGO: '/images/白.png',
  CAMPUS_MODEL: '/images/汽车指引.png',
  BASEMENT_ENTRY: '/images/地图指引.png',
  SHUTTLE_BUS: '/images/地铁指引.png',
  SUBWAY_EXIT: '/images/班车下车后指引.png',
  SHUTTLE_SCHEDULE: '/images/班车下车后指引.png',
  // QR_CODE: 'input_file_6.png',
  // QR_CODE: ICON,
  QR_CODE: '/images/20260422-150401.jpeg',
  PRODUCT_SHOW: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000', 
  WEB3_HERO_VIDEO: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4'
};

type Screen = 'landing' | 'selection' | 'driving' | 'subway' | 'ridehailing' | 'ending';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.1,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

const fadeScaleVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

// --- 时刻表结构化数据 ---
const SH_DATA = {
  morning: [
    { range: "8:10-8:40", times: ["8:10", "8:25", "8:40", "8:55"] },
    { range: "9:10-9:45", times: ["9:10", "9:25", "9:35", "9:45"] }
  ],
  evening: ["18:10", "18:25", "18:40", "18:55", "19:10", "19:25"],
  offPeak: ["10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]
};
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [showSchedule, setShowSchedule] = useState(false);

// --- 统一的时间管理状态 ---
  const [nextBusInfo, setNextBusInfo] = useState<{time: string, countdown: number} | null>(null);

  useEffect(() => {
    const calculateNextBus = () => {
      const now = new Date();
      // 这里的 getDay() === 0 || 6 是判断周末，如果你需要周末也显示，可以注释掉这行
      if (now.getDay() === 0 || now.getDay() === 6) return; 

      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // 展平所有时间点
      const allTimes = [
        ...SH_DATA.morning.flatMap(m => m.times),
        ...SH_DATA.offPeak,
        ...SH_DATA.evening
      ];

      const upcoming = allTimes
        .map(t => {
          const [h, m] = t.split(':').map(Number);
          return { string: t, minutes: h * 60 + m };
        })
        .find(t => t.minutes > currentTime);

      if (upcoming) {
        setNextBusInfo({ 
          time: upcoming.string, 
          countdown: upcoming.minutes - currentTime 
        });
      } else {
        setNextBusInfo(null); // 全天班车已结束
      }
    };

    calculateNextBus();
    const timer = setInterval(calculateNextBus, 30000); // 每30秒更新一次
    return () => clearInterval(timer);
  }, []);

  //
  
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScreen]);

  const navTo = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans overflow-x-hidden selection:bg-brand selection:text-white">
      {/* Apple-style Persistent Top Nav - Hidden on Landing */}
      {currentScreen !== 'landing' && (
        <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl">
          <div className="max-w-[1060px] mx-auto px-6 h-12 flex items-center justify-center">
            <motion.button 
              onClick={() => navTo('landing')}
              className="text-sm font-bold tracking-tight hover:opacity-70 transition-opacity flex items-center gap-2"
            >
              <img src={IMAGES.LOGO} alt="XRAZOR" className="h-4" />
              <span className="hidden sm:inline border-l border-black/10 pl-2 ml-1 text-[10px] uppercase tracking-widest text-[#333333]">XRAZOR TECH GUIDE</span>
            </motion.button>
          </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        {currentScreen === 'landing' && (
          <motion.div 
            key="landing" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative min-h-screen overflow-hidden bg-black font-sans"
          >
            {/* Fullscreen Video Background */}
            <div className="absolute inset-0 z-0">
               <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
               >
                 <source src={IMAGES.WEB3_HERO_VIDEO} type="video/mp4" />
               </video>
               {/* 50% Black Overlay */}
               <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Custom Web3 Navbar */}
            <nav className="relative z-50 flex items-center justify-center w-full px-8 md:px-[120px] py-8">
              {/* Centered Logo & Links */}
              <div className="flex flex-col items-center gap-8">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => navTo('landing')}
                >
                  <img 
                    src={IMAGES.LOGO} 
                    alt="XRAZOR" 
                    className="h-[30px] md:h-[35px] w-auto brightness-0 invert" 
                  />
                </div>
                
                {/* <div className="hidden md:flex items-center gap-[40px]">
                  {["Get Started", "Developers", "Features", "Resources"].map((link) => (
                    <button key={link} className="flex items-center gap-[10px] text-white/60 text-[13px] font-medium hover:text-white transition-colors tracking-wide uppercase">
                      {link}
                      <ChevronDown size={12} strokeWidth={2} />
                    </button>
                  ))}
                </div> */}
              </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center pt-[220px] md:pt-[280px] pb-[102px] px-6 text-center">
              <div className="flex flex-col items-center gap-10">
                
                {/* Animated Heading with Gradient */}
                <motion.h1 
                  variants={itemVariants}
                  className="max-w-[613px] text-[36px] md:text-[56px] font-medium leading-[1.28] tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(144.5deg, #FFFFFF 28%, rgba(255, 255, 255, 0) 115%)'
                  }}
                >
                  Welcome to visit
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                  variants={itemVariants}
                  className="max-w-[680px] text-[15px] font-normal text-white/70 leading-relaxed -mt-6 px-4"
                >
                  您身边的实验室智慧自动化平台合作伙伴
                </motion.p>

                {/* Main CTA Button */}
                <motion.button 
                  variants={itemVariants}
                  onClick={() => navTo('selection')}
                  className="relative group transition-transform active:scale-95 mt-12"
                >
                  {/* Layered construction */}
                  <div className="absolute -inset-[0.6px] bg-white rounded-full opacity-60 transition-opacity group-hover:opacity-100"></div>
                  <div className="relative bg-white rounded-full px-[52px] py-[18px] overflow-hidden shadow-[0_0_40px_-5px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_60px_-5px_rgba(255,255,255,0.4)] transition-all duration-300">
                    <span className="text-black text-base md:text-lg font-semibold tracking-wide">立即探索</span>
                    {/* Subtle white glow streak on top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 blur-xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </motion.button>

              </div>
            </div>
          </motion.div>
        )}

        {currentScreen === 'selection' && (
          <motion.div 
            key="selection" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[calc(100dvh-3rem)] flex flex-col p-6 md:p-12 bg-white"
          >
            <div className="flex-1 apple-container pt-12">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-16 md:mb-24 tracking-tighter text-center text-reveal">
                选择您的参访方式
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-20">
                {[
                  { id: 'driving', icon: Car, label: '驾车前往', sub: 'Driving', desc: '规划路径与停车指引' },
                  { id: 'subway', icon: TrainFront, label: '地铁/班车', sub: 'Subway & Shuttle', desc: '便捷的大型交通中转' },
                  { id: 'ridehailing', icon: Smartphone, label: '网约出租车', sub: 'Ride-Hailing', desc: '点对点精确落地服务' },
                ].map((item, idx) => (
                  <motion.button 
                    key={item.id}
                    variants={itemVariants}
                    onClick={() => navTo(item.id as Screen)}
                    className="group relative flex flex-col items-center text-center p-12 bg-gray-50 rounded-[2.5rem] border border-black/[0.03] hover:bg-white hover:border-brand/20 transition-all duration-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-10 bg-white shadow-sm group-hover:scale-110 transition-transform duration-700 group-hover:rotate-6">
                      <item.icon className="w-8 h-8 text-brand" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#999999] mb-4 font-mono font-bold">{item.sub}</div>
                      <div className="text-2xl font-bold mb-4 text-[#333333]">{item.label}</div>
                      <div className="text-sm text-[#666666] leading-relaxed font-light">{item.desc}</div>
                    </div>
                    
                    <div className="mt-10 flex items-center gap-2 text-xs font-bold text-brand group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500">
                      查看指引 <ArrowRight className="w-4 h-4" />
                    </div>
                    
                    {/* Apple-style subtle light sweep on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 -z-0"></div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {['driving', 'subway', 'ridehailing'].includes(currentScreen) && (
          <DetailsScreen 
            type={currentScreen as any} 
            onBack={() => navTo('selection')} 
            onNext={() => navTo('ending')}
            onShowSchedule={() => setShowSchedule(true)}
            nextBusInfo={nextBusInfo} //
          />
        )}

        {currentScreen === 'ending' && (
          <motion.div 
            key="ending" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[100dvh] flex flex-col p-6 md:p-12 bg-white"
          >
            <motion.header variants={itemVariants} className="flex justify-between items-center mb-24 max-w-7xl mx-auto w-full">
              <img src={IMAGES.LOGO} alt="XRAZOR" className="h-4 md:h-8" />
              <button 
                onClick={() => navTo('selection')}
                className="text-[11px] font-bold tracking-widest uppercase text-brand border border-brand/20 px-4 py-2 rounded-full hover:bg-brand hover:text-white transition-all"
              >
                更改出行
              </button>
            </motion.header>

            <main className="flex-1 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center justify-center">
              <div className="space-y-12">
                <motion.div variants={itemVariants}>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">您已成功抵达</h2>
                  <div className="text-xl sm:text-2xl text-brand font-medium tracking-tight">玄刃科技智慧园区</div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-8 text-lg sm:text-xl text-[#666666] font-light leading-relaxed">
                  <p>
                    玄刃科技成立于 2020 年，在上海、无锡、南京设有研发和精益生产中心。
                  </p>
                  <p>
                    凭借多年机器人、人工智能技术开发和生物医药产业经验，致力于生命科学、合成生物学等细分领域的自动化解决方案。
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                   <a 
                    href="http://www.xr-techs.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-ink text-white rounded-full font-medium hover:bg-brand transition-all shadow-xl shadow-ink/10"
                  >
                    访问官方网站 <ExternalLink className="w-5 h-5" />
                  </a>
                </motion.div>
              </div>

              <motion.div variants={fadeScaleVariants} className="lg:justify-self-end w-full max-w-md">
                 <div className="bg-[#fcfcfc] p-12 rounded-2xl border border-gray-100 space-y-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm inline-block mx-auto flex items-center justify-center">
                       <img src={IMAGES.QR_CODE} alt="WeChat" className="w-56 h-56" />
                    </div>
                    <div className="text-center space-y-3">
                       <h4 className="text-2xl font-bold text-[#333333]">让我们一起创建你的智慧实验室</h4>
                       <p className="text-[#999999] text-sm uppercase tracking-widest font-mono">Transform your workflow with AI</p>
                    </div>
                 </div>
              </motion.div>
            </main>

            <footer className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-widest text-ink-secondary font-mono max-w-7xl mx-auto w-full">
              <div>© 2026 XRAZOR TECHNOLOGY. ALL RIGHTS RESERVED.</div>
              <div className="flex gap-8">
                <span>Innovation</span>
                <span>Precision</span>
                <span>Future</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showSchedule && (
         <motion.div 
  className="bg-white rounded-[3rem] overflow-hidden max-w-2xl w-full relative flex flex-col max-h-[80vh]"
  onClick={e => e.stopPropagation()}
>
  {/* Modal Header */}
  <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0">
    <div>
      <h5 className="text-2xl font-bold">班车安排表</h5>
      <p className="text-[10px] text-brand font-bold tracking-widest uppercase">13号线中科路站 ↔ 玄刃科技</p>
    </div>
    <button onClick={() => setShowSchedule(false)} className="p-3 bg-gray-100 rounded-full hover:bg-brand hover:text-white transition-all">
      <ChevronLeft className="w-5 h-5 rotate-[270deg]" />
    </button>
  </div>

  {/* Modal Body */}
  <div className="flex-1 overflow-y-auto p-8 space-y-8">
    <section>
      <div className="text-[10px] font-bold text-gray-400 mb-4 tracking-widest uppercase italic">Morning Peaks 早高峰</div>
      <div className="space-y-4">
        {SH_DATA.morning.map((m, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {m.times.map(t => (
              <div key={t} className={`py-2 rounded-xl text-center text-sm font-bold border ${nextBusInfo?.time === t ? 'bg-brand text-white border-brand' : 'bg-gray-50 text-gray-600 border-transparent'}`}>
                {t}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>

    <div className="grid grid-cols-2 gap-8">
      <section>
        <div className="text-[10px] font-bold text-gray-400 mb-4 tracking-widest uppercase italic">Off-Peak 平峰</div>
        <div className="grid grid-cols-2 gap-2">
          {SH_DATA.offPeak.map(t => (
            <div key={t} className={`py-2 rounded-lg text-center text-xs font-mono border ${nextBusInfo?.time === t ? 'bg-brand text-white border-brand' : 'bg-gray-50 text-gray-400 border-transparent'}`}>
              {t}
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="text-[10px] font-bold text-gray-400 mb-4 tracking-widest uppercase italic">Evening Peaks 晚高峰</div>
        <div className="grid grid-cols-2 gap-2">
          {SH_DATA.evening.map(t => (
            <div key={t} className={`py-2 rounded-lg text-center text-xs font-mono border ${nextBusInfo?.time === t ? 'bg-brand text-white border-brand' : 'bg-brand/5 text-brand border-brand/20'}`}>
              {t}
            </div>
          ))}
        </div>
      </section>
    </div>
    
    <div className="p-6 bg-gray-50 rounded-[2rem] text-[11px] text-gray-400 font-light leading-relaxed">
      <p>• 运行时间约15分钟，建议提前5分钟候车</p>
      <p>• 晚高峰 17:30 班次到达中科路后不返回园区</p>
    </div>
  </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] overflow-hidden max-w-3xl w-full relative group"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 z-10 bg-black/10 hover:bg-black/80 transition-colors p-3 rounded-full text-white"
                onClick={() => setShowSchedule(false)}
              >
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
              <div className="p-1 text-center bg-surface">
                 <img src={IMAGES.SHUTTLE_SCHEDULE} alt="Schedule" className="w-full h-auto rounded-2xl" />
              </div>
              <div className="py-8 px-10 flex justify-between items-center bg-white">
                <div>
                   <h5 className="text-xl font-bold mb-1">班车时刻表</h5>
                   <p className="text-xs text-ink-secondary">SHUTTLE SERVICE TIMETABLE</p>
                </div>
                <div className="text-sm font-medium bg-surface px-4 py-2 rounded-full">工作日有效</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Helper Components ---

function DetailsScreen({ type, onBack, onNext, onShowSchedule }: { type: 'driving'|'subway'|'ridehailing', onBack:()=>void, onNext:()=>void, onShowSchedule:()=>void,
  nextBusInfo: any // }) {
  const [shuttleStatus, setShuttleStatus] = useState('巴士行驶中');

  // --- 新增：倒计时逻辑 ---
  const [nextBusInfo, setNextBusInfo] = useState(null);

  useEffect(() => {
    if (type !== 'subway') return;
    const calculateNextBus = () => {
      const now = new Date();
      if (now.getDay() === 0 || now.getDay() === 6) return; // 周末不计

      const currentTime = now.getHours() * 60 + now.getMinutes();
      // 展平所有时间点
      const allTimes = [
        ...SH_DATA.morning.flatMap(m => m.times),
        ...SH_DATA.offPeak,
        ...SH_DATA.evening
      ];

      const upcoming = allTimes
        .map(t => {
          const [h, m] = t.split(':').map(Number);
          return { string: t, minutes: h * 60 + m };
        })
        .find(t => t.minutes > currentTime);

      if (upcoming) {
        setNextBusInfo({ time: upcoming.string, countdown: upcoming.minutes - currentTime });
      }
    };

    calculateNextBus();
    const timer = setInterval(calculateNextBus, 30000); // 30秒更新一次
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (type !== 'subway') return;
    
    const statuses = [
      '即将到站 (约 2 分钟)',
      '巴士行驶中',
      '即将到站 (约 1 分钟)',
      '站点等候中...',
      '巴士行驶中'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setShuttleStatus(statuses[i]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [type]);

  const handleStartNavigation = () => {
    // Xuanren Tech coordinates (approximate for Pudong Changfei Rd 186)
    // Destination address: 上海市浦东新区昌飞路186号
    const destination = encodeURIComponent("上海市浦东新区昌飞路186号玄刃科技");
    

  const content = {
    driving: {
       title: "驾车前往",
       steps: [
         {
           tag: "DESTINATION",
           title: "浦东新区昌飞路 186 号",
           desc: "请导航至「上海城市网邻」，建议从「城市网邻北門」進入地下室。",
           img: IMAGES.CAMPUS_MODEL
         },
         {
           tag: "PARKING",
           title: "建议停至园区地下二层",
           desc: "入库后请沿指引行驶至3号楼商业区 寻找玄刃科技标识。收费标准：首小时免费，后面10元/小时",
           img: IMAGES.BASEMENT_ENTRY,
           highlight: true
         }
       ]
    },
    subway: {
       title: "地铁接驳",
       steps: [
         {
           tag: "METRO STATION",
           title: "13 号线 中科路站",
           desc: "到达终点站后请由 4 号口出站。出站即可见接驳车站牌。",
           img: IMAGES.SUBWAY_EXIT
         },
          {
            tag: "SHUTTLE BUS",
            title: "城市网邻专属接驳车",
            desc: "认准「浦东公交」与「城市网邻」字样。车次参考时间表。",
            custom: (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4 aspect-video">
      <div className="bg-surface rounded-3xl flex items-center justify-center p-4">
        <img src={IMAGES.SHUTTLE_BUS} alt="Bus" className="h-full object-contain" />
      </div>
      <div className="bg-surface rounded-3xl overflow-hidden cursor-pointer" onClick={onShowSchedule}>
        <img src={IMAGES.SHUTTLE_SCHEDULE} alt="Schedule" className="w-full h-full object-cover" />
      </div>
    </div>
    
    {/* 动态倒计时卡片 */}
    <div className="flex items-center gap-4 px-6 py-5 bg-brand/5 rounded-[2rem] border border-brand/10">
      <div className="relative flex">
        <div className="w-2.5 h-2.5 bg-brand rounded-full"></div>
        <div className="absolute w-2.5 h-2.5 bg-brand rounded-full animate-ping"></div>
      </div>
      <div className="flex-1 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] text-brand/60 font-bold uppercase tracking-widest leading-none mb-1">Next Shuttle</span>
          <span className="text-lg font-bold text-brand font-mono">{nextBusInfo ? nextBusInfo.time : "运营结束"}</span>
        </div>
        {nextBusInfo && (
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">预计等待</div>
            <div className="text-2xl font-black text-ink tracking-tighter">
              {nextBusInfo.countdown}<span className="text-xs ml-1">MIN</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
),
            ),
            button: { label: "查看班车时刻表", onClick: onShowSchedule }
          }
       ]
    },
    ridehailing: {
       title: "网约出租车",
       steps: [
         {
           tag: "LOCATION",
           title: "上海浦东新区张江规划八路",
           desc: "搜索上述地址或「上海玄刃智能科技」可直接定点至大门。",
           button: { label: "在地图中定位", onClick: handleStartNavigation }
         },
         {
           tag: "RECOGNITION",
           title: "白色精神堡垒 Logo",
           desc: "车辆可直达入口。下车后认准白色精神堡垒地标即可进入大厅。"
         }
       ]
    }
  }[type];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-60"
    >
      <div className="apple-container pt-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-32 text-center"
        >
          <div className="text-[12px] font-bold text-brand uppercase tracking-[0.4em] mb-4">Visit Guide</div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#333333] mb-6">{content.title}</h2>
          <div className="h-1 w-12 bg-brand mx-auto rounded-full opacity-60"></div>
        </motion.div>
        {content.steps.map((step, i) => (
          <motion.section 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-32 items-center`}
          >
            <div className="flex-1 space-y-10 text-center lg:text-left">
               <div className="inline-block px-4 py-1.5 bg-surface rounded-full text-[10px] font-bold tracking-[0.2em] text-ink-secondary mb-2">{step.tag}</div>
               <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">{step.title}</h3>
               <p className="text-base sm:text-lg md:text-xl text-ink-secondary font-light leading-relaxed max-w-xl mx-auto lg:mx-0">{step.desc}</p>
               {step.button && (
                 <button 
                  onClick={step.button.onClick}
                  className="flex items-center gap-2 text-brand font-semibold border-b-2 border-brand/20 pb-1 hover:border-brand transition-all mx-auto lg:mx-0"
                 >
                   {step.button.label} <ArrowRight className="w-4 h-4" />
                 </button>
               )}
            </div>

            <div className="flex-1 w-full max-w-xl">
               {step.custom ? (
                 <div className="w-full">{step.custom}</div>
               ) : step.img ? (
                 <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-black">
                   <img src={step.img} alt="guide" className="w-full aspect-[4/3] object-cover opacity-90 transition-transform duration-[2s] hover:scale-105" />
                   {step.highlight && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1/3 aspect-square border-2 border-white/40 rounded-full animate-ping"></div>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="w-full aspect-square bg-surface rounded-[3rem] flex items-center justify-center border border-black/[0.02]">
                    <Navigation className="w-20 h-20 text-brand/20" />
                 </div>
               )}
            </div>
          </motion.section>
        ))}
      </div>

      <footer className="fixed bottom-12 left-0 right-0 flex justify-center z-40 px-6">
        <button 
          onClick={onNext}
          className="group px-16 py-6 bg-ink text-white rounded-full font-bold tracking-tight text-lg hover:bg-brand transition-all shadow-2xl active:scale-95 flex items-center gap-4"
        >
          我已到达 <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
        </button>
      </footer>
    </motion.div>
  );
}
