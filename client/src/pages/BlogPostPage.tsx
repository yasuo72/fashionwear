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
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BlogPostPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(342);

  // Mock blog post data (in real app, fetch from API)
  const post = {
    id: 1,
    title: "10 Must-Have Fashion Trends for 2025",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
    category: "Trends",
    author: "Priya Sharma",
    authorBio: "Fashion Editor & Style Consultant with 10+ years of experience",
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
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
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{post.author}</div>
                    <div className="text-xs">{post.authorBio}</div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-10" />
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

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-8 pb-8 border-b">
                <Button 
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLike}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likes}
                </Button>
                
                <Button 
                  variant={isSaved ? "default" : "outline"}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>

                <div className="flex-1"></div>

                <Button variant="outline" onClick={() => handleShare('Facebook')}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => handleShare('Twitter')}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => handleShare('LinkedIn')}>
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
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
              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share this article
                </h3>
                <div className="flex gap-3">
                  <Button onClick={() => handleShare('Facebook')} className="flex-1">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button onClick={() => handleShare('Twitter')} className="flex-1">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button onClick={() => handleShare('LinkedIn')} className="flex-1">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3">
                        {relatedPost.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
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
