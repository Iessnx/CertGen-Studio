export async function onRequest(context) {
  const { request, env } = context;
  const apiKey = env.DEFAULT_API_KEY || '';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: '服务未配置，请使用自己的 API Key' } }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.text();
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: '读取请求失败' } }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: '请求格式错误' } }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const model = parsed.model || '';
  let targetUrl = env.DEFAULT_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  if (model.startsWith('deepseek')) targetUrl = 'https://api.deepseek.com/v1/chat/completions';
  else if (model.startsWith('gpt') || model.startsWith('o')) targetUrl = 'https://api.openai.com/v1/chat/completions';
  else if (model.startsWith('qwen') || model.startsWith('qwq')) targetUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify(parsed),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await resp.text();
    return new Response(data, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    const msg = e.name === 'AbortError' ? '上游请求超时' : '请求失败: ' + e.message;
    return new Response(JSON.stringify({ error: { message: msg } }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }
}
