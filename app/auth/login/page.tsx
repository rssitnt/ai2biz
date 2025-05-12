import Auth from '../../components/Auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-4">
      <div className="w-full max-w-md">
        <Auth />
      </div>
    </div>
  );
} 