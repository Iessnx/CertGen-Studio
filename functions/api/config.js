export async function onRequest(context) {
  const { env } = context;
  const key = env.DEFAULT_API_KEY || '';
  const url = env.DEFAULT_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  const model = env.DEFAULT_MODEL || 'glm-5.1';

  // 只返回是否可用，不暴露 Key 本身
  return new Response(JSON.stringify({
    available: !!key,
    url: url,
    model: model
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
