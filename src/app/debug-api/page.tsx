import { supabase } from '@/lib/supabase'

export default async function DebugApiPage() {
  try {
    // Test basic connection
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, status')
      .eq('status', 'published')
      .limit(5)

    if (error) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
          <pre className="bg-red-50 p-4 rounded border">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Published Articles ({articles?.length || 0})</h2>
          {articles && articles.length > 0 ? (
            <ul className="space-y-2">
              {articles.map((article) => (
                <li key={article.id} className="p-3 bg-gray-50 rounded border">
                  <div className="font-medium">{article.title}</div>
                  <div className="text-sm text-gray-600">Slug: {article.slug}</div>
                  <div className="text-sm text-gray-600">Status: {article.status}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No published articles found</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Test Links</h2>
          <div className="space-y-2">
            {articles?.slice(0, 3).map((article) => (
              <div key={article.id}>
                <a 
                  href={`/content/${article.slug}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Test: {article.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unexpected Error</h1>
        <pre className="bg-red-50 p-4 rounded border">{String(error)}</pre>
      </div>
    )
  }
}





