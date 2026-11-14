export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid");

    if (!uid) {
      return new Response(JSON.stringify({ error: "Missing uid parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const targetUrl = `https://ob55-info-api.lovable.app/api/player-info?uid=${uid}&key=RISHANT`;

    try {
      const resp = await fetch(targetUrl);

      if (resp.status === 200) {
        const data = await resp.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        const text = await resp.text();

        if (text.includes("Player not found")) {
          return new Response(JSON.stringify({ 
            detail: "Upstream error: {\"error\":\"Player not found\"}\n" 
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({ error: "System error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "System error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
