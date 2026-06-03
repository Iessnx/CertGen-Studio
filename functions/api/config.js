export async function onRequest(context) {
  const { env } = context;
  const key = env.DEFAULT_API_KEY || '';

  return new Response(JSON.stringify({
    available: !!key
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
