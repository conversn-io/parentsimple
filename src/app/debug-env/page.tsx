export default function DebugEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">NEXT_PUBLIC_SUPABASE_URL</h2>
          <p className="bg-gray-100 p-2 rounded font-mono text-sm">
            {supabaseUrl || 'NOT SET'}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</h2>
          <p className="bg-gray-100 p-2 rounded font-mono text-sm">
            {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET'}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <p className={`p-2 rounded ${supabaseUrl && supabaseAnonKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {supabaseUrl && supabaseAnonKey ? 'Environment variables are loaded' : 'Environment variables are missing'}
          </p>
        </div>
      </div>
    </div>
  )
}





