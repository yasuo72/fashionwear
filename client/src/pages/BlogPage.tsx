import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  TrendingUp, 
  Heart,
  Share2,
  Bookmark,
  Eye,
  ArrowRight,
  Sparkles,
  Filter,
  Loader2,
  Newspaper
} from "lucide-react";
import { Link } from "wouter";

// Mock blog data
const blogPosts = [
  {
    id: "1",
    title: "10 Must-Have Fashion Trends for 2025",
    excerpt: "Discover the hottest fashion trends that will dominate the runway and streets in 2025. From sustainable fabrics to bold colors...",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=500&fit=crop",
    category: "Trends",
    author: "Priya Sharma",
    date: "2024-10-10",
    readTime: "5 min read",
    views: 12500,
    likes: 342,
    featured: true,
    tags: ["Fashion", "Trends", "2025", "Style"]
  },
  {
    id: "2",
    title: "The Ultimate Guide to Sustainable Fashion",
    excerpt: "Learn how to build a sustainable wardrobe without compromising on style. Tips for eco-friendly shopping and ethical brands...",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop",
    category: "Sustainability",
    author: "Rahul Mehta",
    date: "2024-10-08",
    readTime: "8 min read",
    views: 9800,
    likes: 256,
    featured: true,
    tags: ["Sustainable", "Eco-Friendly", "Green Fashion"]
  },
  {
    id: "3",
    title: "How to Style Oversized Blazers Like a Pro",
    excerpt: "Master the art of wearing oversized blazers with our expert styling tips. From casual to formal looks...",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=500&fit=crop",
    category: "Style Tips",
    author: "Ananya Desai",
    date: "2024-10-05",
    readTime: "6 min read",
    views: 8200,
    likes: 198,
    featured: false,
    tags: ["Styling", "Blazers", "Fashion Tips"]
  },
  {
    id: "4",
    title: "Seasonal Color Palettes: Fall/Winter 2024",
    excerpt: "Explore the most stunning color combinations for the upcoming season. From warm earth tones to vibrant jewel colors...",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop",
    category: "Trends",
    author: "Vikram Singh",
    date: "2024-10-03",
    readTime: "7 min read",
    views: 11300,
    likes: 287,
    featured: false,
    tags: ["Colors", "Seasonal", "Fall", "Winter"]
  },
  {
    id: "5",
    title: "Building a Capsule Wardrobe: Essentials Guide",
    excerpt: "Simplify your closet with our comprehensive guide to creating a versatile capsule wardrobe that works for every occasion...",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=500&fit=crop",
    category: "Wardrobe",
    author: "Sneha Patel",
    date: "2024-09-28",
    readTime: "10 min read",
    views: 15600,
    likes: 421,
    featured: true,
    tags: ["Capsule Wardrobe", "Minimalism", "Essentials"]
  },
  {
    id: "6",
    title: "Accessorizing 101: Elevate Your Outfit",
    excerpt: "Transform any basic outfit into a statement look with the right accessories. Learn the dos and don'ts...",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=500&fit=crop",
    category: "Accessories",
    author: "Arjun Kapoor",
    date: "2024-09-25",
    readTime: "5 min read",
    views: 7400,
    likes: 165,
    featured: false,
    tags: ["Accessories", "Jewelry", "Styling"]
  }
];

const categories = ["All", "Trends", "Style Tips", "Sustainability", "Wardrobe", "Accessories"];

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  featured: boolean;
  tags: string[];
  source?: string;
  url?: string;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [allPosts, setAllPosts] = useState<NewsArticle[]>([...blogPosts]);
  const [displayedPosts, setDisplayedPosts] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const POSTS_PER_PAGE = 6;

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const trendingPosts = [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 5);

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Fashion Insights & Inspiration</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                FashionFusion Blog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Stay ahead of the curve with expert fashion advice, trend forecasts, and style inspiration
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles, trends, tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-2 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Carousel */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                Featured Stories
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 backdrop-blur-sm">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                        onClick={() => toggleSave(post.id)}
                      >
                        <Bookmark 
                          className={`h-4 w-4 ${savedPosts.includes(post.id) ? 'fill-primary text-primary' : ''}`} 
                        />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{post.author}</span>
                      </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="group/btn">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Categories
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <Badge variant="secondary" className="ml-auto">
                          {category === "All" 
                            ? blogPosts.length 
                            : blogPosts.filter(p => p.category === category).length
                          }
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Trending Posts */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Trending Now
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trendingPosts.map((post, index) => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <div className="flex gap-3 group cursor-pointer">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {post.views.toLocaleString()} views
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10">
                  <CardContent className="pt-6">
                    <Sparkles className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest fashion insights delivered to your inbox
                    </p>
                    <Input placeholder="Your email" className="mb-2" />
                    <Button className="w-full">Subscribe</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Blog Posts Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory === "All" ? "All Articles" : selectedCategory}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="relative overflow-hidden h-48">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">{post.author}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {(post.views / 1000).toFixed(1)}k
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <Card className="p-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
