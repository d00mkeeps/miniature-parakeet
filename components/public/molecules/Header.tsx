import Button from "../atoms/Button";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        {children}
        <Button href="/home" variant="primary" size="small">
          Home
        </Button>
        <Button href="/profile" variant="primary" size="small">
          Profile
        </Button>
        <Button href="/program" variant="primary" size="small">
          Programs
        </Button>
        <Button href="/workout/new" variant="primary" size="small">
          New Workout
        </Button>
      </div>
    </nav>
  );
}