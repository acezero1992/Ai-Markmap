export async function onRequest(context) {
  // 从 Cloudflare 后台设置获取变量
  const API_KEY = context.env.API_KEY; 
  const API_BASE = context.env.API_BASE || 'https://api.openai.com'; // 你的 API 提供商地址

  // 获取前端发来的请求数据
  const originalRequest = context.request;

  // 检查是否配置了 API Key
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: '后端未配置 API Key' }), { status: 500 });
  }

  // 构建发给 OpenAI (或中转站) 的新请求
  const url = new URL(originalRequest.url);
  // 替换成真正的 API 地址
  const targetUrl = `${API_BASE}/v1/chat/completions`;

  // 复制原本的 Headers，但我们要覆盖 Authorization
  const newHeaders = new Headers(originalRequest.headers);
  newHeaders.set('Authorization', `Bearer ${API_KEY}`);
  // 有些中转商不需要 host header，或者需要重置
  newHeaders.delete('Host'); 

  // 发起真正的请求
  const response = await fetch(targetUrl, {
    method: originalRequest.method,
    headers: newHeaders,
    body: originalRequest.body
  });

  return response;
}
