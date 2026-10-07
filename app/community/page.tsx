'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Search, 
  Filter, 
  Share2, 
  X,
  Send,
  HelpCircle
} from 'lucide-react';
import { FORUM_POSTS, ForumPost } from '@/lib/data';
import { useAppStore } from '@/lib/store';

export default function CommunityPage() {
  const { userProfile } = useAppStore();
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCropTag, setNewCropTag] = useState('Wheat');

  const tags = ['All', 'Wheat', 'Onion', 'Chilli', 'Cotton', 'Paddy', 'Bio-fertilizer'];

  const filteredPosts = posts.filter(p => {
    const matchesTag = selectedTag === 'All' || p.cropTag.toLowerCase() === selectedTag.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleLike = (id: string) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, upvotes: likedPosts[id] ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      author: userProfile?.name || 'Farmer',
      role: userProfile?.badge || 'Progressive Farmer',
      state: userProfile?.location || 'Ludhiana, Punjab',
      timeAgo: 'Just now',
      title: newTitle,
      content: newContent,
      cropTag: newCropTag,
      upvotes: 1,
      repliesCount: 0,
      expertAnswered: false
    };

    setPosts([newPost, ...posts]);
    setShowAskModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#DCE8D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F] flex items-center gap-1.5 mb-1">
            <Users className="w-4 h-4" /> Pan-India Farmer Community
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183326]">
            Krishi Manch Community Forum
          </h1>
          <p className="text-xs sm:text-sm text-[#607568] mt-1">
            Exchange peer field wisdom, ask agronomy questions, and receive certified answers from ICAR agri-scientists.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256640] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#2E7D4F]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Krishi Question</span>
        </button>
      </div>

      {/* Tags & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-[#2E7D4F] text-white shadow-md shadow-[#2E7D4F]/20'
                  : 'bg-[#F3F8F1] border border-[#DCE8D8] text-[#607568] hover:bg-[#E7F3E5] hover:text-[#183326]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#789087] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussion topics..."
            className="w-full bg-white border border-[#DCE8D8] rounded-xl pl-9 pr-3.5 py-2 text-[#183326] placeholder:text-[#789087] text-xs focus:outline-none focus:border-[#2E7D4F]"
          />
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4">
            
            {/* Post Author Bar */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-center font-bold text-[#2E7D4F]">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#183326]">{post.author}</div>
                  <div className="text-[10px] text-[#789087]">{post.role} • {post.state}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#E7F3E5] text-[#2E7D4F] border border-[#DCE8D8] text-[10px] font-semibold">
                  {post.cropTag}
                </span>
                <span className="text-[10px] text-[#789087]">{post.timeAgo}</span>
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="text-base font-bold text-[#183326]">{post.title}</h3>
              <p className="text-xs text-[#607568] mt-1.5 leading-relaxed">{post.content}</p>
            </div>

            {/* ICAR Expert Verified Answer if exists */}
            {post.expertAnswer && (
              <div className="p-4 rounded-xl bg-[#E7F3E5]/60 border border-[#2E7D4F]/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2E7D4F] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D4F]" />
                    Verified ICAR Agronomy Advisory:
                  </span>
                  <span className="text-[10px] text-[#789087]">{post.expertAnswer.date}</span>
                </div>
                <p className="text-xs text-[#183326] leading-relaxed font-sans">
                  {post.expertAnswer.answer}
                </p>
                <div className="text-[10px] text-[#2E7D4F] font-semibold pt-1">
                  By {post.expertAnswer.expertName} ({post.expertAnswer.designation})
                </div>
              </div>
            )}

            {/* Interactions footer */}
            <div className="pt-2 border-t border-[#DCE8D8] flex items-center justify-between text-xs text-[#789087]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-colors ${
                    likedPosts[post.id] ? 'text-[#2E7D4F] font-bold' : 'hover:text-[#183326]'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.upvotes} Helpful</span>
                </button>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.repliesCount} Responses</span>
                </span>
              </div>
              <button 
                onClick={() => alert(`Discussion link copied to clipboard!`)}
                className="hover:text-[#2E7D4F] flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F9FBF8] rounded-2xl max-w-lg w-full p-6 border border-[#DCE8D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <h3 className="font-bold text-[#183326] text-base">Ask Krishi Manch Community</h3>
              <button onClick={() => setShowAskModal(false)} className="text-[#789087] hover:text-[#183326]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#607568] font-semibold mb-1">Crop / Agricultural Domain:</label>
                <select
                  value={newCropTag}
                  onChange={(e) => setNewCropTag(e.target.value)}
                  className="w-full bg-white border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] focus:outline-none focus:border-[#2E7D4F]"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Onion">Onion</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Paddy">Paddy / Rice</option>
                  <option value="Bio-fertilizer">Bio-fertilizer & Soil Health</option>
                </select>
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Question Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prevent shoot borer in late sown mustard?"
                  className="w-full bg-white border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Detailed Field Observations:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe symptoms, weather conditions, current treatments applied..."
                  className="w-full bg-white border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256640] text-white font-bold transition-colors shadow-md shadow-[#2E7D4F]/20"
                >
                  Post to Krishi Manch
                </button>
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] hover:bg-[#E7F3E5] text-[#607568] font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </AuthGuard>
  );
}
