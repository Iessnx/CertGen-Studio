export async function onRequest(context) {
  const { env } = context;
  const key = env.DEFAULT_API_KEY || '';
  const model = env.DEFAULT_MODEL || '';

  return new Response(JSON.stringify({
    available: !!key,
    model: model || undefined
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
