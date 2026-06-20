import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Zap, Users, Coins, MessageSquare, ChevronDown, CheckSquare, Gamepad2, RefreshCw, ClipboardList, ShoppingBag, Menu, X, ExternalLink, BookOpen, Search, ArrowLeft, Clock, Award } from "lucide-react";
import { SmilingCharacter } from "./components/SmilingCharacter";
import { ALL_BLOG_ARTICLES, FEATURED_ARTICLES, BLOG_CATEGORIES, BlogArticle, getBlogSlug } from "./data/blogData";

const faqData = [
  {
    question: "Nexvy par account kaise banayein?",
    answer: "Nexvy par account banana bohot asaan hai. Google ya Facebook se login karke bhi aap apna account activate kar sakte hain."
  },
  {
    question: "Nexvy par paise kaise kamayein?",
    answer: "Paise kamane ke bohot saare tarike hain:\n• Surveys fill karein.\n• Short videos dekhein.\n• Apps aur games try karein.\n• Naye tasks complete karein."
  },
  {
    question: "Kya Nexvy free hai?",
    answer: "Haan, Nexvy ek free app hai. Kisi bhi feature ko use karne ke liye aapko koi charge nahi dena padega."
  },
  {
    question: "Kitne paise hone par main withdrawal kar sakta hoon?",
    answer: "Withdrawal limit bohot kam rakhi gayi hai, taaki aap jaldi apne paise nikal sakein. Zyada jaankari ke liye app mein 'Withdraw' section dekhein."
  },
  {
    question: "Nexvy par customer support se kaise contact karein?",
    answer: "Agar aapko koi help chahiye, toh app ke 'Support' ya 'Contact Us' page par jaakar humein message kar sakte hain. Hum jaldi se jaldi aapke sawal ka jawab dene ki koshish karenge."
  },
  {
    question: "Kya shopping cashback bhi deta hai?",
    answer: "Yes, nexvy aapko har shopping par 100% tak cashback and discount deta hai."
  }
];

export default function App() {
  const [clicked, setClicked] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'blogs'>('home');
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState("All Guides");
  const [expandedArticle, setExpandedArticle] = useState<BlogArticle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to match an article by its slug when loading from URL hash/route
  const matchArticleBySlug = (slug: string): BlogArticle | undefined => {
    // Try to match the slug directly
    let match = ALL_BLOG_ARTICLES.find(a => getBlogSlug(a.title, a.id) === slug);
    if (match) return match;
    match = FEATURED_ARTICLES.find(a => getBlogSlug(a.title, a.id) === slug);
    if (match) return match;

    // Fallback extraction of ID from the trailing part of the slug (e.g. "how-to-make-money-online-1" matches ID 1)
    const lastDashIdx = slug.lastIndexOf('-');
    if (lastDashIdx !== -1) {
      const idVal = parseInt(slug.substring(lastDashIdx + 1));
      if (!isNaN(idVal)) {
        return ALL_BLOG_ARTICLES.find(a => a.id === idVal) || FEATURED_ARTICLES.find(a => a.id === idVal);
      }
    }
    return undefined;
  };

  // Helper to parse double asterisks **bold** in a line
  const parseInlineBold = (lineText: string) => {
    const parts = lineText.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return lineText;
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Odd indices are between **bold**
        return (
          <strong 
            key={`bold-${index}`} 
            className="font-black text-[#ebd02a] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5 inline-block sm:inline"
          >
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  // Helper to parse line-by-line of blog content, converting markdown bold syntax and bullets to styled React components
  const renderParsedContent = (text: string) => {
    if (!text) return null;
    
    // Split into paragraphs/lines
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        // Return an empty paragraph spacing
        return <div key={`empty-${lineIdx}`} className="h-3" />;
      }

      // Check if it's a subheading (e.g. starting with "###" or "##")
      if (trimmed.startsWith('###')) {
        const headingText = trimmed.replace(/^###\s*/, '');
        return (
          <h3 
            key={`h3-${lineIdx}`} 
            className="font-sans font-black text-lg sm:text-xl text-[#ebd02a] tracking-tight mt-6 mb-2 text-left"
          >
            {parseInlineBold(headingText)}
          </h3>
        );
      }
      
      if (trimmed.startsWith('##')) {
        const headingText = trimmed.replace(/^##\s*/, '');
        return (
          <h2 
            key={`h2-${lineIdx}`} 
            className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight mt-8 mb-3 text-left border-l-4 border-[#ebd02a] pl-3"
          >
            {parseInlineBold(headingText)}
          </h2>
        );
      }

      // Check if it's a bullet item starting with "-" or "*"
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const itemText = trimmed.replace(/^[-*]\s*/, '');
        return (
          <div 
            key={`bullet-${lineIdx}`} 
            className="flex items-start gap-2.5 my-2.5 ml-2 text-left text-white/90 text-sm sm:text-base leading-relaxed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ebd02a] shrink-0 mt-2.5" />
            <span className="flex-1">
              {parseInlineBold(itemText)}
            </span>
          </div>
        );
      }

      // Default paragraph
      return (
        <p 
          key={`p-${lineIdx}`} 
          className="text-white/85 text-sm sm:text-base leading-relaxed text-left font-sans font-normal"
        >
          {parseInlineBold(trimmed)}
        </p>
      );
    });
  };

  // Sync state with hash route changes on mount or URL changes (Client-side Router)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        const matched = matchArticleBySlug(slug);
        if (matched) {
          setCurrentView('blogs');
          setExpandedArticle(matched);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setCurrentView('blogs');
          setExpandedArticle(null);
        }
      } else if (hash === '#/blog' || hash === '#/blogs') {
        setCurrentView('blogs');
        setExpandedArticle(null);
      } else {
        setCurrentView('home');
        setExpandedArticle(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update HTML document title, meta tags, social signals, and inject dynamic structured JSON-LD schemas for maximum AI/Serp indexing
  useEffect(() => {
    let title = "Nexvy.in - Smart Pocket Money & Rewarding Daily Coins";
    let desc = "Nexvy is India's premier high-paying reward platform. Complete custom daily microtasks, fast online surveys, interactive games, and lucky spins to earn coins instantly. Cashout to Google Pay, PhonePe, or PayPal with 100% automated payouts.";
    let canonical = "https://nexvy.in/";
    let schemaMarkup: any = null;

    if (currentView === 'blogs' && expandedArticle) {
       const slug = getBlogSlug(expandedArticle.title, expandedArticle.id);
       title = `${expandedArticle.title} | Nexvy Blog`;
       desc = `${expandedArticle.subheading} Read the complete tutorial on Nexvy Blog to earn daily pocket money under 5 minutes today.`;
       canonical = `https://nexvy.in/#/blog/${slug}`;

       schemaMarkup = {
         "@context": "https://schema.org",
         "@type": "TechArticle",
         "@id": `${canonical}#article`,
         "headline": expandedArticle.title,
         "alternativeHeadline": expandedArticle.subheading,
         "description": desc,
         "genre": "Earning Solution Tutorial",
         "keywords": `nexvy, earning guide, extra cash, ${expandedArticle.category.toLowerCase()}, microjobs`,
         "wordCount": expandedArticle.content.split(/\s+/).length + 100,
         "datePublished": "2026-01-15T08:00:00+05:30",
         "dateModified": "2026-06-20T08:00:00+05:30",
         "mainEntityOfPage": canonical,
         "author": {
           "@type": "Person",
           "name": "Nexvy Premium Growth Team",
           "jobTitle": "Automated Reward Infrastructure Specialist"
         },
         "publisher": {
           "@type": "Organization",
           "name": "Nexvy",
           "logo": {
             "@type": "ImageObject",
             "url": "https://nexvy.in/assets/logo.png"
           }
         },
         "image": "https://nexvy.in/assets/reward-banner.jpg"
       };
    } else if (currentView === 'blogs') {
       title = "Earning Blog Hub (200+ Master Guides) | Nexvy.in";
       desc = "Explore our verified collection of 200+ digital rewards and income tutorials. Complete guided walkthroughs on daily tasks, online surveys, and gaming rewards.";
       canonical = "https://nexvy.in/#/blog";

       schemaMarkup = {
         "@context": "https://schema.org",
         "@type": "ItemList",
         "name": "Nexvy Master Earning Guides Directory",
         "description": desc,
         "url": canonical,
         "numberOfItems": ALL_BLOG_ARTICLES.length,
         "itemListElement": ALL_BLOG_ARTICLES.slice(0, 15).map((art, index) => ({
           "@type": "ListItem",
           "position": index + 1,
           "url": `https://nexvy.in/#/blog/${getBlogSlug(art.title, art.id)}`,
           "name": art.title
         }))
       };
    } else {
       title = "Nexvy.in - Smart Pocket Money & Rewarding Daily Coins";
       desc = "Nexvy is India's premier high-paying reward platform. Complete custom daily microtasks, fast online surveys, interactive games, and lucky spins to earn coins instantly.";
       canonical = "https://nexvy.in/";

       schemaMarkup = {
         "@context": "https://schema.org",
         "@graph": [
           {
             "@type": "WebSite",
             "@id": "https://nexvy.in/#website",
             "url": "https://nexvy.in/",
             "name": "Nexvy.in",
             "description": "Smart Pocket Money & Rewarding Daily Coins in India",
             "publisher": {
               "@id": "https://nexvy.in/#organization"
             }
           },
           {
             "@type": "Organization",
             "@id": "https://nexvy.in/#organization",
             "name": "Nexvy",
             "url": "https://nexvy.in/",
             "logo": {
               "@type": "ImageObject",
               "url": "https://nexvy.in/assets/logo.png",
               "caption": "Nexvy Logo"
             }
           },
           {
             "@type": "Product",
             "@id": "https://nexvy.in/#product",
             "name": "Nexvy App",
             "image": "https://nexvy.in/assets/reward-banner.jpg",
             "description": "Complete simple daily microtasks, fast surveys, spin rewards, and make money online effortlessly.",
             "brand": {
               "@type": "Brand",
               "name": "Nexvy"
             },
             "offers": {
               "@type": "Offer",
               "price": "0.00",
               "priceCurrency": "INR",
               "availability": "https://schema.org/InStock"
             }
           },
           {
             "@type": "FAQPage",
             "@id": "https://nexvy.in/#faq",
             "mainEntity": faqData.map(f => ({
               "@type": "Question",
               "name": f.question,
               "acceptedAnswer": {
                 "@type": "Answer",
                 "text": f.answer.replace(/\n•/g, "<br>•")
               }
             }))
           }
         ]
       };
    }

    // Apply document title
    document.title = title;

    // Helper to set/update metadata attribute tag helper
    const updateMetaTag = (selector: string, attrName: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith("meta[name=")) {
          const match = selector.match(/meta\[name=['"]?([^'"]+)['"]?\]/);
          if (match) element.setAttribute('name', match[1]);
        } else if (selector.startsWith("meta[property=")) {
          const match = selector.match(/meta\[property=['"]?([^'"]+)['"]?\]/);
          if (match) element.setAttribute('property', match[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attrName, value);
    };

    // Helper to set/update link canonical tags helper
    const updateLinkTag = (selector: string, rel: string, hrefValue: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefValue);
    };

    // Update metadata elements dynamically
    updateMetaTag("meta[name='description']", "content", desc);
    updateLinkTag("link[rel='canonical']", "canonical", canonical);
    
    // OG parameters for real-time link preview optimization
    updateMetaTag("meta[property='og:title']", "content", title);
    updateMetaTag("meta[property='og:description']", "content", desc);
    updateMetaTag("meta[property='og:url']", "content", canonical);
    updateMetaTag("meta[property='og:type']", "content", (currentView === 'blogs' && expandedArticle) ? 'article' : 'website');
    
    // Twitter elements synchronization 
    updateMetaTag("meta[name='twitter:title']", "content", title);
    updateMetaTag("meta[name='twitter:description']", "content", desc);

    // Dynamic JSON-LD script container updates for AEO indexing
    const jsonldScript = document.getElementById('jsonld-schema');
    if (jsonldScript && schemaMarkup) {
       jsonldScript.textContent = JSON.stringify(schemaMarkup, null, 2);
    }
  }, [currentView, expandedArticle]);

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
  };

  const scrollToSection = (id: string) => {
    setCurrentView('home');
    setExpandedArticle(null);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#4d935e] via-[#3a7c4c] to-[#2b643a] text-white font-sans flex flex-col justify-between p-6 sm:p-12 md:p-16 select-none relative overflow-hidden selection:bg-[#f2cf29] selection:text-[#183120]">
      
      {/* --- ORGANIC AMBIENT GREEN BACKGROUND WAVES (Replicating Screenshot Swirls across full viewport) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Top-Right Smooth Curve */}
        <svg className="absolute top-[-10%] right-[-10%] w-[80%] h-[60%] opacity-25" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0 C250 150, 400 50, 500 200 L500 0 Z" fill="#1e4e2c" />
        </svg>

        {/* S-Shape Dynamic Sweeping Ribbon */}
        <svg className="absolute top-[20%] left-[-10%] w-[90%] h-[70%] opacity-[0.16]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 150 C200 350, 250 -50, 500 250 L500 500 L0 500 Z" fill="#15361e" />
        </svg>

        {/* Bottom Sweeping Wave */}
        <svg className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[50%] opacity-[0.18]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400 C150 250, 250 380, 400 200 L400 400 Z" fill="#1b4427" />
        </svg>

        {/* Additional background abstract highlights matching the light green radial glow */}
        <div className="absolute top-[30%] left-[25%] w-[450px] h-[450px] rounded-full bg-[#5cb373]/15 blur-[120px]" />
      </div>

      {/* --- HEADER ZONE (Full screen top) --- */}
      <header className="relative z-50 w-full max-w-7xl mx-auto flex items-center justify-between pb-4 border-b border-white/5">
        <button 
          onClick={() => { window.location.hash = "#/"; }}
          className="font-sans font-extrabold tracking-tight text-white text-xl sm:text-2xl opacity-95 select-none hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <span className="bg-[#e8ca2c] text-[#1e4629] px-2.5 py-0.5 rounded-lg text-sm sm:text-base font-black">N</span>
          Nexvy.in
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button 
            onClick={() => { window.location.hash = "#/"; }}
            className={`text-xs lg:text-[13.5px] font-medium transition-all duration-250 cursor-pointer font-sans ${currentView === 'home' ? 'text-[#ebd02a] font-bold' : 'text-white/85 hover:text-[#ebd02a]'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { window.location.hash = "#/blog"; }}
            className={`text-xs lg:text-[13.5px] font-bold transition-all duration-250 cursor-pointer font-sans flex items-center gap-1.5 ${currentView === 'blogs' ? 'text-[#ebd02a] bg-white/10 px-3 py-1 rounded-lg' : 'text-white/85 hover:text-[#ebd02a]'}`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-[#ebd02a]" />
            Blog Hub (200+ Guides)
          </button>
          <button 
            onClick={() => scrollToSection("earning-methods-section")}
            className="text-xs lg:text-[13.5px] font-medium text-white/85 hover:text-[#ebd02a] transition-all duration-250 cursor-pointer font-sans"
          >
            How to make money by nexvy
          </button>
          <button 
            onClick={() => scrollToSection("payment-methods-showcase")}
            className="text-xs lg:text-[13.5px] font-medium text-white/85 hover:text-[#ebd02a] transition-all duration-250 cursor-pointer font-sans"
          >
            Payout Methods
          </button>
          <button 
            onClick={() => scrollToSection("faq-accordion-section")}
            className="text-xs lg:text-[13.5px] font-medium text-white/85 hover:text-[#ebd02a] transition-all duration-250 cursor-pointer font-sans"
          >
            FAQs
          </button>
          
          <motion.a
            href="https://app.nexvy.in/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4.5 py-2 bg-[#e8ca2c] hover:bg-[#ebd02a] text-[#1e4629] font-sans font-bold text-xs lg:text-[13px] tracking-wide rounded-lg shadow-md hover:shadow-lg transition-all duration-250 flex items-center gap-1.5 cursor-pointer uppercase"
          >
            Get Started
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.a>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#ebd02a] focus:outline-none cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute top-16 left-0 right-0 z-50 bg-[#255432]/95 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 backdrop-blur-lg md:hidden"
            >
              <button 
                onClick={() => { window.location.hash = "#/"; setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm font-medium text-white hover:text-[#ebd02a] transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => { window.location.hash = "#/blog"; setMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold text-[#ebd02a] flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#ebd02a]" />
                Blog Hub (200+ Guides)
              </button>
              <button 
                onClick={() => scrollToSection("earning-methods-section")}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm font-medium text-white hover:text-[#ebd02a] transition-colors"
              >
                How to make money by nexvy
              </button>
              <button 
                onClick={() => scrollToSection("payment-methods-showcase")}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm font-medium text-white hover:text-[#ebd02a] transition-colors"
              >
                Payout Methods
              </button>
              <button 
                onClick={() => scrollToSection("faq-accordion-section")}
                className="w-full text-left py-2 px-3 hover:bg-white/5 rounded-lg text-sm font-medium text-white hover:text-[#ebd02a] transition-colors"
              >
                FAQs
              </button>

              <div className="pt-2 border-t border-white/10">
                <a
                  href="https://app.nexvy.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#e8ca2c] hover:bg-[#ebd02a] text-[#1e4629] font-sans font-bold text-center text-sm tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                >
                  Get Started
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- MAIN HERO BODY ZONE --- */}
      {/* Flexible layout: Stacked on mobile/portrait viewports, split side-by-side on wide screens */}
      <main className={`relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center gap-10 lg:gap-16 my-6 sm:my-10 ${currentView === 'home' ? 'lg:flex-row' : ''}`}>
        
        {currentView === 'home' ? (
          <>
            {/* Left Interactive Character Column */}
            <section className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-[340px] sm:max-w-[460px]">
                <SmilingCharacter />
              </div>
            </section>

        {/* Right Info and Copy Content Column */}
        <section className="w-full lg:w-1/2 flex flex-col justify-center items-start gap-6 sm:gap-8 order-2 lg:order-1 text-left">
          
          {/* Header Typography exactly: How To Earn Money Online? */}
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="font-display font-extrabold text-[38px] sm:text-[54px] md:text-[64px] leading-[1.08] tracking-[-0.02em] text-white"
            >
              How To Earn <br />
              <span className="text-white">Money Online?</span>
            </motion.h1>
          </div>

          {/* Description Paragraph body text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-[14px] sm:text-[16px] md:text-[18px] text-white/90 leading-relaxed font-normal tracking-[0.012em] max-w-xl"
          >
            You can earn money on nexvy by completing surveys, watching videos, doing online tasks, referring others, and participating in offers and promotions.
          </motion.p>

          {/* Action Row containing yellow pill button and circular arrow */}
          <div className="w-full max-w-xl flex items-center justify-between pt-4 gap-6">
            
            {/* EARN MONEY Button */}
            <motion.a
              id="earn-money-btn"
              href="https://app.nexvy.in/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.3 }}
              className="px-8 py-3.5 bg-[#e8ca2c] hover:bg-[#ebd02a] active:bg-[#d6b71f] text-[#1e4629] font-sans font-bold text-[13px] sm:text-sm tracking-wider rounded-xl shadow-[0_12px_24px_rgba(232,202,44,0.3)] hover:shadow-[0_16px_32px_rgba(232,202,44,0.4)] transition-all duration-300 uppercase cursor-pointer relative overflow-hidden flex items-center justify-center"
            >
              <AnimatePresence>
                {clicked && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white rounded-xl pointer-events-none"
                  />
                )}
              </AnimatePresence>
              Earn Money
            </motion.a>

            {/* Bottom-Right Circle Arrow & Accents */}
            <div className="flex flex-col items-center gap-2">
              <motion.a 
                id="earn-arrow-btn"
                href="https://app.nexvy.in/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-white flex items-center justify-center cursor-pointer group shadow-[0_8px_16px_rgba(255,255,255,0.1)] transition-colors duration-300 hover:bg-white/10"
              >
                <svg 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="stroke-white stroke-[3.5] stroke-linecap-round stroke-linejoin-round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.a>

              {/* Decor Sparkle Star underneath circle arrow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                className="text-white/80 self-end mr-[-4px] mt-0.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
                </svg>
              </motion.div>
            </div>

          </div>

          {/* --- PAYMENT METHODS SECTION (Below Earn Money action row) --- */}
          <motion.div
            id="payment-methods-showcase"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="w-full max-w-xl mt-4 p-4 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col gap-3 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-widest font-semibold">Instant Daily Payouts</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8ca2c] animate-pulse"></span>
                <span className="text-[10px] text-[#e8ca2c] font-sans font-medium">Auto-Processed</span>
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* PhonePe Box */}
              <motion.div
                id="payment-box-phonepe"
                whileHover={{ scale: 1.04, y: -2, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 border border-white/5 hover:border-[#5f259f]/50 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                {/* PhonePe Original Logo Vector */}
                <div className="w-9 h-9 rounded-lg bg-[#5f259f] flex items-center justify-center shrink-0 shadow-md shadow-[#5f259f]/30">
                  <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 35H80M20 50H65M45 15V80 C45 86 32 86 32 86" stroke="white" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M56 50 L74 77" stroke="white" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[11px] sm:text-xs font-bold text-white leading-tight font-display">PhonePe</div>
                  <div className="text-[9px] text-white/40 font-mono">Instant</div>
                </div>
              </motion.div>

              {/* Google Pay Box */}
              <motion.div
                id="payment-box-gpay"
                whileHover={{ scale: 1.04, y: -2, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 border border-white/5 hover:border-emerald-500/30 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                {/* Google Pay Original Multi-colored G Logo */}
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-md">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[11px] sm:text-xs font-bold text-white leading-tight font-display">G Pay</div>
                  <div className="text-[9px] text-white/40 font-mono">Secure</div>
                </div>
              </motion.div>

              {/* PayPal Box */}
              <motion.div
                id="payment-box-paypal"
                whileHover={{ scale: 1.04, y: -2, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 border border-white/5 hover:border-blue-500/30 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                {/* PayPal Original Interlocking double-P Logo */}
                <div className="w-9 h-9 rounded-lg bg-[#003087] flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <svg viewBox="0 0 24 28" className="w-[13px] h-[15px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3 22.8H6.5L3 1.5H12C15.8 1.5 18.5 2.5 19.5 5.5C20.5 8.5 19.5 11.5 16.5 13.5C14.5 15 12.5 15.5 11.3 15.5L11.3 22.8Z" fill="#ffffff" opacity="0.9" />
                    <path d="M15.3 26.3H10.5L7.2 5H16.2C20 5 22.7 6 23.7 9C24.7 12 23.7 15 20.7 17C18.7 18.5 16.7 19 15.5 19L15.3 26.3Z" fill="#0079C1" />
                    <path d="M11.3 15.5C12.5 15.5 14.5 15 16.5 13.5C19.5 11.5 20.5 8.5 19.5 5.5C18.5 2.5 15.8 1.5 12 1.5H7.2L11.3 15.5Z" fill="#002157" opacity="0.3" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[11px] sm:text-xs font-bold text-white leading-tight font-display">PayPal</div>
                  <div className="text-[9px] text-white/40 font-mono">Global</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* --- HOW TO EARN / MULTIPLE EARNING WAYS SECTION (SEO Optimized) --- */}
          <motion.div
            id="earning-methods-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-4xl mt-12 pt-8 border-t border-white/10 text-left"
          >
            {/* Header & SEO Small Text on how to earn money */}
            <div id="earning-methods-header" className="mb-6">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
                <Coins className="w-6 h-6 text-[#ebd02a] shrink-0" />
                Nexvy Par Paise Kaise Kamayein?
              </h2>
              <p className="text-xs sm:text-[13.5px] text-white/70 leading-relaxed font-normal mt-2 max-w-2xl">
                Nexvy ek online reward platform hai jahan aap bina koi investment ke daily free money aur bonus cashback rewards kama sakte hain. Niche diye gaye aasan tarikon se short tasks pure karein, real-time games khelein, daily tasks complete karein aur automatic fast daily payouts withdraw karein!
              </p>
            </div>

            {/* Grid for 6 beautiful boxes */}
            <div id="earning-methods-grid" className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5">
              
              {/* Box 1: Task */}
              <motion.div
                id="earn-box-task"
                whileHover={{ scale: 1.04, y: -3, borderColor: "rgba(235, 208, 42, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer group"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/10 shrink-0">
                  <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ebd02a] transition-colors duration-200">1. Extra Tasks</h3>
                  <p className="text-[11px] sm:text-[12.5px] text-white/75 leading-normal font-normal">
                    Simple sponsored tasks aur website visits pure karke high coins claim karein.
                  </p>
                </div>
              </motion.div>

              {/* Box 2: Game */}
              <motion.div
                id="earn-box-game"
                whileHover={{ scale: 1.04, y: -3, borderColor: "rgba(235, 208, 42, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer group"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/10 shrink-0">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ebd02a] transition-colors duration-200">2. Free Games</h3>
                  <p className="text-[11px] sm:text-[12.5px] text-white/75 leading-normal font-normal">
                    Bina tension arcade aur simple logical games khele aur high levels par coins payein.
                  </p>
                </div>
              </motion.div>

              {/* Box 3: Lucky Spin */}
              <motion.div
                id="earn-box-spin"
                whileHover={{ scale: 1.04, y: -3, borderColor: "rgba(235, 208, 42, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer group"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/10 shrink-0">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-[spin_8s_linear_infinite] group-hover:animate-[spin_2.s_linear_infinite]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ebd02a] transition-colors duration-200">3. Lucky Spin</h3>
                  <p className="text-[11px] sm:text-[12.5px] text-white/75 leading-normal font-normal">
                    Daily rewards wheel ghumaayein aur har spin par guarantee cash bonus points payein.
                  </p>
                </div>
              </motion.div>

              {/* Box 4: Survey */}
              <motion.div
                id="earn-box-survey"
                whileHover={{ scale: 1.04, y: -3, borderColor: "rgba(235, 208, 42, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer group"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/10 shrink-0">
                  <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ebd02a] transition-colors duration-200">4. Paid Surveys</h3>
                  <p className="text-[11px] sm:text-[12.5px] text-white/75 leading-normal font-normal">
                    Aasan interactive feedback surveys ka answer karein aur premium wallets rewards unlock karein.
                  </p>
                </div>
              </motion.div>

              {/* Box 5: Daily Gift */}
              <motion.div
                id="earn-box-gift"
                whileHover={{ scale: 1.04, y: -3, borderColor: "rgba(235, 208, 42, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer group"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/10 shrink-0">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ebd02a] transition-colors duration-200">5. Daily Gift Box</h3>
                  <p className="text-[11px] sm:text-[12.5px] text-white/75 leading-normal font-normal">
                    Bina extra mehnat, har 24 ghante mein click karke apna high worth claim points claim karein.
                  </p>
                </div>
              </motion.div>

              {/* Box 6: Shopping Rewards */}
              <motion.div
                id="earn-box-shopping"
                whileHover={{ scale: 1.04, y: -3, borderColor: "rgba(235, 208, 42, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer group"
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/10 shrink-0">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ebd02a] transition-colors duration-200">6. Shopping Rewards</h3>
                  <p className="text-[11px] sm:text-[12.5px] text-white/75 leading-normal font-normal">
                    Popular online brand portals par shopping karein aur 100% tak instant cashback payein.
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* --- BENEFITS / FEATURES SECTION --- */}
          <motion.div 
            id="benefits-benefit-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl mt-10 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Box 1: Generous Bonuses */}
            <motion.div 
              id="benefit-box-bonuses" 
              whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors duration-200 shadow-md backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-white/15 text-[#e8ca2c] border border-white/10 shadow-sm">
                <Gift className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-white">Generous Bonuses</h3>
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal">
                  Each day AND week the top earners get a generous performance bonus on top of the rewards they have earned!
                </p>
              </div>
            </motion.div>

            {/* Box 2: Start Earning Instantly */}
            <motion.div 
              id="benefit-box-instant" 
              whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors duration-200 shadow-md backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-white/15 text-[#e8ca2c] border border-white/10 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-white">Start Earning Instantly</h3>
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal">
                  No approval process required for new sign ups, you can just sign up in 5 seconds and start earning instantly!
                </p>
              </div>
            </motion.div>

            {/* Box 3: Referral Program */}
            <motion.div 
              id="benefit-box-referral" 
              whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors duration-200 shadow-md backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-white/15 text-[#e8ca2c] border border-white/10 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-white">Referral Program</h3>
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal">
                  We have a referral program, so you will earn commission on everyone you refer.
                </p>
              </div>
            </motion.div>

            {/* Box 4: Daily Payouts */}
            <motion.div 
              id="benefit-box-payouts" 
              whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors duration-200 shadow-md backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-white/15 text-[#e8ca2c] border border-white/10 shadow-sm">
                <Coins className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-white">Daily Payouts</h3>
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal">
                  We pay everyone DAILY with 6 different payment methods!
                </p>
              </div>
            </motion.div>

            {/* Box 5: Friendly Support Staff */}
            <motion.div 
              id="benefit-box-support" 
              whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors duration-200 shadow-md backdrop-blur-md sm:col-span-2 lg:col-span-1"
            >
              <div className="p-3 rounded-xl bg-white/15 text-[#e8ca2c] border border-white/10 shadow-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-white">Friendly Support Staff</h3>
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal">
                  Need help? Our friendly support staff will answer all of your questions! Don’t wait days for a reply. We’re here to help you earn as much money as possible!
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* --- FAQ SECTION --- */}
          <motion.div 
            id="faq-accordion-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl mt-12 pt-10 border-t border-white/10"
          >
            <div id="faq-header" className="mb-8 text-left">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">Frequently Asked Questions</h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2 max-w-xl font-normal">
                Nexvy ke baare mein sabhi aam sawalon ke jawab yahan payein
              </p>
            </div>

            <div id="faq-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqData.map((faq, index) => {
                const isOpen = activeFaqIndex === index;
                return (
                  <div
                    key={index}
                    id={`faq-item-${index}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 backdrop-blur-md flex flex-col justify-between"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer group"
                    >
                      <span className="font-sans font-bold text-sm sm:text-[15px] text-white group-hover:text-[#ebd02a] transition-colors duration-200">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-white/60 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#ebd02a]" : ""
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs sm:text-[13px] text-white/80 leading-relaxed font-normal whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </section>
        </>
      ) : (
        <section className="w-full text-left flex flex-col gap-6 relative z-10">
          {/* ----- BLOG HUB VIEW EVENT ----- */}
          <motion.div
            id="blog-hub-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col gap-6"
          >
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#ebd02a] shrink-0" />
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest font-semibold font-bold">Nexvy Premium Guides</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Earning Blog Hub <span className="text-[#ebd02a]">(200+ Master Guides)</span>
                </h1>
                <p className="text-white/60 text-xs sm:text-[13px] max-w-xl font-normal">
                  Ghar baithe internet se dher saare coins earn karne, online tasks aur fast payout methods ke secrets seekhein.
                </p>
              </div>
              
              {/* Back to Home action button */}
              <button
                onClick={() => { window.location.hash = "#/"; }}
                className="self-start md:self-center px-4 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 cursor-pointer font-sans transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </button>
            </div>

            {/* IF COMPRESSED OR EXPANDED ARTICLE VIEW */}
            {expandedArticle ? (
              <motion.article
                id={`expanded-article-${expandedArticle.id}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-md flex flex-col gap-6"
              >
                {/* Back button */}
                <button
                  onClick={() => { window.location.hash = "#/blog"; }}
                  className="self-start px-3.5 py-1.5 text-xs font-medium text-[#ebd02a] bg-[#ebd02a]/10 hover:bg-[#ebd02a]/20 border border-[#ebd02a]/20 rounded-lg flex items-center gap-1.5 cursor-pointer font-sans transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles Directory
                </button>

                {/* Banner Gradient Card */}
                <div className={`w-full py-14 px-6 sm:px-12 rounded-2xl bg-gradient-to-r ${expandedArticle.bannerGradient} relative overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-center items-start text-left gap-3 sm:gap-4`}>
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" />
                  <div className="z-10 px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-mono text-[10px] tracking-widest uppercase font-black border border-white/15">
                    {expandedArticle.category}
                  </div>
                  <h1 className="z-10 font-sans font-black text-3xl sm:text-4xl md:text-5xl leading-tight text-white tracking-tight drop-shadow-md">
                    {expandedArticle.title}
                  </h1>
                  <p className="z-10 text-[#ebd02a] text-sm sm:text-base md:text-lg font-black max-w-3xl drop-shadow-sm font-sans tracking-wide leading-relaxed">
                    {expandedArticle.subheading}
                  </p>
                  <div className="z-10 flex flex-wrap items-center gap-3.5 text-white/90 text-xs font-mono mt-3">
                    <span className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-md border border-white/5">
                      <Clock className="w-4 h-4 text-[#ebd02a]" />
                      {expandedArticle.readTime}
                    </span>
                    <span className="hidden sm:inline text-white/50">•</span>
                    <span className="flex items-center gap-1.5 text-[#ebd02a] font-black bg-[#ebd02a]/10 px-2.5 py-1 rounded-md border border-[#ebd02a]/20">
                      ★ Best Reward App Choice
                    </span>
                  </div>
                </div>

                {/* Main Article Content with custom HTML render formatting */}
                <div className="text-white/90 text-sm sm:text-base leading-relaxed max-w-3xl space-y-6 text-left pt-4 pb-8 border-b border-white/10">
                  {renderParsedContent(expandedArticle.content)}
                </div>

                {/* Prominent High-Conversion Call To Action */}
                <div className="p-6 bg-gradient-to-r from-white/[0.04] to-transparent border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 mt-4">
                  <div className="space-y-1.5 text-left w-full md:w-2/3">
                    <h3 className="font-display font-extrabold text-[#ebd02a] text-lg sm:text-xl">Aap kis baari ka wait kar rahe hain?</h3>
                    <p className="text-xs sm:text-[13px] text-white/70 font-normal">
                      Nexvy pure online world mein sabse highest rewards aur Instant continuous payouts dene wali unmatched platform hai. Aaj hi is opportunity ka benefit uthayein aur free daily pocket money withdraw karein via PhonePe, GPay, ya PayPal.
                    </p>
                  </div>
                  <motion.a
                    href="https://app.nexvy.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, shadow: "0px 10px 30px rgba(232, 202, 44, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto px-7 py-3 bg-[#e8ca2c] hover:bg-[#ebd02a] text-[#1e4629] font-sans font-black text-center text-sm tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase shrink-0"
                  >
                    Start Earning on Nexvy App
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  </motion.a>
                </div>
              </motion.article>
            ) : (
              // MAIN ARTICLES DIRECTORY LIST (Expanded article is NULL)
              <div className="flex flex-col gap-6">
                
                {/* Search Bar & Categories Swiper */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                  
                  {/* Category Filter list */}
                  <div className="lg:col-span-2 flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 lg:pb-0 select-none">
                    {BLOG_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedBlogCategory(cat); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                          selectedBlogCategory === cat
                            ? "bg-[#ebd02a] text-[#1e4629]"
                            : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search input field */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search articles & guides..."
                      value={blogSearchQuery}
                      onChange={(e) => { setBlogSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-10 pr-4 py-2 text-xs sm:text-xs bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ebd02a] rounded-xl text-white placeholder-white/40 outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Previews of FEATURED HIGH-VALUE ARTICLES (Visible if no research parameters selected) */}
                {blogSearchQuery === "" && selectedBlogCategory === "All Guides" && (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-display font-extrabold text-[#ebd02a] text-xs uppercase tracking-wider font-semibold">🔥 Featured Recommended Guides</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {FEATURED_ARTICLES.map(featured => (
                        <motion.div
                          key={featured.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          onClick={() => { window.location.hash = `#/blog/${getBlogSlug(featured.title, featured.id)}`; }}
                          className={`rounded-2xl bg-gradient-to-br ${featured.bannerGradient} p-5 sm:p-6 border border-white/10 shadow-lg cursor-pointer flex flex-col justify-between items-start gap-4 text-left transition-all relative overflow-hidden group min-h-[220px]`}
                        >
                          <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:bg-black/0 transition-colors" />
                          <div className="z-10 flex items-center justify-between w-full">
                            <span className="text-[9px] font-mono uppercase bg-white/20 border border-white/15 px-2.5 py-0.5 rounded-md font-bold tracking-widest text-white backdrop-blur-md">
                              {featured.category}
                            </span>
                            <span className="text-[10px] font-mono text-white/80 flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded-md">
                              <Clock className="w-3.5 h-3.5 text-[#ebd02a]" />
                              {featured.readTime}
                            </span>
                          </div>
                          <div className="z-10 space-y-1.5 mt-auto">
                            <h2 className="font-display font-black text-lg sm:text-xl text-white group-hover:text-[#f3dd59] transition-colors duration-200 line-clamp-2 leading-tight font-extrabold">
                              {featured.title}
                            </h2>
                            <p className="text-white/80 text-xs sm:text-[13px] line-clamp-2 font-normal leading-relaxed">
                              {featured.summary}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 200 CURATED BEST BLOGS DIRECTORY STREAM */}
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-white/60">
                      Total Guides Found: {
                        ALL_BLOG_ARTICLES.filter(article => {
                          const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                          const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                          return matchesCategory && matchesSearch;
                        }).length
                      } {selectedBlogCategory !== "All Guides" ? `in "${selectedBlogCategory}"` : ""}
                    </span>
                    <span className="text-[10.5px] font-sans font-medium text-[#ebd02a] flex items-center gap-1 bg-[#ebd02a]/15 px-2.5 py-1 rounded">
                      ★ Daily Earning Insights
                    </span>
                  </div>

                  {ALL_BLOG_ARTICLES.filter(article => {
                    const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                    const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                          article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                          article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ALL_BLOG_ARTICLES.filter(article => {
                        const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                        const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                              article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                              article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      }).slice((currentPage - 1) * 9, currentPage * 9).map(article => (
                        <motion.div
                          key={article.id}
                          id={`blog-card-${article.id}`}
                          whileHover={{ scale: 1.03, y: -2, border: "1px solid rgba(235, 208, 42, 0.3)", backgroundColor: "rgba(255, 255, 255, 0.07)" }}
                          onClick={() => { window.location.hash = `#/blog/${getBlogSlug(article.title, article.id)}`; }}
                          className="bg-white/[0.04] border border-white/5 hover:border-white/15 rounded-2xl p-4.5 flex flex-col gap-3 transition-all duration-200 cursor-pointer group backdrop-blur-md text-left justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[9px] font-mono uppercase bg-[#ebd02a]/15 text-[#ebd02a] border border-[#ebd02a]/20 px-2.5 py-0.5 rounded-md font-bold tracking-widest text-center">
                                {article.category}
                              </span>
                              <span className="text-[10px] font-mono text-white/55 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-white/40" />
                                {article.readTime}
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-sm sm:text-[14px] text-white group-hover:text-[#ebd02a] transition-colors leading-tight line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-white/65 text-xs line-clamp-2 leading-relaxed">
                              {article.subheading}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-sans text-white/40 font-semibold group-hover:text-white transition-colors">
                            <span className="flex items-center gap-1">
                              Read full guide
                              <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-[#ebd02a]" />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white/[0.03] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
                      <span className="text-3xl">🔍</span>
                      <p className="text-sm font-sans font-medium text-white/80">No articles matching your filters were found.</p>
                      <button
                        onClick={() => { setBlogSearchQuery(""); setSelectedBlogCategory("All Guides"); }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-sans font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  )}

                  {/* PAGINATION NAVIGATION ELEMENT CONTROLS */}
                  {Math.ceil(ALL_BLOG_ARTICLES.filter(article => {
                    const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                    const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                          article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                          article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).length / 9) > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); }}
                        className="px-4 py-2 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        Previous
                      </button>

                      <span className="text-xs font-mono text-white/70">
                        Page <strong className="text-[#ebd02a]">{currentPage}</strong> of <strong>{
                          Math.ceil(ALL_BLOG_ARTICLES.filter(article => {
                            const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                            const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                  article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                  article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                            return matchesCategory && matchesSearch;
                          }).length / 9)
                        }</strong>
                      </span>

                      <button
                        disabled={currentPage === Math.ceil(ALL_BLOG_ARTICLES.filter(article => {
                          const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                          const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                          return matchesCategory && matchesSearch;
                        }).length / 9)}
                        onClick={() => { setCurrentPage(prev => Math.min(prev + 1, Math.ceil(ALL_BLOG_ARTICLES.filter(article => {
                          const matchesCategory = selectedBlogCategory === "All Guides" || article.category === selectedBlogCategory;
                          const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                article.subheading.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                                article.summary.toLowerCase().includes(blogSearchQuery.toLowerCase());
                          return matchesCategory && matchesSearch;
                        }).length / 9))); }}
                        className="px-4 py-2 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}
          </motion.div>
        </section>
      )}

    </main>

      {/* --- FOOTER SITE LINK ZONE (Full screen bottom alignment) --- */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center pt-6 border-t border-white/10">
        <motion.a 
          href="https://www.nexvy.in"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.02 }}
          className="font-sans text-[13px] sm:text-sm underline font-medium tracking-wide text-white transition-all duration-200"
        >
          www.nexvy.in
        </motion.a>
        
        <span className="text-xs text-white/45 tracking-widest uppercase font-mono">
          © Nexvy Premium
        </span>
      </footer>

    </div>
  );
}
