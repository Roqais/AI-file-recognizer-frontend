import { ThemeProvider } from "@/components/ThemeProvider";
import { FileOrganizer } from "@/components/FileOrganizer/FileOrganizer";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ai-file-organizer-theme">
      <div className="min-h-screen from-muted/50 to-muted py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Advanced File Organization System
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your documents and select an industry category. Our AI-powered system will organize your files based on their content and relevance.
            </p>
          </header>
          
          <main>
            <FileOrganizer />
          </main>
          
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>© 2025 AI File Organization System. All rights reserved.</p>
          </footer>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;