import StoryboardCreator from '@/components/StoryboardCreator';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">AI-Powered Video Storyboard Creator</h1>
      <p className="text-center mb-8 text-lg">
        Create professional storyboards with ease using AI-generated scenes.
      </p>
      <div className="bg-secondary p-4 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-2">How to use:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Choose your preferred image style, aspect ratio, and resolution.</li>
          <li>Enter a detailed description for each scene in your storyboard.</li>
          <li>Click "Add Scene to Storyboard" to generate an AI-created image for your scene.</li>
          <li>Rearrange or delete scenes as needed.</li>
          <li>Preview your complete storyboard or export it as a text file.</li>
        </ol>
      </div>
      <StoryboardCreator />
    </main>
  );
}