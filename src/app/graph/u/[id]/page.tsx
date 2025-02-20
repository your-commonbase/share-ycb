/* eslint-disable @typescript-eslint/no-explicit-any */

// app/u/[id]/page.tsx
import CopyButton from "@/components/CopyButton";

async function getData(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-upload?id=${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data"); // todo: should 404 here
  }
  const { data } = await res.json();
  return data;
}

type Params = {
  id: string;
};

type PageProps = {
  params: Promise<Params>;
};

function makeLinksClickable(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getData(resolvedParams.id);

  return (
    <div className="flex flex-col gap-2 m-4">
      <CopyButton id={resolvedParams.id} />
      <div className="block max-w-100 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {data.json.data.entry}
        </p>
      </div>

      {/* comments = yellow border */}
      {data.json.data.comments?.map((comment: any, i: number) => (
        <div
          key={i}
          className="block max-w-100 p-6 bg-white border border-yellow-500 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-4"
        >
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {comment.comment}
          </p>
          {comment.penPals?.map((p: any, j: number) => (
            <div
              key={j}
              className="block max-w-100 p-4 mt-2 bg-white border border-yellow-500 rounded-lg shadow"
            >
              <p className="font-normal text-sm text-gray-300 dark:text-gray-400">
                {p.id}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {p.data}
              </p>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {makeLinksClickable(
                  JSON.stringify(JSON.parse(p.metadata), null, 2)
                )}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* expansions = gray border */}
      {data.json.data.expansion?.map((expansion: any, i: number) => (
        <div
          key={i}
          className="block max-w-100 p-6 bg-white border border-gray-400 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-4"
        >
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Parent ID: {expansion.parent}
          </p>
          {expansion.children?.map((child: any, j: number) => (
            <div
              key={j}
              className="block max-w-100 p-4 mt-2 bg-white border border-gray-400 rounded-lg shadow"
            >
              <p className="font-normal text-sm text-gray-300 dark:text-gray-400">
                {child.id}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {child.data}
              </p>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {makeLinksClickable(
                  JSON.stringify(JSON.parse(child.metadata), null, 2)
                )}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* neighbors (relations) = green border */}
      {data.json.data.neighbors?.map((neighbor: any, i: number) => (
        <div
          key={i}
          className="block max-w-100 p-6 bg-white border border-green-500 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-4"
        >
          <p className="font-normal text-sm text-gray-300 dark:text-gray-400">
                {neighbor.id}
          </p>
          {neighbor.image && (
            <img
              src={`${neighbor.image}`}
              alt="thumbnail"
              style={{ width: "80%" }}
            />
          )}
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {neighbor.data}
          </p>
          <span className="block text-sm text-gray-500 dark:text-gray-400">
            {makeLinksClickable(
              JSON.stringify(JSON.parse(neighbor.metadata), null, 2)
            )}
          </span>
        </div>
      ))}

      {/* internal links = red border */}
      {data.json.data.internalLinks?.map((link: any, i: number) => (
        <div
          key={i}
          className="block max-w-100 p-6 bg-white border border-red-500 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-4"
        >
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Internal Link: {link.internalLink}
          </p>
          {link.penPals?.map((penPal: any, j: number) => (
            <div
              key={j}
              className="block max-w-100 p-4 mt-2 bg-white border border-red-500 rounded-lg shadow"
            >
              <p className="font-normal text-sm text-gray-300 dark:text-gray-400">
                {penPal.id}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {penPal.data}
              </p>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                {makeLinksClickable(
                  JSON.stringify(JSON.parse(penPal.metadata), null, 2)
                )}
              </span>
            </div>
          ))}
        </div>
      ))}
      <CopyButton id={resolvedParams.id} />
    </div>
  );
}
