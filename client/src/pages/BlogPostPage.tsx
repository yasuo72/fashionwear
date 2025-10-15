import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  User, 
  Clock, 
  Heart,
  Share2,
  Bookmark,
  Eye,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Instagram,
  MessageCircle,
  Send,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BlogPostPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(342);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Mock blog post data (in real app, fetch from API)
  const post = {
    id: 1,
    title: "10 Must-Have Fashion Trends for 2025",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop"
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual fashion video
    category: "Trends",
    author: "Priya Sharma",
    authorBio: "Fashion Editor & Style Consultant with 10+ years of experience",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    authorSocial: {
      instagram: "https://instagram.com/priyasharma",
      twitter: "https://twitter.com/priyasharma",
      linkedin: "https://linkedin.com/in/priyasharma"
    },
    date: "2024-10-10",
    readTime: "5 min read",
    views: 12500,
    tags: ["Fashion", "Trends", "2025", "Style"],
    content: `
      <p>As we step into 2025, the fashion world is buzzing with exciting new trends that promise to revolutionize our wardrobes. From sustainable fabrics to bold color palettes, this year is all about making a statement while being conscious of our choices.</p>

      <h2>1. Sustainable Luxury</h2>
      <p>Eco-friendly fashion is no longer a niche market—it's mainstream. Expect to see more brands incorporating recycled materials, organic fabrics, and ethical production methods. The focus is on quality over quantity, with investment pieces that last for years.</p>

      <h2>2. Bold Color Blocking</h2>
      <p>Say goodbye to neutral tones! 2025 is all about vibrant, contrasting colors. Think electric blue paired with hot pink, or emerald green with sunny yellow. The key is confidence—don't be afraid to experiment with unexpected combinations.</p>

      <h2>3. Oversized Everything</h2>
      <p>The oversized trend continues to dominate, but with a refined twist. Structured oversized blazers, roomy trousers, and voluminous dresses are the go-to pieces. The trick is to balance proportions—pair an oversized top with fitted bottoms or vice versa.</p>

      <h2>4. Tech-Infused Fashion</h2>
      <p>Wearable technology is seamlessly integrating into our clothing. From temperature-regulating fabrics to garments with built-in UV protection, fashion is becoming smarter and more functional.</p>

      <h2>5. Vintage Revival</h2>
      <p>Nostalgia is in! The 90s and early 2000s aesthetics are making a strong comeback. Think low-rise jeans, butterfly clips, and platform shoes. But this time, they're reimagined with a modern, sophisticated edge.</p>

      <h2>6. Maximalist Accessories</h2>
      <p>More is more when it comes to accessories. Chunky jewelry, oversized bags, and statement belts are essential for completing any look. Layer multiple pieces for maximum impact.</p>

      <h2>7. Gender-Fluid Fashion</h2>
      <p>The lines between menswear and womenswear continue to blur. Expect to see more unisex collections and androgynous silhouettes that celebrate individual expression over traditional gender norms.</p>

      <h2>8. Artisanal Craftsmanship</h2>
      <p>Hand-crafted details, intricate embroidery, and traditional techniques are being celebrated. Each piece tells a story, connecting us to the artisans and their cultural heritage.</p>

      <h2>9. Sheer Elegance</h2>
      <p>Transparency is trending! Sheer fabrics layered over solid pieces create depth and visual interest. It's a sophisticated way to show some skin while maintaining elegance.</p>

      <h2>10. Comfort Meets Couture</h2>
      <p>The pandemic taught us the value of comfort, and it's here to stay. Elevated loungewear, luxe athleisure, and soft tailoring prove that you don't have to sacrifice style for comfort.</p>

      <h2>Final Thoughts</h2>
      <p>2025's fashion trends are all about self-expression, sustainability, and breaking boundaries. The most important trend? Wearing what makes you feel confident and authentic. Fashion is personal, so take these trends as inspiration and make them your own!</p>
    `
  };

  const relatedPosts = [
    {
      id: 2,
      title: "The Ultimate Guide to Sustainable Fashion",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
      category: "Sustainability"
    },
    {
      id: 3,
      title: "How to Style Oversized Blazers Like a Pro",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop",
      category: "Style Tips"
    },
    {
      id: 4,
      title: "Seasonal Color Palettes: Fall/Winter 2024",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      category: "Trends"
    }
  ];

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    
    let shareUrl = '';
    switch(platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'WhatsApp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'Instagram':
        // Instagram doesn't support direct sharing via URL
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied!",
          description: "Paste this link in your Instagram story or bio",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    toast({
      title: "Shared!",
      description: `Article shared on ${platform}`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Article link copied to clipboard",
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.gallery.length) % post.gallery.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Navbar />
      
      <main className="flex-1">
        {/* Hero Image Gallery */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden group">
          <img 
            src={post.gallery[currentImageIndex]} 
            alt={post.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
          
          {/* Gallery Navigation */}
          {post.gallery.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Gallery Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <Card className="mb-8">
            <CardContent className="p-8 md:p-12">
              {/* Back Button */}
              <Link href="/blog">
                <Button variant="ghost" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>

              {/* Category Badge */}
              <Badge className="mb-4">{post.category}</Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.authorImage} 
                    alt={post.author}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <div className="font-medium text-foreground">{post.author}</div>
                    <div className="text-xs">{post.authorBio}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <a 
                        href={post.authorSocial.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <Instagram className="h-3 w-3" />
                      </a>
                      <a 
                        href={post.authorSocial.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <Twitter className="h-3 w-3" />
                      </a>
                      <a 
                        href={post.authorSocial.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-12" />
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {post.views.toLocaleString()} views
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b">
                <Button 
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLike}
                  size="sm"
                  className="gap-1.5 min-w-[70px]"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likes}</span>
                </Button>
                
                <Button 
                  variant={isSaved ? "default" : "outline"}
                  onClick={() => setIsSaved(!isSaved)}
                  size="sm"
                  className="min-w-[44px]"
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>

                <div className="flex-1 min-w-[20px]"></div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('Facebook')}
                    className="min-w-[44px]"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('Twitter')}
                    className="min-w-[44px]"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('LinkedIn')}
                    className="min-w-[44px]"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('WhatsApp')}
                    className="min-w-[44px] hidden xs:flex sm:flex"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('Instagram')}
                    className="min-w-[44px] hidden xs:flex sm:flex"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyLink}
                    className="min-w-[44px]"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Video Section */}
              {post.video && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Watch the Full Story
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={post.video}
                      title="Fashion Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Share Again */}
              <div className="mt-8 p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Love this article? Share it!
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  <Button 
                    onClick={() => handleShare('Facebook')} 
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
                  >
                    <Facebook className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Facebook</span>
                  </Button>
                  <Button 
                    onClick={() => handleShare('Twitter')} 
                    className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
                  >
                    <Twitter className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Twitter</span>
                  </Button>
                  <Button 
                    onClick={() => handleShare('LinkedIn')} 
                    className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
                  >
                    <Linkedin className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </Button>
                  <Button 
                    onClick={() => handleShare('WhatsApp')} 
                    className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                  >
                    <MessageCircle className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button 
                    onClick={() => handleShare('Instagram')} 
                    className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
                  >
                    <Instagram className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Instagram</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              You Might Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                        {relatedPost.category}
                      </Badge>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="secondary" className="rounded-full">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-5">
                      <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {relatedPost.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
