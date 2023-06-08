import encodeImageToBlurhash from "./encode";

export async function GET(request: Request) {
  const url = request.url;
  if (!url) {
    return new Response("Server error. URL not found.", { status: 500 });
  }

  const { searchParams } = new URL(url);
  const imgUrl = searchParams.get("imgUrl");

  if (!imgUrl) {
    return new Response("Query param 'imgUrl' is required.", { status: 400 });
  }

  try {
    const encodedData = await encodeImageToBlurhash(imgUrl);

    return new Response(JSON.stringify({ url: imgUrl, ...encodedData }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    let statusText = "";
    if (error instanceof Error) {
      statusText = error.message;
      console.log(`${error.message}`);
    }

    return new Response("Failed to generate the image blur-hash", {
      status: 500,
      statusText,
    });
  }
}
