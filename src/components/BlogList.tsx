import React, { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, Eye, User, Tag, ArrowRight, PenTool, ArrowUp, Github, Share2 } from 'lucide-react';
import { BlogPost } from '../types';
import { postService } from '../services/postService';
import { profileService } from '../services/profileService';
import { mockCategories } from '../data/mockData';

interface BlogListProps {
  onSelectPost: (post: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onSelectPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load posts and authors when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [postsData, authorsData] = await Promise.all([
          postService.getPublishedPosts(),
          profileService.getAllProfiles()
        ]);
        setPosts(postsData);
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const featuredPosts = posts.filter(post => post.isFeature);
  const regularPosts = posts.filter(post => !post.isFeature);

  const filteredPosts = regularPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorName = (authorId: string) => {
    const author = authors.find(user => user.id === authorId);
    return author ? author.name : 'Непознат аутор';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareFacebook = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = encodeURIComponent(`${window.location.origin}#post-${post.id}`);
    const title = encodeURIComponent(post.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
  };

  const handleShareTelegram = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = encodeURIComponent(`${window.location.origin}#post-${post.id}`);
    const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const handleGeneralShare = async (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = `${window.location.origin}#post-${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(url);
      alert('Линк је копиран у клипборд!');
    }
  };

  const PostCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured = false }) => (
    <article 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        featured ? 'lg:col-span-2' : ''
      }`}
      onClick={() => onSelectPost(post)}
    >
      {post.featuredImage && (
        <div className={`relative ${featured ? 'h-64' : 'h-48'}`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {featured && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Издвојено
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{getAuthorName(post.authorId)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </div>
        </div>

        <h2 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          {post.title}
        </h2>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{post.category}</span>
            </div>
          </div>
          
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
            <span>Читај више</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Подели:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => handleGeneralShare(post, e)}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
              title="Подели"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => handleShareFacebook(post, e)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Подели на Facebook"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button
              onClick={(e) => handleShareTelegram(post, e)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Подели на Telegram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </button>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 py-16 relative overflow-hidden">
        {/* Falling Leaves Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="leaf leaf-1">🍂</div>
          <div className="leaf leaf-2">🍂</div>
          <div className="leaf leaf-3">🍂</div>
          <div className="leaf leaf-4">🍂</div>
          <div className="leaf leaf-5">🍂</div>
          <div className="leaf leaf-6">🍂</div>
          <div className="leaf leaf-7">🍂</div>
          <div className="leaf leaf-8">🍂</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Заплањске приче
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Чувамо традицију, делимо приче и негујемо културу заплањског краја кроз речи наших писаца
            </p>
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-amber-50/10 backdrop-blur-sm rounded-lg p-6 text-left">
                <h2 className="text-2xl font-semibold mb-4 text-center">О нама</h2>
                <p className="text-lg text-amber-100 leading-relaxed mb-4">
                  Чувамо традицију, делимо приче и негујемо културу заплањског краја
                </p>
                <p className="text-lg text-amber-100 leading-relaxed mb-4">
                  "Заплањске приче" је блог посвећен чувању и преношењу богате традиције, културе и историје заплањског краја. Кроз речи наших талентованих аутора, трудимо се да сачувамо од заборава приче, обичаје и мудрост наших предака.
                </p>
                <p className="text-lg text-amber-100 leading-relaxed mb-4">
                  Овај крај, смештен у срцу Балкана, одувек је био раскрсница култура и цивилизација. Његове планине, реке и села чувају у себи небројене приче које заслужују да буду испричане и пренете будућим генерацијама.
                </p>
                <p className="text-lg text-amber-100 leading-relaxed">
                  Наш блог је место где се сусрећу прошлост и садашњост, где традиција живи кроз савремене речи, а где сваки чланак представља мост између онога што јесмо и онога одакле долазимо.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'register' });
                  window.dispatchEvent(event);
                }}
                className="border-2 border-amber-50 text-amber-50 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5" />
                  <span>Придружи се ауторима</span>
                </div>
              </button>
              <a
                href="https://github.com/schebet/MultiAutorBlogingNeschko"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-amber-50 text-amber-50 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Github className="h-5 w-5" />
                  <span>GitHub пројекат</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Претражи чланке..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-800 text-amber-50'
                  : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              Све категорије
            </button>
            {mockCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                   ? 'bg-amber-800 text-amber-50'
                   : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Издвојени чланци</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <PostCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Најновији чланци</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Учитавање чланака...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Нема чланака који одговарају вашем избору.</p>
            </div>
          )}
        </section>

        {/* Categories Sidebar */}
        <aside className="mt-12 bg-amber-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Категорије</h3>
          <div className="space-y-2">
            {mockCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedCategory(category.name)}
                  className="text-gray-700 hover:text-amber-800 transition-colors"
                >
                  {category.name}
                </button>
                <span className="text-sm text-gray-500">{category.postCount}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-amber-800 text-amber-50 p-3 rounded-full shadow-lg hover:bg-amber-900 transition-all duration-300 z-50 hover:scale-110"
          title="Повратак на врх"
        >
          <div className="flex items-center justify-center">
            <PenTool className="h-5 w-5" />
            <ArrowUp className="h-4 w-4 ml-1" />
          </div>
        </button>
      )}
    </div>
  );
};

export default BlogList;