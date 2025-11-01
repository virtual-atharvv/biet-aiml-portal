import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BIET</h1>
              <p className="text-sm text-muted-foreground">Department of AIML</p>
            </div>
          </div>
          <Link to="/login">
            <Button>Admin Login</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bansal Institute of Engineering and Technology
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Department of Artificial Intelligence and Machine Learning
          </p>
          <p className="text-lg text-foreground">
            Empowering future innovators through cutting-edge AI and ML education
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-t-4 border-t-primary hover:shadow-elevated transition-shadow">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Quality Education</CardTitle>
              <CardDescription>
                Comprehensive curriculum designed for excellence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-secondary hover:shadow-elevated transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-secondary mb-2" />
              <CardTitle>Expert Faculty</CardTitle>
              <CardDescription>
                Learn from industry leaders and experienced professors
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-primary hover:shadow-elevated transition-shadow">
            <CardHeader>
              <Award className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Modern Labs</CardTitle>
              <CardDescription>
                State-of-the-art facilities for hands-on learning
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-secondary hover:shadow-elevated transition-shadow">
            <CardHeader>
              <GraduationCap className="w-10 h-10 text-secondary mb-2" />
              <CardTitle>Career Success</CardTitle>
              <CardDescription>
                Strong placement support and industry connections
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">About Our Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              The AIML department at BIET offers a comprehensive program combining theoretical
              knowledge with practical applications. Our curriculum covers machine learning,
              deep learning, natural language processing, computer vision, and more.
            </p>
            <p className="text-foreground">
              Students gain hands-on experience through projects, internships, and research
              opportunities, preparing them for successful careers in the rapidly evolving
              field of artificial intelligence.
            </p>
            <div className="flex justify-center pt-4">
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  Access Admin Portal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center border-t mt-12">
        <p className="text-muted-foreground">
          © @ananta
        </p>
      </footer>
    </div>
  );
};

export default Index;
