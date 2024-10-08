import Button from "../public/atoms/Button";

export default function LandingPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
     
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">TrainSmart hero section</h2>
          <Button href="/home" variant="primary" size="large">
            Enter
          </Button>
        </main>
      </div>
      <div>
        <h2>BUY MY THINGS! (ONLY $3)</h2>
      </div>
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        This is a footer
      </footer>
    </div>
  );
}
