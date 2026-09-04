import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";
import { format } from "date-fns";

interface ContentProps {
  contentID: string;
  contentURL: string;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface AppleNotesState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] dark:bg-[#1e1e1e] text-[#000000] dark:text-white">
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#dbdbdb] dark:border-[#323232]">
        <span className="text-sm font-medium">Notes</span>
        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e4e4e4] dark:hover:bg-[#2d2d2d]">
          <span className="i-material-symbols:edit-square-outline text-xl" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="py-1">
          {bear.map((item, index) => (
            <li
              key={`notes-sidebar-${item.id}`}
              className={`px-4 h-8 flex items-center cursor-default text-sm ${
                cur === index
                  ? "bg-[#d8d8d8] dark:bg-[#323232]"
                  : "hover:bg-[#ebebeb] dark:hover:bg-[#2a2a2a]"
              }`}
              onClick={() => setMidBar(item.md, index)}
            >
              <span className={`${item.icon} mr-2`} />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <div className="flex flex-col h-full bg-[#ffffff] dark:bg-[#1e1e1e] border-r border-[#dbdbdb] dark:border-[#323232]">
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#dbdbdb] dark:border-[#323232]">
        <span className="text-sm font-medium text-[#000000] dark:text-white">
          All Notes
        </span>
        <div className="flex items-center space-x-2">
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f1f1f1] dark:hover:bg-[#2d2d2d]">
            <span className="i-material-symbols:view-agenda-outline text-xl text-[#666666] dark:text-white" />
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f1f1f1] dark:hover:bg-[#2d2d2d]">
            <span className="i-material-symbols:add text-xl text-[#666666] dark:text-white" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ul>
          {items.map((item: BearMdData, index: number) => (
            <li
              key={`notes-midbar-${item.id}`}
              className={`p-3 cursor-default border-b border-[#dbdbdb] dark:border-[#323232] ${
                cur === index
                  ? "bg-[#ffffff] dark:bg-[#323232]"
                  : "hover:bg-[#f6f6f6] dark:hover:bg-[#2a2a2a]"
              }`}
              onClick={() => setContent(item.id, item.file, index)}
            >
              <div className="text-sm font-medium mb-1 text-[#000000] dark:text-white">
                {item.title}
              </div>
              <div className="text-xs text-[#666666] dark:text-[#999999] line-clamp-2">
                {item.excerpt}
              </div>
              <div className="text-xs text-[#999999] dark:text-[#666666] mt-1">
                {format(new Date(), "MMM d, yyyy")}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            storeMd[id] = text;
            setStoreMd({ ...storeMd });
          })
          .catch((error) => console.error(error));
      }
    },
    [storeMd]
  );

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  return (
    <div className="h-full flex flex-col bg-[#ffffff] dark:bg-[#1e1e1e]">
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#dbdbdb] dark:border-[#323232]">
        <div className="flex items-center space-x-2">
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f1f1f1] dark:hover:bg-[#2d2d2d]">
            <span className="i-material-symbols:share-outline text-xl text-[#666666] dark:text-white" />
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f1f1f1] dark:hover:bg-[#2d2d2d]">
            <span className="i-material-symbols:more-horiz text-xl text-[#666666] dark:text-white" />
          </button>
        </div>
        <div className="text-xs text-[#666666] dark:text-[#999999]">
          Edited {format(new Date(), "MMM d, yyyy")}
        </div>
      </div>
      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="max-w-3xl mx-auto text-[#000000] dark:text-white">
          <ReactMarkdown
            className="notes prose dark:prose-invert max-w-none"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeKatex,
              [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
            ]}
            components={Highlighter(dark as boolean)}
          >
            {storeMd[contentID]}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const AppleNotes = () => {
  const [state, setState] = useState<AppleNotesState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
  };

  return (
    <div className="flex h-full font-sf-pro text-sm">
      <div className="w-48">
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>
      <div className="w-64">
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>
      <div className="flex-1">
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default AppleNotes;
