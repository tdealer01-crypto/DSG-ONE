export async function browser_open({ url }: { url: string }) {
  if (!url) {
    throw new Error("missing url");
  }

  const res = await fetch(url);
  const text = await res.text();

  return {
    tool: "browser.open",
    ok: res.ok,
    data: {
      status: res.status,
      url,
      content: text.slice(0, 2000)
    }
  };
}
